const PRED={q:'Vyhraje Keysynko další zápas v League of Legends?',min:100,open:true,yes:58000,no:27400};
function renderPredictions(){
 const el=document.getElementById('tab-predictions'),tot=PRED.yes+PRED.no,py=Math.round(PRED.yes/tot*100);
 const kY=(tot/PRED.yes).toFixed(2),kN=(tot/PRED.no).toFixed(2);
 el.innerHTML=`<h1>Stream Sázky & Predikce</h1><p class="sub">Vsaď své body na výsledek Keysynkovy hry.</p>
 <div class="card"><div class="row"><span class="badge blue">${PRED.open?'SÁZKA JE OTEVŘENA':'UZAVŘENO'}</span><span class="sub" style="margin:0 0 0 auto">Celkový pool: ${fmt(tot)} B</span></div>
 <h2 style="margin-top:1rem">${PRED.q}</h2><p class="sub">Minimální sázka je ${PRED.min} bodů.</p>
 <div class="row" style="justify-content:space-between"><b style="color:var(--blue)">ANO (${py} %)</b><b style="color:var(--red-hi)">NE (${100-py} %)</b></div>
 <div class="bar"><i style="width:${py}%"></i></div><p class="sub">Kurz ANO ${kY}× · Kurz NE ${kN}×</p>
 <div class="grid">${[['yes','ANO','',kY],['no','NE','no',kN]].map(([k,l,cls,kurz])=>`<div class="bet-box ${cls}"><b>Vsadit na ${l}</b> <span class="sub">výhra ${kurz}×</span>
 <div class="row"><input id="bet_${k}" type="number" min="${PRED.min}" value="500" style="flex:1"><button class="btn ${cls?'red':''}" onclick="placeBet('${k}')" ${PRED.open?'':'disabled'}>VSADIT</button></div></div>`).join('')}</div>
 ${isStaff()?`<div class="row" style="margin-top:1rem"><button class="btn ghost" onclick="togglePred()">${PRED.open?'Uzavřít sázky':'Otevřít sázky'}</button></div>`:''}</div>`}
function placeBet(side){
 const v=parseInt(document.getElementById('bet_'+side).value)||0;
 if(!PRED.open)return toast('Sázky jsou uzavřené',true);
 if(v<PRED.min)return toast('Minimální sázka je '+PRED.min+' B',true);
 if(v>State.user.points)return toast('Nemáš dost bodů',true);
 addPoints(-v);PRED[side]+=v;renderPredictions();toast('Vsazeno '+fmt(v)+' B')}
function togglePred(){if(!isStaff())return;PRED.open=!PRED.open;renderPredictions()}
