const P=()=>State.pred;
let predTimer=null;
const mmss=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const kurz=(t,s)=>t&&s?(t/s).toFixed(2)+'x':'—';
function renderPredictions(){
 const p=P(),tot=p.yes+p.no,py=tot?Math.round(p.yes/tot*100):50;
 const st=p.result?'● VYHODNOCENO: '+esc(p.result==='yes'?p.a:p.b):p.open?'● SÁZKA JE OTEVŘENA':'● SÁZKA JE UZAVŘENA';
 const adm=isStaff()?`<div class="card" style="margin-top:1rem"><h3>Správa sázky</h3>
 <div class="row"><input id="pq" placeholder="Otázka" style="flex:2;min-width:200px"><input id="pa" placeholder="Možnost A" value="ANO" style="width:100px"><input id="pb" placeholder="Možnost B" value="NE" style="width:100px"><input id="pt" type="number" min="1" value="5" style="width:80px" title="Délka v minutách"><input id="pm" type="number" min="1" value="100" style="width:80px" title="Minimální sázka"></div>
 <p class="sub" style="margin:.3rem 0">Pole vpravo: délka v minutách a minimální sázka.</p>
 <div class="row"><button class="btn green" onclick="newPred()">Vytvořit novou sázku</button><button class="btn ghost" onclick="togglePred()">${p.open?'Uzavřít':'Otevřít'}</button>
 <button class="btn" onclick="resolvePred('yes')">Vyhrála A</button><button class="btn red" onclick="resolvePred('no')">Vyhrála B</button></div></div>`:'';
 document.getElementById('tab-predictions').innerHTML=`<h1>🎲 Stream Sázky & Predikce</h1><p class="sub">Vsaď své body na výsledek Keysynkovy hry a získej násobek výhry!</p>
 <div class="pcard"><div class="head"><span class="tag">${st}</span>
 <span>💰 Celkový Pool: <b>${fmt(tot)} B</b> &nbsp;•&nbsp; <span class="time">⏱ Konec za: <b id="predTime">${mmss(p.left)}</b></span></span></div>
 <h2 class="pq">${esc(p.q)}</h2><p class="sub" style="font-size:.68rem">Minimální sázka je ${p.min} bodů. Po skončení vyhrají lidé se správným tipem!</p>
 <div class="opts"><span class="a">● MOŽNOST A: ${esc(p.a)} ( ${py}% )</span><span class="b">MOŽNOST B: ${esc(p.b)} ( ${100-py}% ) ●</span></div>
 <div class="pbar"><i style="width:${py}%"></i></div>
 <div class="kurzy"><span>Kurz: <span class="a">${kurz(tot,p.yes)}</span> (${fmt(p.yes)} B)</span><span>Kurz: <span class="b">${kurz(tot,p.no)}</span> (${fmt(p.no)} B)</span></div>
 <div class="bets">${[['yes','👍 Vsadit na '+p.a,'',kurz(tot,p.yes),''],['no','👎 Vsadit na '+p.b,'no',kurz(tot,p.no),'red']].map(([k,l,c,kz,b])=>`<div class="bbox ${c}"><div class="t">${esc(l)}<span>Výhra: ${kz}</span></div>
 <div class="in"><input id="bet_${k}" type="number" min="${p.min}" value="500"><button class="btn ${b}" onclick="placeBet('${k}')" ${p.open?'':'disabled'}>VSADIT</button></div></div>`).join('')}</div></div>${adm}`;
 clearInterval(predTimer);
 predTimer=setInterval(()=>{const t=document.getElementById('predTime');if(!t)return clearInterval(predTimer);
  if(p.open&&p.left>0)p.left--;t.textContent=mmss(p.left);if(p.open&&p.left===0){p.open=false;saveState();renderPredictions()}},1000)}
function placeBet(side){
 const p=P(),v=parseInt(document.getElementById('bet_'+side).value)||0;
 if(!p.open)return toast('Sázky jsou uzavřené',true);
 if(v<p.min)return toast('Minimální sázka je '+p.min+' B',true);
 if(v>State.user.points)return toast('Nemáš dost bodů',true);
 addPoints(-v);p[side]+=v;p.bets.push({name:State.user.name,side,amt:v});saveState();renderPredictions();toast('Vsazeno '+fmt(v)+' B')}
function newPred(){
 if(!isStaff())return;const q=pq.value.trim();if(!q)return toast('Zadej otázku',true);
 State.pred={q,a:pa.value.trim()||'ANO',b:pb.value.trim()||'NE',min:Math.max(1,parseInt(pm.value)||100),open:true,yes:0,no:0,left:Math.max(1,parseInt(pt.value)||5)*60,bets:[],result:null};
 saveState();renderPredictions();toast('Nová sázka vytvořena')}
function togglePred(){if(!isStaff())return;const p=P();p.open=!p.open;if(p.open&&p.left<=0)p.left=300;saveState();renderPredictions()}
function resolvePred(side){
 if(!isStaff())return;const p=P(),tot=p.yes+p.no,win=p[side];
 if(p.result)return toast('Sázka už je vyhodnocená',true);
 p.bets.filter(b=>b.side===side&&win>0).forEach(b=>{const u=State.users.find(x=>x.name===b.name);if(!u)return;
  u.points+=Math.floor(b.amt*tot/win);if(State.user.name===u.name)State.user.points=u.points});
 p.open=false;p.result=side;saveState();renderHeader();renderPredictions();toast('Vyhodnoceno, výhry vyplaceny')}
