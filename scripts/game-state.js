(function(){
  const KEY='tahmisci.game.rooms.v1';
  const listeners=new Set();
  const channel=('BroadcastChannel' in window)?new BroadcastChannel('tahmisci-game'):null;
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const write=(rooms)=>{localStorage.setItem(KEY,JSON.stringify(rooms));channel?.postMessage('sync');listeners.forEach(fn=>fn())};
  const code=()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const id=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
  const mutate=(roomCode,fn)=>{const rooms=read(),room=rooms[roomCode];if(!room)return null;fn(room);room.updatedAt=Date.now();rooms[roomCode]=room;write(rooms);return room};
  const api={
    get:c=>read()[c]||null,
    create(name,pid){const rooms=read(),c=code();rooms[c]={code:c,hostId:pid,phase:'lobby',round:0,letter:null,pendingLetter:null,selectedLetters:[],roundEndsAt:null,players:[{id:pid,name,ready:false,done:false,score:0,answers:{},bot:false}],createdAt:Date.now()};write(rooms);return rooms[c]},
    join(c,name,pid){c=c.toUpperCase();const room=read()[c];if(!room)throw Error('Oda bulunamadı.');if(room.phase!=='lobby')throw Error('Oyun başlamış.');if(room.players.length>=8)throw Error('Oda dolu.');return mutate(c,r=>{if(!r.players.some(p=>p.id===pid))r.players.push({id:pid,name,ready:false,done:false,score:0,answers:{},bot:false})})},
    leave(c,pid){const rooms=read(),r=rooms[c];if(!r)return;r.players=r.players.filter(p=>p.id!==pid);if(!r.players.length)delete rooms[c];else{if(r.hostId===pid)r.hostId=r.players[0].id;rooms[c]=r}write(rooms)},
    addBot(c){return mutate(c,r=>{if(r.players.length<8){const n=r.players.filter(p=>p.bot).length+1;r.players.push({id:'bot-'+id(),name:['Asya','Doğa','Eylül','Ali'][n-1]||'Misafir '+n,ready:true,done:false,score:0,answers:{},bot:true})}})},
    pick(c,pid,letter){return mutate(c,r=>{if(r.hostId===pid&&!r.selectedLetters.includes(letter))r.pendingLetter=letter})},
    confirm(c,pid){return mutate(c,r=>{if(r.hostId===pid&&r.pendingLetter){r.letter=r.pendingLetter;r.pendingLetter=null;r.players.forEach(p=>p.ready=p.bot)}})},
    ready(c,pid){return mutate(c,r=>{const p=r.players.find(x=>x.id===pid);if(p)p.ready=!p.ready})},
    start(c,pid){return mutate(c,r=>{if(r.hostId!==pid||!r.letter||!r.players.every(p=>p.ready))return;r.phase='round';r.round++;r.roundEndsAt=Date.now()+90000;r.players.forEach(p=>{p.done=p.bot;p.roundScore=0;p.answers=p.bot?botAnswers(r.letter,p.name):{}})})},
    answers(c,pid,answers){return mutate(c,r=>{const p=r.players.find(x=>x.id===pid);if(p&&!p.done)p.answers=answers})},
    done(c,pid){return mutate(c,r=>{const p=r.players.find(x=>x.id===pid);if(p)p.done=true;if(r.players.every(x=>x.done))finish(r)})},
    tick(c){return mutate(c,r=>{if(r.phase==='round'&&Date.now()>=r.roundEndsAt)finish(r)})},
    next(c,pid){return mutate(c,r=>{if(r.hostId!==pid)return;r.selectedLetters.push(r.letter);r.letter=null;r.pendingLetter=null;r.phase='lobby';r.roundEndsAt=null;r.players.forEach(p=>{p.ready=p.bot;p.done=false;p.answers={}})})},
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
  };
  function finish(r){if(r.phase!=='round')return;const cats=['isim','sehir','hayvan','bitki','esya','marka'];for(const cat of cats){const valid=r.players.map(p=>norm(p.answers[cat])).filter(v=>v&&v.startsWith(norm(r.letter)));const counts=valid.reduce((a,v)=>(a[v]=(a[v]||0)+1,a),{});r.players.forEach(p=>{const v=norm(p.answers[cat]);p.roundScore=(p.roundScore||0)+(v&&v.startsWith(norm(r.letter))?(counts[v]>1?5:10):0)})}r.players.forEach(p=>{p.score+=(p.roundScore||0);p.roundScore=p.roundScore||0});r.phase='results';r.roundEndsAt=null}
  function norm(s){return String(s||'').trim().toLocaleUpperCase('tr-TR')}
  function botAnswers(l,n){const d={A:['AYŞE','ANKARA','AT','ARDIÇ','AYNA','ARÇELİK'],B:['BURAK','BURSA','BALIK','BEGONYA','BARDAK','BEKO'],K:['KEREM','KARS','KEDİ','KAKTÜS','KALEM','KOTON'],M:['MERT','MUĞLA','MARTI','MENEKŞE','MASA','MADO'],S:['SELİN','SİNOP','SERÇE','SÜMBÜL','SAAT','SAMSUNG']};const x=d[l]||Array(6).fill(l+n);return Object.fromEntries(['isim','sehir','hayvan','bitki','esya','marka'].map((k,i)=>[k,x[i]]))}
  window.addEventListener('storage',()=>listeners.forEach(fn=>fn()));channel&&(channel.onmessage=()=>listeners.forEach(fn=>fn()));window.GameStore=api;
})();
