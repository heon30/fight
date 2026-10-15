import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {performance} from 'node:perf_hooks';
import {WebSocket} from '../server/vendor/ws/wrapper.mjs';
import {createRealtimeServer} from '../server/realtime.mjs';
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('tests/snapshot-buffer.js','utf8')+';globalThis.B=BattleBuffer',ctx);const B=ctx.B;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function client(url){const ws=new WebSocket(url),pending=new Map(),buffer=new B();let serial=0,session={},room=null,states=0;
 await new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject)});
 ws.on('message',bytes=>{const msg=JSON.parse(bytes.toString());if(msg.id&&pending.has(msg.id)){const p=pending.get(msg.id);pending.delete(msg.id);buffer.observeClock(msg.data.serverNow,p.sent,performance.now());if(msg.status>=400)p.reject(new Error(msg.data.error));else p.resolve(msg.data)}else if(msg.type==='state'){assert.ok(!JSON.stringify(msg.room).includes(session.token),'broadcast must not contain credentials');room=msg.room;buffer.push(room,performance.now());states++}});
 return {ws,buffer,get room(){return room},get states(){return states},get session(){return session},set session(value){session=value},async api(action,extra={}){const id=++serial;return new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('RPC timeout '+action)),3000);pending.set(id,{sent:performance.now(),resolve:v=>{clearTimeout(timeout);resolve(v)},reject:e=>{clearTimeout(timeout);reject(e)}});ws.send(JSON.stringify({id,body:{...session,action,...extra}}))})},input(seq,held){ws.send(JSON.stringify({type:'input',body:{...session,action:'input',seq,held,edges:{jump:0,skill:0,ultimate:0}}}))}};
}
const app=createRealtimeServer({port:0,host:'127.0.0.1',playbackDelayMs:100});const address=await app.listen();const url='ws://127.0.0.1:'+address.port+'/api/live';
let cases=0,receivedFrames=0,maxPairDifference=0;const sockets=[];
try{for(const count of [2,4,8,30]){const players=[];
 const host=await client(url);sockets.push(host.ws);const created=await host.api('create');host.session={code:created.code,token:created.token,role:'host'};
 const participation=await host.api('participate',{play:true});host.session={...host.session,id:participation.id};players.push(host);
 for(let i=1;i<count;i++){const p=await client(url);sockets.push(p.ws);const joined=await p.api('join',{code:created.code,name:'P'+i});p.session={code:created.code,id:joined.id,token:joined.token};players.push(p)}
 for(let i=0;i<count;i++){await players[i].api('character',{fighter:0});await players[i].api('ready',{ready:true})}
 await host.api('settings',{mode:'brawl',map:0});await host.api('start');
 const row=app.sql.prepare('SELECT * FROM fighter_rooms WHERE code=?').get(created.code),room=JSON.parse(row.state);room.battle.countdown=0;room.battle.players.forEach(p=>{p.x=p.team?1050:100;p.y=540;p.ground=true});app.sql.prepare('UPDATE fighter_rooms SET state=?,rev=rev+1 WHERE code=?').run(JSON.stringify(room),created.code);
 for(let i=0;i<count;i++)players[i].input(10,i%2?{left:true}:{right:true});
 // No participant polls while the authoritative server ticks/broadcasts.
 for(let i=0;i<30;i++){await sleep(15);const now=performance.now(),a=players[0].buffer.sample(now),b=players[1].buffer.sample(now);if(a&&b&&i>12)maxPairDifference=Math.max(maxPairDifference,Math.abs(a.battle.players[0].x-b.battle.players[0].x))}
 const state=JSON.parse(app.sql.prepare('SELECT state FROM fighter_rooms WHERE code=?').get(created.code).state);
 for(let i=0;i<count;i++){const p=state.battle.players.find(p=>p.id===players[i].session.id);assert.ok(i%2?p.x<1010:p.x>140,'every participant moves at the same time');}
 for(const p of players){assert.ok(p.states>=5,'server broadcasts without polls');receivedFrames+=p.states;p.input(20,{})}
 // Late sequence cannot overwrite a new release, even within one server tick.
 players[0].input(22,{});players[0].input(21,{left:true});await sleep(80);const input=app.sql.prepare('SELECT seq,input FROM fighter_inputs WHERE id=?').get(players[0].session.id);assert.equal(input.seq,22);assert.equal(!!JSON.parse(input.input).held.left,false);
 await host.api('pause');const frozen=JSON.parse(app.sql.prepare('SELECT state FROM fighter_rooms WHERE code=?').get(created.code).state).battle.lastTick;await sleep(60);assert.equal(JSON.parse(app.sql.prepare('SELECT state FROM fighter_rooms WHERE code=?').get(created.code).state).battle.lastTick,frozen);
 await host.api('pause');await host.api('lobby');await host.api('close');for(const p of players)p.ws.close();cases++;
}
assert.ok(maxPairDifference<12,'real socket clients display matching positions');
const results={passed:true,realWebSocketRooms:cases,players:[2,4,8,30],simultaneousMovement:true,serverAdvancesWithoutPolling:true,receivedSnapshots:receivedFrames,maxScreenDifferencePx:+maxPairDifference.toFixed(3),staleInputIgnored:true,pauseResume:true};fs.writeFileSync('tests/websocket-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
}finally{for(const ws of sockets)ws.terminate();await app.close()}
