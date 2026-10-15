// Server-clock playback. Arrival times never become the game clock.
class BattleBuffer {
 constructor(){this.offset=null;this.clockSamples=[];this.reset('')}
 reset(key){this.key=key;this.frames=[];this.gap=60;this.jitter=0;this.delay=120;this.playhead=null;this.lastRender=null;this.duplicates=0;this.synchronized=false}
 observeClock(serverNow,sent,received){if(!Number.isFinite(serverNow))return;const rtt=received-sent;if(rtt<0||rtt>2000)return;this.clockSamples.push({rtt,offset:serverNow-(sent+received)/2});if(this.clockSamples.length>32)this.clockSamples.shift();const best=this.clockSamples.reduce((a,b)=>a.rtt<b.rtt?a:b);this.offset=best.offset;}
 serverTime(now){return now+(this.offset??0)}
 push(room,received){const b=room.battle;if(!b)return false;const key=[room.code,room.matchIndex,room.mode,room.map,room.phase,!!room.paused].join(':');if(key!==this.key)this.reset(key);this.synchronized=Number.isFinite(room.playbackDelayMs);if(this.synchronized)this.delay=room.playbackDelayMs;const last=this.frames.at(-1);if(last&&b.lastTick<=last.tick){this.duplicates++;return false}
 if(this.offset===null)this.offset=b.lastTick-received;
 if(last&&!this.synchronized){const gap=b.lastTick-last.tick;const arrival=received-last.received;this.jitter=this.jitter*.9+Math.abs(arrival-gap)*.1;this.gap=this.gap*.9+Math.min(500,gap)*.1;const transit=this.clockSamples.length?Math.min(...this.clockSamples.map(s=>s.rtt))/2:0;const desired=Math.min(400,Math.max(90,this.gap*1.1+this.jitter*1.5+transit));this.delay=Math.max(desired,this.delay-2)}
 this.frames.push({tick:b.lastTick,battle:b,received});if(this.frames.length>64)this.frames.shift();return true}
 sample(now){if(!this.frames.length)return null;const newest=this.frames.at(-1),desired=this.serverTime(now)-this.delay;
 const rawDt=this.lastRender===null?0:Math.max(0,now-this.lastRender);this.lastRender=now;
 if(this.synchronized)this.playhead=Math.max(this.playhead??-Infinity,desired);else if(this.playhead===null||rawDt>1000)this.playhead=desired;
 else{const dt=Math.min(100,rawDt),error=desired-this.playhead;this.playhead+=dt*Math.max(.85,Math.min(1.15,1+error/500));}
 if(!this.synchronized)this.playhead=Math.min(this.playhead,newest.tick+80);const target=this.playhead;let a=this.frames[0],b=a;for(let i=1;i<this.frames.length;i++){b=this.frames[i];if(b.tick>=target)break;a=b}if(target>=newest.tick)a=b=newest;
 const mix=b.tick>a.tick?Math.max(0,Math.min(1,(target-a.tick)/(b.tick-a.tick))):0,extra=a===b?Math.min(80,Math.max(0,target-a.tick))/1000:0;
 const players=a.battle.players.map(p=>{const q=b.battle.players.find(q=>q.id===p.id);if(q&&a!==b){if(Math.abs(q.x-p.x)>240||Math.abs(q.y-p.y)>240||p.hp>q.hp&&q.stun>0)return {...(mix<1?p:q)};return {...p,x:p.x+(q.x-p.x)*mix,y:p.y+(q.y-p.y)*mix,face:mix<.5?p.face:q.face}}return {...p,x:Math.max(23,Math.min(1129,p.x+p.vx*extra)),y:p.ground?p.y:p.y+p.vy*extra+900*extra*extra}});
 return {battle:{...a.battle,players},elapsed:Math.max(0,target-a.tick)/1000,target,buffered:this.frames.length,delay:this.delay,synchronized:this.synchronized,stale:target-newest.tick>80};}
}

