const fighters=[
{name:'질풍검객',role:'균형 잡힌 검객',color:'#438ebc',hair:'#38343e',hp:122,atk:18,spd:395,jump:680,skill:'질풍 베기',desc:'전방으로 돌진하며 28 피해. 짧은 무적과 강한 밀치기.',cd:7,type:'dash',weapon:'sword'},
{name:'대지파쇄자',role:'묵직한 파괴자',color:'#cc7956',hair:'#3c3027',hp:140,atk:21,spd:350,jump:650,skill:'대지 강타',desc:'주변 150 범위에 충격파. 27 피해와 강한 띄우기.',cd:9,type:'quake',weapon:'hammer'},
{name:'바람궁수',role:'민첩한 바람 궁수',color:'#6caa78',hair:'#514330',hp:108,atk:16,spd:445,jump:735,skill:'바람 화살',desc:'전방으로 화살 3발. 각각 9 피해, 발판 위 추격에 유리.',cd:7,type:'arrow',weapon:'bow'},
{name:'빙결술사',role:'얼음 마법사',color:'#78b7d8',hair:'#ede4ce',hp:114,atk:17,spd:380,jump:690,skill:'빙결 구슬',desc:'얼음 구슬로 22 피해. 상대 이동속도를 2초간 절반으로.',cd:8,type:'ice',weapon:'staff'},
{name:'월영암살자',role:'그림자 암살자',color:'#a086cc',hair:'#282438',hp:102,atk:19,spd:455,jump:740,skill:'그림자 습격',desc:'260 거리 안의 상대에게 순간이동 후 24 피해. 멀면 전방으로 이동.',cd:8,type:'blink',weapon:'dagger'},
{name:'홍련투사',role:'불꽃 격투가',color:'#da6d63',hair:'#733b2c',hp:124,atk:19,spd:410,jump:710,skill:'불꽃 어퍼컷',desc:'상승하며 넓은 범위를 공격. 27 피해와 공중 띄우기.',cd:8,type:'upper',weapon:'fist'},
{name:'빛의수호자',role:'빛의 수호자',color:'#d4b464',hair:'#654d38',hp:130,atk:16,spd:365,jump:665,skill:'빛의 가호',desc:'체력 8 회복 + 4초간 피해 20% 감소. 긴 재사용으로 방어력 조절.',cd:15,type:'heal',weapon:'shield'}];
const ultimates=[
{name:'천공 일섬',desc:'커다란 검기를 발사해 40 피해. 발판 너머 수평 견제.'},
{name:'지각 붕괴',desc:'주변 235 범위에 43 피해와 강한 밀치기.'},
{name:'유성 화살비',desc:'상대 위치에 화살 5발을 떨어뜨림. 각각 10 피해.'},
{name:'절대영도',desc:'주변 210 범위에 35 피해 + 3초 둔화.'},
{name:'월영 처형',desc:'480 거리 안 상대 뒤로 이동해 39 피해. 뒤를 노림.'},
{name:'홍련 승룡',desc:'주변 150 범위에 42 피해와 높이 띄우기.'},
{name:'새벽의 성역',desc:'체력 18 회복 + 5초 보호. 주변 160 범위에 24 피해.'}];
fighters.forEach((f,i)=>f.ult=ultimates[i]);
const newFighters=[
{name:'슈팅에이스',role:'축구선수',color:'#66b58a',hair:'#343631',hp:116,atk:17,spd:445,jump:735,skill:'파워 슈팅',desc:'빠른 축구공을 발사해 24 피해. 강공격도 축구공 슛.',cd:7,type:'soccer',weapon:'ball',ult:{name:'결승골',desc:'대형 축구공 발사. 40 피해와 강한 밀치기.'}},
{name:'롱암복서',role:'긴팔 리치 파이터',color:'#c3946e',hair:'#3d302e',hp:112,atk:16,spd:405,jump:690,skill:'늘어나는 펀치',desc:'전방 240 거리의 상대에게 25 피해. 기본 공격 사거리 증가.',cd:8,type:'longarm',weapon:'fist',longarm:true,ult:{name:'초장거리 한방',desc:'전방 390 거리에 40 피해. 사거리로 상대를 압박.'}},
{name:'메가헤더',role:'큰머리 돌격대',color:'#e1a66d',hair:'#4c3c30',hp:138,atk:20,spd:355,jump:650,skill:'헤딩 돌진',desc:'160 거리 돌진하며 26 피해. 짧은 무적으로 공격 돌파.',cd:8,type:'head',weapon:'fist',bighead:true,ult:{name:'메가 헤딩',desc:'주변 180 범위에 42 피해와 강한 띄우기.'}},
{name:'피구챔피언',role:'피구 에이스',color:'#e18763',hair:'#332936',hp:108,atk:16,spd:440,jump:725,skill:'회피 후 투척',desc:'0.5초 무적과 피구공 투척. 23 피해. 기본 공격은 공 던지기.',cd:9,type:'dodge',weapon:'dodgeball',ult:{name:'불꽃 피구왕',desc:'강력한 피구공을 발사해 39 피해.'}},
{name:'논리술사',role:'말빨의 달인',color:'#7da8b8',hair:'#4a3226',hp:118,atk:17,spd:395,jump:685,skill:'말문 막기',desc:'말풍선 발사. 20 피해 + 1.5초 스킬·궁극기 봉인.',cd:9,type:'talk',weapon:'mic',ult:{name:'논리 폭풍',desc:'주변 240 범위에 36 피해 + 2초 스킬 봉인.'}},
{name:'폼마스터',role:'가오의 승부사',color:'#6b83b0',hair:'#242737',hp:122,atk:18,spd:410,jump:700,skill:'폼 상승',desc:'4초간 이동속도 15%·피해량 15% 증가. 사용 순간 짧은 보호.',cd:11,type:'swagger',weapon:'fist',ult:{name:'주인공 등장',desc:'주변 180 범위에 36 피해 + 4초 폼 상승.'}},
{name:'흑야검사',role:'검은색 그림자',color:'#30313f',hair:'#191923',hp:108,atk:18,spd:450,jump:730,skill:'검은 파동',desc:'어둠 구슬 발사. 23 피해 + 1.5초 이동 둔화.',cd:8,type:'shadow',weapon:'dagger',ult:{name:'흑야의 장막',desc:'주변 210 범위에 38 피해 + 2초 둔화. 짧은 무적.'}},
{name:'꿈의최면사',role:'최면술사',color:'#9674b0',hair:'#3d3546',hp:110,atk:16,spd:385,jump:690,skill:'최면 진자',desc:'최면 구슬 발사. 18 피해 + 1초 좌우 이동 반전.',cd:10,type:'hypnosis',weapon:'pendulum',ult:{name:'꿈의 미궁',desc:'주변 220 범위에 34 피해 + 1.8초 좌우 이동 반전.'}},
{name:'별빛마도사',role:'별빛 마법사',color:'#7d79c3',hair:'#4b3c68',hp:106,atk:16,spd:390,jump:715,skill:'별빛 삼중주',desc:'마법 구슬 3발 발사. 각각 9 피해. 기본 공격도 마법탄.',cd:8,type:'wizard',weapon:'staff',ult:{name:'혜성 낙하',desc:'상대 위치에 큰 혜성 낙하. 43 피해, 이동으로 회피 가능.'}}
];fighters.push(...newFighters);
const extraFighters=[
{name:'깁스가디언',role:'깁스 가드',color:'#8fa5b6',hair:'#403a3c',hp:136,atk:19,spd:355,jump:660,skill:'깁스 방패',desc:'3초 보호 + 가까운 상대에게 20 피해.',cd:10,type:'cast',weapon:'cast',ult:{name:'철벽 깁스',desc:'주변 160 범위 34 피해 + 5초 보호.'}},
{name:'워드캐스터',role:'영어 공격수',color:'#729eab',hair:'#342f3e',hp:112,atk:16,spd:400,jump:690,skill:'WORD SHOT',desc:'영어 단어 발사. 21 피해 + 1초 스킬 봉인.',cd:8,type:'english',weapon:'book',ult:{name:'ENGLISH STORM',desc:'영어 단어 3발. 각각 15 피해와 스킬 봉인.'}},
{name:'앵커풋',role:'평발의 중심',color:'#8f9e6d',hair:'#403727',hp:134,atk:18,spd:365,jump:650,stability:.7,skill:'단단한 발구르기',desc:'주변 145 범위 26 피해. 밀치기를 30% 덜 받음.',cd:8,type:'flatfoot',weapon:'fist',ult:{name:'흔들림 없는 중심',desc:'주변 220 범위 39 피해 + 3초 보호.'}},
{name:'멜로디메이지',role:'건반 연주자',color:'#8d93c7',hair:'#342b44',hp:110,atk:16,spd:390,jump:710,skill:'코드 웨이브',desc:'음표 3발. 각각 8 피해 + 1초 둔화. 기본 공격도 음표.',cd:8,type:'keyboard',weapon:'keyboard',ult:{name:'피날레',desc:'큰 음표 발사. 39 피해와 2초 둔화.'}},
{name:'드림슬리퍼',role:'꿈꾸는 파이터',color:'#899eb6',hair:'#484152',hp:126,atk:17,spd:370,jump:680,skill:'꿀잠 충전',desc:'잠깐 쉬며 체력 8 회복 + 2초 보호. 0.45초 행동 불가.',cd:15,type:'sleep',weapon:'pillow',ult:{name:'꿈나라 파동',desc:'체력 14 회복 + 주변 170 범위 28 피해.'}},
{name:'롱레그킥커',role:'긴 다리 킥커',color:'#73a59e',hair:'#3e3433',hp:113,atk:17,spd:430,jump:730,longleg:true,skill:'롱 레그 킥',desc:'전방 225 거리에 25 피해. 기본 공격은 긴 발차기.',cd:8,type:'longleg',weapon:'fist',ult:{name:'회오리 킥',desc:'주변 200 범위 40 피해와 강한 밀치기.'}},
{name:'바운스덩커',role:'농구공 플레이어',color:'#d19555',hair:'#3c3029',hp:116,atk:17,spd:415,jump:735,skill:'바운스 패스',desc:'튕기는 농구공 투척. 23 피해. 기본 공격도 공 던지기.',cd:8,type:'basketball',weapon:'basketball',ult:{name:'파워 덩크',desc:'주변 165 범위 41 피해 + 높이 도약.'}},
{name:'골든스파크',role:'노란머리 번개',color:'#e6bb61',hair:'#f2d362',hp:106,atk:17,spd:450,jump:735,skill:'옐로 스파크',desc:'빠른 번개 발사. 22 피해 + 1초 둔화.',cd:8,type:'yellow',weapon:'fist',ult:{name:'골든 플래시',desc:'빠른 번개 발사. 39 피해 + 4초 이동 강화.'}},
{name:'쿼드저지',role:'4주 카운터',color:'#c18787',hair:'#37313b',hp:124,atk:19,spd:380,jump:675,skill:'4주 판정',desc:'전방 105 범위 27 피해 + 강한 밀치기.',cd:9,type:'fourweek',weapon:'fist',ult:{name:'4연속 판정',desc:'4개의 판정 파동. 각각 12 피해.'}},
{name:'트림쇼크',role:'트름 파동술사',color:'#9aaf76',hair:'#3d3a28',hp:120,atk:17,spd:390,jump:685,skill:'트름 충격파',desc:'전방 180 범위 23 피해 + 1.5초 둔화.',cd:8,type:'burp',weapon:'fist',ult:{name:'초대형 트름',desc:'주변 250 범위 36 피해와 강한 밀치기.'}},
{name:'컬리스프링',role:'곱슬머리 스프링',color:'#ab856e',hair:'#654a32',hp:116,atk:17,spd:420,jump:735,curly:true,skill:'곱슬 스프링',desc:'높이 도약하며 주변 95 범위에 24 피해.',cd:8,type:'curly',weapon:'fist',ult:{name:'곱슬 회오리',desc:'주변 200 범위 39 피해 + 0.4초 무적.'}},
{name:'아이언그립',role:'전완근 파이터',color:'#9a7667',hair:'#332a29',hp:130,atk:20,spd:365,jump:660,skill:'전완근 압박',desc:'전방 90 범위 29 피해. 가까이 붙어 쓰는 강한 한방.',cd:9,type:'forearm',weapon:'fist',ult:{name:'강철 악력',desc:'전방 125 범위 43 피해. 가까이서 방어를 뚫음.'}},
{name:'드리블팬텀',role:'드리블 플레이메이커',color:'#67a3bc',hair:'#2e333e',hp:114,atk:16,spd:445,jump:725,skill:'드리블 돌파',desc:'120 거리 돌진 후 축구공 발사. 21 피해.',cd:8,type:'football',weapon:'ball',ult:{name:'해트트릭',desc:'축구공 3발을 펼쳐 발사. 각각 15 피해.'}},
{name:'스카이점퍼',role:'점프 스페셜리스트',color:'#9a86be',hair:'#373143',hp:103,atk:16,spd:435,jump:745,airJumps:3,skill:'점프 부스터',desc:'빠르게 도약하며 주변 95 범위 23 피해. 3단 점프 가능.',cd:8,type:'jumper',weapon:'fist',ult:{name:'스카이 임팩트',desc:'주변 180 범위 38 피해와 높이 도약.'}}
];fighters.push(...extraFighters);
const mapdata=[
{name:'바람숲 정원',sub:'8개 발판 · 우회로와 높은 중앙',theme:'forest',p:[[0,560,1152,80],[65,463,160,20],[285,448,150,20],[720,448,150,20],[927,463,160,20],[170,350,175,20],[480,365,192,20],[807,350,175,20],[466,245,220,20]]},
{name:'황혼의 시계탑',sub:'9개 발판 · 지그재그 수직 기동',theme:'clock',p:[[0,560,1152,80],[55,470,145,20],[270,455,150,20],[732,455,150,20],[952,470,145,20],[125,355,170,20],[470,365,212,20],[857,355,170,20],[335,245,150,20],[667,245,150,20]]},
{name:'달빛 구름섬',sub:'섬 사이 틈 · 10개 발판과 우회 경로',theme:'moon',p:[[0,560,270,80],[882,560,270,80],[330,530,190,25],[632,530,190,25],[85,447,140,20],[927,447,140,20],[270,408,165,20],[717,408,165,20],[495,390,162,20],[185,290,170,20],[797,290,170,20],[480,260,192,20]]}];
const balanceConfig=[{"damageScale":0.8,"healthScale":0.922},{"damageScale":0.736,"healthScale":0.909},{"damageScale":1.363,"healthScale":1.124},{"damageScale":1.034,"healthScale":1.017},{"damageScale":0.908,"healthScale":0.975},{"damageScale":0.846,"healthScale":0.947},{"damageScale":0.764,"healthScale":0.894},{"damageScale":1.317,"healthScale":1.105},{"damageScale":0.861,"healthScale":0.947},{"damageScale":0.795,"healthScale":0.927},{"damageScale":1.251,"healthScale":1.097},{"damageScale":0.988,"healthScale":0.996},{"damageScale":0.883,"healthScale":0.958},{"damageScale":0.949,"healthScale":0.982},{"damageScale":1.043,"healthScale":1.017},{"damageScale":1.242,"healthScale":1.091},{"damageScale":0.711,"healthScale":0.877},{"damageScale":1.334,"healthScale":1.116},{"damageScale":0.84,"healthScale":0.938},{"damageScale":1.396,"healthScale":1.131},{"damageScale":0.78,"healthScale":0.906},{"damageScale":0.87,"healthScale":0.949},{"damageScale":1.209,"healthScale":1.079},{"damageScale":0.992,"healthScale":1.006},{"damageScale":0.881,"healthScale":0.961},{"damageScale":1.036,"healthScale":1.014},{"damageScale":0.993,"healthScale":1.001},{"damageScale":0.84,"healthScale":0.942},{"damageScale":1.395,"healthScale":1.124},{"damageScale":1.252,"healthScale":1.074}];
fighters.forEach((f,i)=>{f.damageScale=balanceConfig[i].damageScale;f.hp=Math.round(f.hp*balanceConfig[i].healthScale);const scaled=text=>text.replace(/(\d+) 피해/g,(_,n)=>Math.round(Number(n)*f.damageScale)+' 피해');f.desc=scaled(f.desc);f.ult.desc=scaled(f.ult.desc)});
export const characterData=fighters;
export const maps=mapdata;
export function createBattle(room,ids){const slots=[0,0];return {players:ids.map((id,n)=>{let u=room.members.find(m=>m.id===id),f=fighters[u.fighter],slot=slots[u.team]++;return {id:u.id,name:u.name,team:u.team,fighter:u.fighter,x:u.team===0?45+(slot%5)*42:1107-(slot%5)*42,y:540,vx:0,vy:0,face:u.team===0?1:-1,hp:f.hp,ground:false,jumps:0,cool:0,skillcd:0,stun:0,inv:0,slow:0,buff:0,drop:0,action:0,guard:false,combo:0,comboTimer:0,ult:0,ultLock:0,ultGlow:0,silence:0,confuse:0,boost:0,lastEdges:{}}}),shots:[],effects:[],timer:room.mode==='brawl'?180:90,countdown:3,ended:false,winner:null,lastTick:Date.now()}}
export function stepBattle(room,inputRows,now){
 let battle=room.battle;if(!battle||battle.ended||room.phase!=='playing')return;
 const tickMs=1000/60,rawElapsed=Math.max(0,now-battle.lastTick);const steps=Math.floor((Math.min(850,rawElapsed)+1e-6)/tickMs);if(!steps)return; battle.lastTick=(rawElapsed>850?now-850:battle.lastTick)+steps*tickMs;
 let players=battle.players.map(p=>({...p,f:fighters[p.fighter]})),shots=battle.shots.map(s=>({...s,owner:players.find(p=>p.id===s.ownerId)})).filter(s=>s.owner),effects=battle.effects||[],mapidx=room.map,shake=0;
 const tone=()=>{};
function effect(x,y,text,color='#fff3af',kind='text'){effects.push({x,y,text,color,kind,t:0,life:kind==='text'?.85:.4})}
function hit(a,b,dmg,kx=240,ky=-170,blockable=true){if(a.team===b.team||b.inv>0||b.hp<=0)return false;let blocked=blockable&&b.guard&&(((a.hitOrigin??a.x)-b.x)*b.face>=0),amount=Math.round(dmg*(a.f.damageScale||1)*(a.boost>0?1.15:1)*(blocked?.22:1)*(b.buff>0?.8:1)*Math.max(.65,1-a.combo*.08));b.hp=Math.max(0,b.hp-amount);if(!a.ultAttack)a.ult=Math.min(100,a.ult+amount*.85);b.ult=Math.min(100,b.ult+amount*.6);b.vx=(b.x>=a.x?1:-1)*kx*(b.f.stability||1)*(blocked?.25:1);if(!blocked){b.vy=ky;b.stun=.17;b.ground=false;b.inv=.10;a.combo++;a.comboTimer=1.5}else b.stun=.07;shake=blocked?2:5;effect(b.x,b.y-95,blocked?'방어 −'+amount:'−'+amount,blocked?'#97e6ff':'#ffdf7f');effect(b.x,b.y-40,'','#fff0b1','spark');tone(blocked?180:420);return !blocked}
function fire(p,type,d,speed=650,vy=0,radius=0,ultimate=false){shots.push({owner:p,x:p.x+p.face*30,y:p.y-34,vx:p.face*speed,vy,d,life:1.4,type,radius,ultimate})}
function melee(p,o,heavy){if(['arrow','dodge','wizard','english','keyboard','basketball'].includes(p.f.type)||(['soccer','football'].includes(p.f.type)&&heavy)){p.cool=heavy?.48:.26;p.action=.20;fire(p,p.f.type==='arrow'?'arrow':p.f.type==='wizard'?'magic':p.f.type==='english'?'word':p.f.type==='keyboard'?'note':p.f.type==='basketball'?'basket':['soccer','football'].includes(p.f.type)?'soccer':'ball',Math.round(p.f.atk*(heavy?1.05:.58)),heavy?820:700,0,heavy?24:18);shots[shots.length-1].noStatus=true;tone(540);return;}p.cool=heavy?.46:.21;p.action=heavy?.22:.14;const dx=(o.x-p.x)*p.face,dy=Math.abs((o.y-34)-(p.y-34));effect(p.x+p.face*45,p.y-40,'',heavy?'#fff0a1':'#ffffff','slash');if(dx>-18&&dx<(p.f.longarm?(heavy?145:118):p.f.longleg?(heavy?135:110):(heavy?94:69))&&dy<(heavy?70:52))hit(p,o,Math.round(p.f.atk*(heavy?1.4:.60)),heavy?390:190,heavy?-270:-100)}
function skill(p,o){if(p.skillcd>0||p.silence>0)return;p.skillcd=p.f.cd;p.cool=.34;p.action=.27;effect(p.x,p.y-115,p.f.skill,p.f.color);tone(700,.15);let t=p.f.type;if(t==='dash'){p.inv=.3;const old=p.x;p.x=Math.max(24,Math.min(1128,p.x+p.face*200));p.vx=p.face*270;effect(old,p.y-40,'','#90e9ff','slash');if(Math.min(old,p.x)-45<o.x&&o.x<Math.max(old,p.x)+45&&Math.abs(o.y-p.y)<90)hit(p,o,28,440,-220)}if(t==='quake'){effect(p.x,p.y,'','#ffce7a','ring');if(Math.abs(o.x-p.x)<150&&Math.abs(o.y-p.y)<95)hit(p,o,27,360,-480)}if(t==='arrow'){[-.15,0,.15].forEach(v=>shots.push({owner:p,x:p.x+p.face*35,y:p.y-34,vx:p.face*650,vy:v*500,d:9,life:1.8,type:'arrow',hits:false}))}if(t==='ice')shots.push({owner:p,x:p.x+p.face*35,y:p.y-34,vx:p.face*440,vy:0,d:22,life:2.5,type:'ice'});if(t==='blink'){if(Math.abs(o.x-p.x)<260&&Math.abs(o.y-p.y)<150){p.x=Math.max(26,Math.min(1126,o.x-o.face*55));p.y=o.y;p.face=o.x>p.x?1:-1;p.inv=.2;effect(p.x,p.y-30,'','#b696ef','ring');hit(p,o,24,270,-180)}else{p.x=Math.max(26,Math.min(1126,p.x+p.face*180));p.inv=.15}}if(t==='upper'){p.vy=-630;p.ground=false;p.jumps=Math.max(1,p.jumps);p.inv=.18;effect(p.x,p.y-75,'','#ff985b','ring');if(Math.abs(o.x-p.x)<105&&Math.abs(o.y-p.y)<145)hit(p,o,27,180,-610)}newSkill(p,o,t);if(t==='heal'){p.hp=Math.min(p.f.hp,p.hp+8);p.buff=4;effect(p.x,p.y-70,'+8','#bcffd5');effect(p.x,p.y-40,'','#f9e8a3','ring')}}
function extraSkill(p,o,t){
 function area(r,d,k=320){return Math.abs(o.x-p.x)<r&&Math.abs(o.y-p.y)<110&&hit(p,o,d,k,-240)}
 function forward(r,d,k=360){return (o.x-p.x)*p.face>-10&&(o.x-p.x)*p.face<r&&Math.abs(o.y-p.y)<85&&hit(p,o,d,k,-240)}
 if(t==='cast'){p.buff=3;area(115,20);effect(p.x,p.y-40,'','#e8f3ff','ring')}
 if(t==='english')fire(p,'word',21,680,0,24);
 if(t==='flatfoot'){area(145,26);effect(p.x,p.y,'','#c9deb0','ring')}
 if(t==='keyboard')[-.17,0,.17].forEach(v=>fire(p,'note',8,600,v*400,20));
 if(t==='sleep'){p.hp=Math.min(p.f.hp,p.hp+8);p.buff=2;p.stun=.45;effect(p.x,p.y-75,'Zzz +8','#cae7ff')}
 if(t==='longleg'){forward(225,25);effect(p.x+p.face*110,p.y-24,'','#bef3e8','slash')}
 if(t==='basketball'){fire(p,'basket',23,650,-190,23);shots[shots.length-1].gravity=500;shots[shots.length-1].bounces=2}
 if(t==='yellow')fire(p,'lightning',22,900,0,21);
 if(t==='fourweek'){forward(105,27,480);effect(p.x+p.face*50,p.y-34,'4주 판정!','#ffd7d7')}
 if(t==='burp'){if(forward(180,23))o.slow=1.5;effect(p.x+p.face*80,p.y-34,'BUUURP','#d8f5b3','ring')}
 if(t==='curly'||t==='jumper'){area(95,t==='curly'?24:23);p.vy=t==='curly'?-750:-820;p.ground=false;p.jumps=Math.max(1,p.jumps);effect(p.x,p.y-35,'','#edd2ab','ring')}
 if(t==='forearm'){forward(90,29,430);effect(p.x+p.face*45,p.y-34,'악력!','#ffe0ba')}
 if(t==='football'){p.x=Math.max(24,Math.min(1128,p.x+p.face*Math.min(120,Math.max(0,Math.abs(o.x-p.x)-55))));p.face=o.x>p.x?1:-1;p.inv=.16;fire(p,'soccer',21,790,0,21)}
}
function extraUltimate(p,o,t){
 function area(r,d,k=420){return Math.abs(o.x-p.x)<r&&Math.abs(o.y-p.y)<150&&hit(p,o,d,k,-380)}
 const colors={cast:'#e8f3ff',flatfoot:'#d4edb6',sleep:'#cde6ff',longleg:'#bdf3e1',basketball:'#ffc57e',curly:'#efd7b7',jumper:'#decdff',burp:'#d8f5b3'};
 if(colors[t])effect(p.x,p.y-30,'',colors[t],'ring');
 if(t==='cast'){area(160,34);p.buff=5}
 if(t==='english')[-.14,0,.14].forEach(v=>fire(p,'word',15,730,v*500,25,true));
 if(t==='flatfoot'){area(220,39);p.buff=3}
 if(t==='keyboard')fire(p,'note',39,750,0,34,true);
 if(t==='sleep'){p.hp=Math.min(p.f.hp,p.hp+14);effect(p.x,p.y-75,'+14','#d5f4ff');area(170,28);p.buff=3}
 if(t==='longleg')area(200,40,550);
 if(t==='basketball'){area(165,41);p.vy=-730;p.ground=false;p.jumps=Math.max(1,p.jumps)}
 if(t==='yellow'){fire(p,'lightning',39,1000,0,30,true);p.boost=4}
 if(t==='fourweek'){for(let i=0;i<4;i++){fire(p,'verdict',12,640,0,22,true);shots[shots.length-1].x-=p.face*i*78}}
 if(t==='burp')area(250,36,580);
 if(t==='curly'){area(200,39);p.inv=.4}
 if(t==='forearm'){if((o.x-p.x)*p.face>-10&&(o.x-p.x)*p.face<125&&Math.abs(o.y-p.y)<110)hit(p,o,43,500,-330,false)}
 if(t==='football')[-.18,0,.18].forEach(v=>fire(p,'soccer',15,860,v*500,26,true));
 if(t==='jumper'){area(180,38);p.vy=-840;p.ground=false;p.jumps=1}
}
function newSkill(p,o,t){extraSkill(p,o,t);
 if(t==='soccer')fire(p,'soccer',24,920,0,22);
 if(t==='longarm'){effect(p.x+p.face*140,p.y-34,'','#ffcb91','slash');if((o.x-p.x)*p.face>-12&&(o.x-p.x)*p.face<240&&Math.abs(o.y-p.y)<65)hit(p,o,25,350,-180)}
 if(t==='head'){const old=p.x;p.inv=.22;p.x=Math.max(24,Math.min(1128,p.x+p.face*160));effect(p.x,p.y-45,'','#ffd598','ring');if(o.x>Math.min(old,p.x)-35&&o.x<Math.max(old,p.x)+35&&Math.abs(o.y-p.y)<75)hit(p,o,26,420,-240)}
 if(t==='dodge'){p.inv=.5;fire(p,'ball',23,850,0,23)}
 if(t==='talk')fire(p,'speech',20,520,0,26);
 if(t==='swagger'){p.boost=4;p.inv=.22;effect(p.x,p.y-50,'폼 상승!','#afddff')}
 if(t==='shadow')fire(p,'dark',23,600,0,23);
 if(t==='hypnosis')fire(p,'hypnosis',18,510,0,24);
 if(t==='wizard')[-.17,0,.17].forEach(v=>fire(p,'magic',9,620,v*500,19));
}
function newUltimate(p,o,t){extraUltimate(p,o,t);
 function area(range,height,d,k=350){return Math.abs(o.x-p.x)<range&&Math.abs(o.y-p.y)<height&&hit(p,o,d,k,-300)}
 if(t==='soccer')fire(p,'soccer',40,950,0,34,true);
 if(t==='longarm'){effect(p.x+p.face*230,p.y-34,'','#ffe3af','slash');if((o.x-p.x)*p.face>-12&&(o.x-p.x)*p.face<390&&Math.abs(o.y-p.y)<95)hit(p,o,40,470,-330)}
 if(t==='head'){effect(p.x,p.y-40,'','#ffcf81','ring');if(Math.abs(o.x-p.x)<180&&Math.abs(o.y-p.y)<140)hit(p,o,42,420,-680)}
 if(t==='dodge'){p.inv=.5;fire(p,'ball',39,910,0,34,true)}
 if(t==='talk'){effect(p.x,p.y-34,'논리 폭풍!','#bae9ff','ring');if(area(240,150,36))o.silence=2}
 if(t==='swagger'){area(180,120,36);p.boost=4;effect(p.x,p.y-34,'','#b1ddff','ring')}
 if(t==='shadow'){p.inv=.5;effect(p.x,p.y-34,'','#a18dda','ring');if(area(210,150,38))o.slow=2}
 if(t==='hypnosis'){effect(p.x,p.y-34,'','#e2b3f5','ring');if(area(220,145,34))o.confuse=1.8}
 if(t==='wizard'){shots.push({owner:p,x:o.x,y:o.y-300,vx:0,vy:720,d:43,life:1.5,type:'meteor',radius:36,ultimate:true});effect(o.x,o.y-15,'혜성 주의!','#ffdc8a')}
}
function ultimate(p,o){
 if(p.ult<100||p.ultLock>0||p.silence>0)return false;
 p.ult=0;p.ultLock=4;p.ultGlow=1.1;p.cool=.5;p.inv=.25;p.action=.4;p.ultAttack=true;
 effect(p.x,p.y-100,'★ '+p.f.ult.name,'#fff0a2');tone(1000,.25);shake=8;
 const t=p.f.type;
 if(t==='dash')shots.push({owner:p,x:p.x+p.face*30,y:p.y-34,vx:p.face*780,vy:0,d:40,life:1.6,type:'beam',radius:34,ultimate:true});
 if(t==='quake'){effect(p.x,p.y-25,'','#ffbd77','ring');if(Math.abs(o.x-p.x)<235&&Math.abs(o.y-p.y)<130)hit(p,o,43,550,-560)}
 if(t==='arrow'){for(let i=0;i<5;i++)shots.push({owner:p,x:Math.max(20,Math.min(1132,o.x+(i-2)*28)),y:o.y-245-i*43,vx:0,vy:660,d:10,life:1.5,type:'rain',ultimate:true})}
 if(t==='ice'){effect(p.x,p.y-34,'','#9befff','ring');if(Math.abs(o.x-p.x)<210&&Math.abs(o.y-p.y)<150){if(hit(p,o,35,250,-300))o.slow=3}}
 if(t==='blink'){if(Math.abs(o.x-p.x)<480&&Math.abs(o.y-p.y)<220){p.x=Math.max(26,Math.min(1126,o.x-o.face*48));p.y=o.y;p.face=o.x>p.x?1:-1;hit(p,o,39,370,-290)}else{p.x=Math.max(26,Math.min(1126,p.x+p.face*300))}effect(p.x,p.y-30,'','#cab1ff','ring')}
 if(t==='upper'){p.vy=-720;p.ground=false;p.jumps=Math.max(1,p.jumps);effect(p.x,p.y-60,'','#ff8151','ring');if(Math.abs(o.x-p.x)<150&&Math.abs(o.y-p.y)<190)hit(p,o,42,230,-750)}
 newSkill(p,o,t);if(t==='heal'){p.hp=Math.min(p.f.hp,p.hp+18);p.buff=5;effect(p.x,p.y-75,'+18','#c5ffcf');effect(p.x,p.y-30,'','#fff4ad','ring');if(Math.abs(o.x-p.x)<160&&Math.abs(o.y-p.y)<110)hit(p,o,24,460,-250)}
 newUltimate(p,o,t);p.ultAttack=false;return true;
}
function shotContact(s,o){let dx=s.x-s.prevX,dy=s.y-s.prevY,len=dx*dx+dy*dy;let u=len?Math.max(0,Math.min(1,((o.x-s.prevX)*dx+(o.y-34-s.prevY)*dy)/len)):0;return Math.abs(s.prevX+u*dx-o.x)<(s.radius||20)&&Math.abs(s.prevY+u*dy-(o.y-34))<(s.radius||32)}

 const inputs=new Map(inputRows.map(row=>[row.id,{...JSON.parse(row.input),seq:row.seq,live:now-row.updated<1500}]));
 const n=steps,dt=1/60;
 for(let tick=0;tick<n;tick++){
 if(battle.countdown>0){battle.countdown=Math.max(0,battle.countdown-dt);for(let p of players)p.lastEdges=inputs.get(p.id)?.edges||{};continue}
 battle.timer=Math.max(0,battle.timer-dt);
 for(let p of players){if(p.hp<=0)continue;
 const o=players.filter(q=>q.team!==p.team&&q.hp>0).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];if(!o)continue;
 const input=inputs.get(p.id),held=input?.live?input.held||{}:{},edges=input?.live?input.edges||{}:{};
 const tapped={};for(let k of ['jump','skill','ultimate']){tapped[k]=!!input?.live&&(edges[k]||0)>(p.lastEdges[k]||0)}if(input?.live){p.lastEdges={...edges,jump:Math.min(edges.jump||0,(p.lastEdges.jump||0)+(tapped.jump?1:0))};p.appliedSeq=input.seq||0;}
 for(let v of ['cool','skillcd','stun','inv','slow','buff','drop','action','comboTimer','ultLock','ultGlow','silence','confuse','boost'])p[v]=Math.max(0,p[v]-dt);
 p.ult=Math.min(100,p.ult+dt*1.1);if(p.comboTimer===0)p.combo=0;p.face=o.x>p.x?1:-1;p.guard=!!held.down&&p.ground&&p.stun===0&&p.cool===0;
 let dir=((held.right?1:0)-(held.left?1:0))*(p.confuse>0?-1:1);
 if(p.stun===0){let speed=p.f.spd*(p.boost>0?1.15:1)*(p.slow>0?.5:1)*(p.guard?.25:1)*(p.action>0?.45:1);p.vx+=(dir*speed-p.vx)*Math.min(1,dt*24);
 if(tapped.jump){if(held.down&&p.ground&&p.y<540){p.drop=.25;p.y+=8;p.ground=false;p.vy=60}else if(p.jumps<(p.f.airJumps||2)){p.vy=-p.f.jump*(p.jumps>=2?.76:p.jumps?.86:1);p.jumps++;p.ground=false}}
 if(tapped.ultimate)ultimate(p,o);else if(p.cool===0){if(tapped.skill&&p.skillcd===0)skill(p,o);else if(held.heavy)melee(p,o,true);else if(held.light)melee(p,o,false)}}
 let oldy=p.y;p.vy+=1800*dt;p.x=Math.max(23,Math.min(1129,p.x+p.vx*dt));p.y+=p.vy*dt;p.ground=false;
 for(let plat of mapdata[mapidx].p){if(p.vy>=0&&p.drop===0&&oldy<=plat[1]+2&&p.y>=plat[1]&&p.x+12>plat[0]&&p.x-12<plat[0]+plat[2]){p.y=plat[1];p.vy=0;p.ground=true;p.jumps=0;break}}
 if(p.y>760){p.hp=Math.max(0,p.hp-18);p.x=p.team?1020:130;p.y=250;p.vy=0;p.vx=0;p.inv=1;p.jumps=0;effect(p.x,p.y-90,'낙하 −18','#ffc89d')}}
 for(let s of shots){s.prevX=s.x;s.prevY=s.y;s.vy+=(s.gravity||0)*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
 if(s.bounces>0&&s.vy>0){for(let plat of mapdata[mapidx].p){if(s.prevY<=plat[1]&&s.y>=plat[1]&&s.x>plat[0]&&s.x<plat[0]+plat[2]){s.y=plat[1]-2;s.vy=-Math.abs(s.vy)*.8;s.bounces--;break}}}
 const o=players.filter(p=>p.team!==s.owner.team&&p.hp>0&&p.inv===0&&shotContact(s,p)).sort((a,b)=>Math.abs(a.x-s.prevX)-Math.abs(b.x-s.prevX))[0];
 if(o){s.owner.ultAttack=!!s.ultimate;s.owner.hitOrigin=s.prevX;let success=hit(s.owner,o,s.d,s.ultimate?360:200,s.ultimate?-240:-130);s.owner.ultAttack=false;delete s.owner.hitOrigin;
 if(success&&s.type==='ice')o.slow=2;if(success&&s.type==='dark')o.slow=1.5;if(success&&s.type==='speech')o.silence=1.5;if(success&&s.type==='hypnosis')o.confuse=1;if(success&&!s.noStatus&&s.type==='word')o.silence=1;if(success&&!s.noStatus&&['note','lightning'].includes(s.type))o.slow=s.ultimate?2:1;s.life=0}}
 shots=shots.filter(s=>s.life>0&&s.x>-60&&s.x<1212);for(let e of effects)e.t+=dt;effects=effects.filter(e=>e.t<e.life).slice(-60);
 let alive=[0,1].map(t=>players.some(p=>p.team===t&&p.hp>0));
 if(!alive[0]||!alive[1]||battle.timer<=0){let health=[0,1].map(t=>players.filter(p=>p.team===t).reduce((s,p)=>s+p.hp/p.f.hp,0));battle.winner=health[0]===health[1]?-1:health[0]>health[1]?0:1;battle.ended=true;room.phase='roundResult';if(battle.winner>=0)room.score[battle.winner]++;room.results.push({pair:room.matchIndex,winner:battle.winner,names:players.map(p=>p.name)});break}
 }
 battle.players=players.map(({f,...p})=>p);battle.shots=shots.map(({owner,...s})=>({...s,ownerId:owner.id}));battle.effects=effects;
}
