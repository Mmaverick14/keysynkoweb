const PRED={q:'Vyhraje Keysynko další zápas v League of Legends?',min:100,open:true,yes:58000,no:27400,left:135};
let predTimer=null;
const mmss=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
function renderPredictions(){
 const el=document.getElementById('tab-predictions'),tot=PRED.yes+PRED.no,py=Math.round(PRED.yes/tot*100);
 const kY=(tot/PRED.yes).toFixed(2),kN=(tot/PRED.no).toFixed(2);
 el.innerHTML=`<h1>🎲 Stream Sázky & Predikce</h1><p class="sub">Vsaď své body na výsledek Keysynkovy hry a získej násobek výhry!</p>
 <div class="pcard"><div class="head"><span class="tag">${PRED.open?'● SÁZKA JE OTEVŘENA':'● SÁZKA JE UZAVŘENA'}</span>
 <span>💰 Celkový Pool: <b>${fmt(tot)} B</b> &nbsp;•&nbsp; <span class="time">⏱ Konec za: <b id="predTime" class="time">${mmss(PRED.left)}</b></span></span></div>
 <h2 class="pq">${PRED.q}</h2><p class="sub" style="font-size:.68rem">Minimální sázka je ${PRED.min} bodů. Po skončení zápasu vyhrají lidé se správným tipem!</p>
 <div class="opts"><span class="a">● MOŽNOST A: ANO ( ${py}% )</span><span class="b">MOŽNOST B: NE ( ${100-py}% ) ●</span></div>
 <div class="pbar"><i style="width:${py}%"></i></div>
 <div class="kurzy"><span>Kurz: <span class="a">${kY}x</span> (${fmt(PRED.yes)} B)</span><span>Kurz: <span class="b">${kN}x</span> (${fmt(PRED.no)} B)</span></div>
 <div class="bets">${[['yes','👍 Vsadit na ANO','',kY,''],['no','👎 Vsadit na NE','no',kN,'red']].map(([k,l,c,kz,b])=>`<div class="bbox ${c}"><div class="t">${l}<span>Výhra: ${kz}x</span></div>
 <div class="in"><input id="bet_${k}" type="number" min="${PRED.min}" value="500"><button class="btn ${b}" onclick="placeBet('${k}')" ${PRED.open?'':'disabled'}>VSADIT</button></div></div>`).join('')}</div>
 ${isStaff()?`<div style="margin-top:1rem"><button class="btn ghost" onclick="togglePred()">${PRED.open?'Uzavřít sázky':'Otevřít sázky'}</button></div>`:''}</div>`;
 clearInterval(predTimer);
 predTimer=setInterval(()=>{const t=document.getElementById('predTime');if(!t){clearInterval(predTimer);return}
  if(PRED.open&&PRED.left>0)PRED.left--;t.textContent=mmss(PRED.left);if(PRED.left===0&&PRED.open){PRED.open=false;renderPredictions()}},1000)}
function placeBet(side){
 const v=parseInt(document.getElementById('bet_'+side).value)||0;
 if(!PRED.open)return toast('Sázky jsou uzavřené',true);
 if(v<PRED.min)return toast('Minimální sázka je '+PRED.min+' B',true);
 if(v>State.user.points)return toast('Nemáš dost bodů',true);
 addPoints(-v);PRED[side]+=v;renderPredictions();toast('Vsazeno '+fmt(v)+' B')}
function togglePred(){if(!isStaff())return;PRED.open=!PRED.open;if(PRED.open&&PRED.left<=0)PRED.left=300;renderPredictions()}
