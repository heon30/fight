// Executes the shipped browser program with a minimal DOM/canvas adapter.
// Uses real WebSocket connections. This is a client integration test, not browser QA.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {WebSocket} from '../server/vendor/ws/wrapper.mjs';
import {createRealtimeServer} from '../server/realtime.mjs';
const html=fs.readFileSync('game.html','utf8'),source=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function makeClient(host){const timers=new Set(),elements=new Map(),listeners=new Map();
 const canvas=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:10})},{get:(o,k)=>k in o?o[k]:()=>{}});
 const element=()=>{const children=[],classes=new Set();return {style:{},dataset:{},value:'',children,firstChild:{getContext:()=>canvas},classList:{add(...x){x.forEach(v=>classes.add(v))},remove(...x){x.forEach(v=>classes.delete(v))},contains:x=>classes.has(x),toggle(x,value){if(value??!classes.has(x))classes.add(x);else classes.delete(x)}},append:(...x)=>children.push(...x),replaceChildren(...x){children.splice(0,children.length,...x)},getContext:()=>canvas,setAttribute(){},addEventListener(){},querySelector:()=>element(),focus(){},setPointerCapture(){}}};
 const document={body:element(),getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:()=>element(),querySelector:()=>element(),querySelectorAll:()=>[],addEventListener(){}};
 const window={addEventListener:(event,fn)=>{if(!listeners.has(event))listeners.set(event,[]);listeners.get(event).push(fn)}};
 const timeout=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id};
 const ctx=vm.createContext({console,document,window,navigator:{maxTouchPoints:0},location:{protocol:'http:',host},performance,WebSocket,AbortController,setTimeout:timeout,clearTimeout:id=>{timers.delete(id);clearTimeout(id)},requestAnimationFrame:()=>{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},fetch:(url,opts)=>fetch('http://'+host+url,opts)});
 vm.runInContext(source+`;globalThis.testClient={chooseMode,command,net,remoteBuffer,liveTransport,renderNet,loop, key(code,down){for(const f of window.listeners?.get(down?'keydown':'keyup')||[])f({code,repeat:false,preventDefault(){}})}};`,ctx);
 window.listeners=listeners;
 return {api:ctx.testClient,async close(){ctx.testClient.stopNet?.();ctx.testClient.liveTransport.close();for(const t of timers)clearTimeout(t)},elements};
}
const app=createRealtimeServer({port:0,host:'127.0.0.1'}),address=await app.listen();const clients=[];
try{const a=makeClient('127.0.0.1:'+address.port),b=makeClient('127.0.0.1:'+address.port);clients.push(a,b);a.api.chooseMode('multi');b.api.chooseMode('multi');await sleep(60);assert.ok(a.api.liveTransport.ready&&b.api.liveTransport.ready);
 await a.api.command('create');await a.api.command('participate',{play:true});await b.api.command('join',{code:a.api.net.session.code,name:'실제 클라이언트 B'});
 for(const c of clients){await c.api.command('character',{fighter:0});await c.api.command('ready',{ready:true})}
 await a.api.command('settings',{mode:'brawl',map:0});await a.api.command('start');
 const code=a.api.net.session.code,row=app.sql.prepare('SELECT state FROM fighter_rooms WHERE code=?').get(code),room=JSON.parse(row.state);room.battle.countdown=0;room.battle.players[0].x=100;room.battle.players[1].x=1050;app.sql.prepare('UPDATE fighter_rooms SET state=?,rev=rev+1 WHERE code=?').run(JSON.stringify(room),code);await sleep(80);
 a.api.key('KeyD',true);b.api.key('KeyA',true);
 for(let i=0;i<30;i++){await sleep(16);for(const c of clients)c.api.loop(performance.now())}
 const r=a.api.net.room,p1=r.battle.players.find(p=>p.id===a.api.net.session.id),p2=r.battle.players.find(p=>p.id===b.api.net.session.id);assert.ok(p1.x>140&&p2.x<1010,'both shipped clients send held input');assert.equal(a.api.net.predicted,null,'no local-only future pose');assert.equal(b.api.net.predicted,null);
 const now=performance.now(),pA=a.api.remoteBuffer.sample(now),pB=b.api.remoteBuffer.sample(now),difference=Math.abs(pA.battle.players[0].x-pB.battle.players[0].x);assert.ok(difference<12);
 a.api.key('KeyD',false);b.api.key('KeyA',false);await sleep(100);const values=app.sql.prepare('SELECT input FROM fighter_inputs WHERE room=?').all(code).map(r=>JSON.parse(r.input));assert.ok(values.every(v=>!v.held.left&&!v.held.right),'keyup reaches server');
 a.api.key('KeyW',true);b.api.key('KeyW',true);await sleep(100);a.api.key('KeyW',false);b.api.key('KeyW',false);await sleep(30);
 const airborne=JSON.parse(app.sql.prepare('SELECT state FROM fighter_rooms WHERE code=?').get(code).state).battle.players;assert.ok(airborne.every(p=>p.y<540&&p.jumps>=1),'both clients jump together');
 const results={passed:true,shippedClientPrograms:2,realSockets:true,keyboardInput:true,renderFunctionExecuted:true,noLocalOnlyPrediction:true,screenDifferencePx:+difference.toFixed(3),keyRelease:true,simultaneousJump:true};fs.writeFileSync('tests/full-client-results.json',JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results));
}finally{for(const c of clients)await c.close();await app.close()}
