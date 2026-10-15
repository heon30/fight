import { env } from 'cloudflare:workers';
import { createBattle,stepBattle } from '../../game-core.js';
export const dynamic='force-dynamic';
const response=(v:any,status=200)=>Response.json({...v,serverNow:Date.now()},{status,headers:{'Cache-Control':'no-store'}});
const error=(message:string,status=400)=>response({error:message},status);
const uid=()=>crypto.randomUUID();
function view(s:any,revision=0){return {...s,revision,playbackDelayMs:350,transport:'http',members:s.members.map(({token,...m}:any)=>m)}}
function next(s:any){if(s.mode==='duel'){s.matchIndex++;if(s.matchIndex>=s.pairs.length){s.phase='finished';return;}s.battle=createBattle(s,s.pairs[s.matchIndex])}else{s.battle=createBattle(s,s.members.map((m:any)=>m.id))}s.phase='playing';s.tickLeader=s.battle.players[0]?.id}
export async function POST(req:Request){try{
 const b=await req.json();const db=env.DB;if(!db)return error('서버 저장소를 준비 중입니다.',503);const now=Date.now();
 if(b.action==='create'){let code='';for(let i=0;i<6;i++){code=String(100000+crypto.getRandomValues(new Uint32Array(1))[0]%900000);if(!await db.prepare('SELECT code FROM fighter_rooms WHERE code=?').bind(code).first())break;}
 const token=uid(),s={code,phase:'lobby',mode:'duel',map:0,members:[],score:[0,0],results:[],pairs:[],matchIndex:-1,battle:null,paused:false};await db.prepare('INSERT INTO fighter_rooms (code,host,state,rev,updated) VALUES (?,?,?,0,?)').bind(code,token,JSON.stringify(s),now).run();return response({code,token,role:'host',room:view(s)});}
 const code=String(b.code||'');if(!/^\d{6}$/.test(code))return error('6자리 방 코드를 입력하세요.');
 let prefetched:any=null,inputStored=false;
 if(b.action==='input'&&typeof b.id==='string'){const seq=Number(b.seq);if(!Number.isSafeInteger(seq)||seq<0)return error('잘못된 입력입니다.');const held:any={},edges:any={};for(const k of ['left','right','down','light','heavy'])held[k]=!!b.held?.[k];for(const k of ['jump','skill','ultimate'])edges[k]=Math.max(0,Math.min(1e9,Math.floor(Number(b.edges?.[k])||0)));
 const rows=await db.batch([db.prepare('UPDATE fighter_inputs SET input=?,seq=?,updated=? WHERE id=? AND room=? AND token=? AND seq<?').bind(JSON.stringify({held,edges}),seq,now,b.id,code,b.token,seq),db.prepare('SELECT * FROM fighter_rooms WHERE code=?').bind(code)]);prefetched=rows[1].results[0];inputStored=rows[0].meta.changes>0;}
 for(let retry=0;retry<12;retry++){
 const row:any=retry===0&&prefetched?prefetched:await db.prepare('SELECT * FROM fighter_rooms WHERE code=?').bind(code).first();if(!row)return error('방을 찾을 수 없습니다.',404);if(now-row.updated>86400000)return error('만료된 방입니다. 새 방을 만들어주세요.',410);
 const tickNow=Date.now();const s=JSON.parse(row.state);const host=b.token===row.host;let member=s.members.find((m:any)=>m.token===b.token);let result:any={};
 if(b.action==='join'){
 if(s.phase!=='lobby')return error('경기가 진행 중입니다. 대기실로 돌아간 뒤 참가하세요.');if(s.members.length>=30)return error('최대 30명까지 참가할 수 있습니다.');const name=String(b.name||'').trim().slice(0,14);if(!name)return error('닉네임을 입력하세요.');if(s.members.some((m:any)=>m.name===name))return error('이미 사용 중인 닉네임입니다.');const id=uid(),token=uid();member={id,token,name,fighter:-1,team:s.members.length%2,ready:false};s.members.push(member);result={id,token,role:'player'};
 }else{
 if(!host&&!member)return error('참가 정보가 만료되었습니다. 방에 다시 입장하세요.',403);
 if(b.action==='input'&&member&&!inputStored){const seq=Number(b.seq);if(!Number.isSafeInteger(seq)||seq<0)return error('잘못된 입력입니다.');const held:any={},edges:any={};for(const k of ['left','right','down','light','heavy'])held[k]=!!b.held?.[k];for(const k of ['jump','skill','ultimate'])edges[k]=Math.max(0,Math.min(1e9,Math.floor(Number(b.edges?.[k])||0)));
 await db.prepare('INSERT INTO fighter_inputs (id,room,token,input,seq,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET input=excluded.input, seq=excluded.seq, updated=excluded.updated WHERE excluded.seq>fighter_inputs.seq AND fighter_inputs.token=excluded.token').bind(member.id,code,member.token,JSON.stringify({held,edges}),seq,now).run();inputStored=true;}
 if(['ready','character'].includes(b.action)){if(!member||s.phase!=='lobby')return error('대기실에서만 변경할 수 있습니다.');if(b.action==='ready'){if(b.ready&&member.fighter<0)return error('먼저 내 캐릭터를 선택하세요.');member.ready=!!b.ready;}else{const i=Number(b.fighter);if(!Number.isInteger(i)||i<0||i>=30)return error('캐릭터를 선택하세요.');member.fighter=i;member.ready=false;}}
 if(['shuffle','team','settings','start','next','lobby','pause','close','participate'].includes(b.action)&&!host)return error('교사만 조작할 수 있습니다.',403);
 if(b.action==='participate'){if(s.phase!=='lobby')return error('대기실에서 참여 여부를 변경하세요.');if(b.play&&!member){if(s.members.length>=30)return error('최대 30명까지 참가 가능합니다.');let name='교사',n=1;while(s.members.some((m:any)=>m.name===name))name='교사'+(++n);let counts=[0,1].map(t=>s.members.filter((m:any)=>m.team===t).length);member={id:uid(),token:row.host,name,fighter:-1,team:counts[0]<=counts[1]?0:1,ready:false};s.members.push(member);result={participation:true,id:member.id};}else if(!b.play&&member){s.members=s.members.filter((m:any)=>m.id!==member.id);result={participation:true,id:null};}else result={participation:true,id:member?.id||null};}
 if(b.action==='settings'){if(s.phase!=='lobby')return error('대기실에서 변경하세요.');s.mode=b.mode==='brawl'?'brawl':'duel';s.map=Math.max(0,Math.min(2,Math.floor(Number(b.map)||0)));}
 if(b.action==='shuffle'){if(s.phase!=='lobby')return error('대기실에서 변경하세요.');let a=[...s.members];for(let i=a.length-1;i>0;i--){let j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[a[i],a[j]]=[a[j],a[i]]}a.forEach((m:any,i:number)=>m.team=i%2);}
 if(b.action==='team'){if(s.phase!=='lobby')return error('대기실에서 변경하세요.');let m=s.members.find((m:any)=>m.id===b.id);if(m)m.team=1-m.team;}
 if(b.action==='start'){if(s.phase!=='lobby')return error('이미 진행 중인 경기입니다.');let a=s.members.filter((m:any)=>m.team===0),c=s.members.filter((m:any)=>m.team===1);if(!a.length||!c.length)return error('양 팀에 최소 1명씩 있어야 합니다.');if(a.length!==c.length)return error('양 팀의 인원을 같게 맞춰주세요.');if(s.members.some((m:any)=>!Number.isInteger(m.fighter)||m.fighter<0||m.fighter>=30))return error('모든 학생이 캐릭터를 선택해야 합니다.');if(s.members.some((m:any)=>!m.ready))return error('모든 학생이 준비를 눌러야 시작할 수 있습니다.');s.score=[0,0];s.results=[];s.pairs=a.map((m:any,i:number)=>[m.id,c[i].id]);s.matchIndex=-1;s.paused=false;next(s);}
 if(b.action==='next'){if(s.phase!=='roundResult')return error('현재 경기가 끝난 뒤 진행하세요.');if(s.mode==='brawl')s.phase='finished';else next(s);}
 if(b.action==='lobby'){s.phase='lobby';s.battle=null;s.paused=false;s.members.forEach((m:any)=>m.ready=false);}
 if(b.action==='pause'){s.paused=!s.paused;if(s.battle)s.battle.lastTick=now;}
 if(b.action==='leave'&&member){if(s.phase!=='lobby')return error('경기 중에는 대기실로 돌아간 후 퇴장하세요.');s.members=s.members.filter((m:any)=>m.id!==member.id);}
 if(b.action==='close'){await db.prepare('DELETE FROM fighter_rooms WHERE code=? AND host=?').bind(code,b.token).run();await db.prepare('DELETE FROM fighter_inputs WHERE room=?').bind(code).run();return response({closed:true});}
 }
 if(s.phase==='playing'&&!s.paused&&(member||host)&&tickNow-s.battle.lastTick>=1000/60){let ins=await db.prepare('SELECT id,input,seq,updated FROM fighter_inputs WHERE room=?').bind(code).all();stepBattle(s,ins.results,tickNow);if(member)s.tickLeader=member.id;}

 let changed=JSON.stringify(s)!==row.state;
 if(!changed)return response({room:view(s,row.rev),...result});
 const updated=await db.prepare('UPDATE fighter_rooms SET state=?,rev=rev+1,updated=? WHERE code=? AND rev=?').bind(JSON.stringify(s),now,code,row.rev).run();
 if(updated.meta.changes){if(b.action==='join'||b.action==='participate'&&result.id)await db.prepare('INSERT INTO fighter_inputs (id,room,token,input,seq,updated) VALUES (?,?,?,?,0,?)').bind(member.id,code,member.token,'{"held":{},"edges":{}}',now).run();return response({room:view(s,row.rev+1),...result})}
 await new Promise(resolve=>setTimeout(resolve,5+Math.min(70,retry*5)+crypto.getRandomValues(new Uint32Array(1))[0]%20));
 }
 return error('동기화 중입니다. 잠시 후 다시 시도해주세요.',409);
 }catch(e){console.error(e);return error('서버 연결을 확인하고 다시 시도해주세요.',500)}}
