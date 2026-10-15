import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import {WebSocketServer} from './vendor/ws/wrapper.mjs';
import {createBattle,stepBattle} from '../app/game-core.js';

const root=fileURLToPath(new URL('../',import.meta.url));
export function createRealtimeServer({port=3000,host='0.0.0.0',database=':memory:',playbackDelayMs=100,now=()=>Date.now()}={}){
 const sql=new DatabaseSync(database);sql.exec('PRAGMA journal_mode=WAL;');
 // Standalone server owns its database; Sites migrations remain unchanged.
 sql.exec('CREATE TABLE IF NOT EXISTS fighter_rooms(code TEXT PRIMARY KEY,host TEXT NOT NULL,state TEXT NOT NULL,rev INTEGER NOT NULL DEFAULT 0,updated INTEGER NOT NULL);CREATE TABLE IF NOT EXISTS fighter_inputs(id TEXT PRIMARY KEY,room TEXT NOT NULL,token TEXT NOT NULL,input TEXT NOT NULL,seq INTEGER NOT NULL DEFAULT 0,updated INTEGER NOT NULL);CREATE INDEX IF NOT EXISTS fighter_inputs_room ON fighter_inputs(room);');
 function prepare(query){let values=[];return {bind(...v){values=v;return this},async first(){return sql.prepare(query).get(...values)||null},async all(){return {results:sql.prepare(query).all(...values)}},async run(){return {meta:{changes:Number(sql.prepare(query).run(...values).changes)}}},query,get values(){return values}}}
 const DB={prepare,async batch(statements){sql.exec('BEGIN');try{const results=statements.map(s=>/^\s*SELECT/i.test(s.query)?{results:sql.prepare(s.query).all(...s.values)}:{meta:{changes:Number(sql.prepare(s.query).run(...s.values).changes)}});sql.exec('COMMIT');return results}catch(e){sql.exec('ROLLBACK');throw e}}};
 const raw=fs.readFileSync(path.join(root,'app/api/room/route.ts'),'utf8').replace(/^import .*;\r?\n/gm,'');
 const code=stripTypeScriptTypes(raw).replace('export const dynamic','const dynamic').replace('export async function POST','async function POST');
 const POST=new Function('env','createBattle','stepBattle',code+';return POST')({DB},createBattle,stepBattle);
 const pendingInputs=new Map();
 function roomView(row){const room=JSON.parse(row.state);return {...room,revision:row.rev,playbackDelayMs,transport:'websocket',members:room.members.map(({token,...m})=>m)}}
 function send(ws,value){if(ws.readyState!==1)return;if(ws.bufferedAmount>262144){ws.close(1013,'connection too slow');return}ws.send(JSON.stringify(value))}
 function authenticate(body){if(!/^\d{6}$/.test(String(body.code)))return null;const row=sql.prepare('SELECT * FROM fighter_rooms WHERE code=?').get(String(body.code));if(!row||now()-row.updated>86400000)return null;const room=JSON.parse(row.state);const member=room.members.find(m=>m.token===body.token);if(body.token!==row.host&&!member)return null;return {row,room,member}}
 function flushInput(body){const auth=authenticate(body);if(!auth?.member||body.id!==auth.member.id)return false;const seq=Number(body.seq);if(!Number.isSafeInteger(seq)||seq<0)return false;
 const held={},edges={};for(const key of ['left','right','down','light','heavy'])held[key]=!!body.held?.[key];for(const key of ['jump','skill','ultimate'])edges[key]=Math.max(0,Math.min(1e9,Math.floor(Number(body.edges?.[key])||0)));
 sql.prepare('INSERT INTO fighter_inputs(id,room,token,input,seq,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET input=excluded.input,seq=excluded.seq,updated=excluded.updated WHERE excluded.seq>fighter_inputs.seq AND fighter_inputs.token=excluded.token').run(body.id,body.code,body.token,JSON.stringify({held,edges}),seq,now());return true;
 }
 async function dispatch(body){const response=await POST(new Request('http://local/api/room',{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}));const data=await response.json();if(data.room){data.room.playbackDelayMs=playbackDelayMs;data.room.transport='websocket'}return {status:response.status,data};}
 const server=http.createServer(async(req,res)=>{try{if(req.url==='/api/room'&&req.method==='POST'){let body='';for await(const chunk of req){body+=chunk;if(body.length>65536){res.writeHead(413);res.end();return}}const result=await dispatch(JSON.parse(body));res.writeHead(result.status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(result.data));return}
 if(req.url==='/'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(fs.readFileSync(path.join(root,'game.html')));return}
 if(req.url==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:true,transport:'websocket',tickHz:60,snapshotHz:30,playbackDelayMs}));return}res.writeHead(404);res.end();}catch(e){res.writeHead(500);res.end(JSON.stringify({error:'요청 처리 실패'}));console.error(e)}});
 const wss=new WebSocketServer({noServer:true,maxPayload:65536,perMessageDeflate:false});
 server.on('upgrade',(req,socket,head)=>{try{if(req.url!=='/api/live'||req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){socket.destroy();return}wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws,req))}catch{socket.destroy()}});
 wss.on('connection',ws=>{ws.session=null;ws.isAlive=true;ws.on('pong',()=>{ws.isAlive=true});let count=0,windowStart=now();
 ws.on('message',async bytes=>{try{if(now()-windowStart>1000){count=0;windowStart=now()}if(++count>120){ws.close(1008,'rate limit');return}const msg=JSON.parse(bytes.toString());if(!msg||!msg.body||typeof msg.body.action!=='string')return;
 if(msg.type==='input'){const body=msg.body;if(body.code!==ws.session?.code||body.token!==ws.session?.token)return;const key=body.code+':'+body.id,previous=pendingInputs.get(key);if(!previous||Number(body.seq)>Number(previous.seq))pendingInputs.set(key,body);return}
 const {status,data}=await dispatch(msg.body);if(status<400&&data.room){ws.session={code:data.room.code,token:data.token||msg.body.token};}if(data.closed)ws.session=null;send(ws,{id:msg.id,status,data});
 }catch(e){send(ws,{id:null,type:'error',message:'잘못된 요청'})}});
 ws.on('close',()=>{const s=ws.session;if(!s)return;const auth=authenticate(s);if(!auth?.member)return;const other=[...wss.clients].some(peer=>peer!==ws&&peer.session?.code===s.code&&peer.session?.token===s.token);if(!other){pendingInputs.delete(s.code+':'+auth.member.id);sql.prepare('UPDATE fighter_inputs SET updated=0 WHERE id=?').run(auth.member.id)}});
 });
 let lastBroadcast=0;
 const tick=setInterval(()=>{try{for(const body of pendingInputs.values())flushInput(body);pendingInputs.clear();const codes=new Set([...wss.clients].map(ws=>ws.session?.code).filter(Boolean));const time=now();
 for(const code of codes){const row=sql.prepare('SELECT * FROM fighter_rooms WHERE code=?').get(code);if(!row)continue;const room=JSON.parse(row.state);if(room.phase==='playing'&&!room.paused){const before=room.battle.lastTick;const inputs=sql.prepare('SELECT id,input,seq,updated FROM fighter_inputs WHERE room=?').all(code);stepBattle(room,inputs,time);if(room.battle.lastTick!==before)sql.prepare('UPDATE fighter_rooms SET state=?,rev=rev+1,updated=? WHERE code=?').run(JSON.stringify(room),time,code);}}
 if(time-lastBroadcast>=1000/30){lastBroadcast=time;for(const ws of wss.clients){if(!ws.session)continue;const auth=authenticate(ws.session);if(!auth){ws.session=null;continue}send(ws,{type:'state',serverNow:time,room:roomView(auth.row)})}}
 }catch(e){console.error(e)}},1000/60);
 const ping=setInterval(()=>{for(const ws of wss.clients){if(!ws.isAlive){ws.terminate();continue}ws.isAlive=false;ws.ping()}},10000);
 return {server,wss,sql,async listen(){await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,resolve)});return server.address()},async close(){clearInterval(tick);clearInterval(ping);for(const ws of wss.clients)ws.terminate();await new Promise(r=>wss.close(r));if(server.listening)await new Promise(r=>server.close(r));sql.close()}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir=path.join(root,'.realtime');fs.mkdirSync(dir,{recursive:true});const app=createRealtimeServer({port:Number(process.env.PORT)||3000,database:path.join(dir,'rooms.sqlite')});
 const address=await app.listen();console.log('실시간 게임: http://localhost:'+address.port);
 for(const entries of Object.values(os.networkInterfaces()))for(const entry of entries||[])if(entry.family==='IPv4'&&!entry.internal)console.log('같은 네트워크의 다른 컴퓨터: http://'+entry.address+':'+address.port);
 console.log('이 창을 켜 두고 두 컴퓨터에서 같은 방 코드로 참가하세요. 종료: Ctrl+C');
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await app.close();process.exit(0)});
}
