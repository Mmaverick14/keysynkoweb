/* OBS Overlay Studio – pouze Administrátor / Streamer */
const OVERLAYS=[{id:'pred',name:'Stav sázek',on:true},{id:'wheel',name:'Výsledek kola štěstí',on:false},{id:'alerts',name:'Alerty nákupů',on:true},{id:'top',name:'Žebříček bodů',on:false}];
function renderOverlays(){
 const el=document.getElementById('tab-overlays');
 if(!isStaff()){el.innerHTML='';return}
 el.innerHTML=`<h1>OBS Overlay Studio</h1><p class="sub">Zapni overlay a vlož jeho URL jako Browser Source v OBS.</p>
 <div class="grid">${OVERLAYS.map(o=>`<div class="card"><h3>${o.name}</h3><span class="badge ${o.on?'sub':''}">${o.on?'ZAPNUTO':'VYPNUTO'}</span>
 <p><span class="code">overlay.html?o=${o.id}</span></p><div class="row"><button class="btn ghost" onclick="toggleOverlay('${o.id}')">${o.on?'Vypnout':'Zapnout'}</button>
 <button class="btn ghost" onclick="copyCode('overlay.html?o=${o.id}')">Kopírovat URL</button></div></div>`).join('')}</div>`}
function toggleOverlay(id){if(!isStaff())return;const o=OVERLAYS.find(x=>x.id===id);o.on=!o.on;renderOverlays()}
