const WHEEL={angle:0,spinning:false};
const WCOL=['#1a2233','#0a84ff','#c8102e','#0f9d3f','#ff1f3d','#1d4a85','#6a1020','#0c6b2c'];
const WP=()=>State.wheel;
function renderWheel(){
 document.getElementById('tab-wheel').innerHTML=`<h1>🎡 Kolo Štěstí</h1><p class="sub">Roztoč kolo za ${WP().cost} B.</p>
 <div class="row" style="align-items:flex-start;gap:1.5rem"><div><canvas id="wheelCv" width="360" height="360"></canvas><div><button class="btn red" id="spinBtn" onclick="spinWheel()">Roztočit</button></div></div>${isStaff()?wheelAdmin():''}</div>`;
 drawWheel()}
function wheelAdmin(){
 const p=WP().prizes,sum=p.reduce((s,x)=>s+x.chance,0),ok=Math.abs(sum-100)<0.01;
 return `<div class="card" style="flex:1;min-width:320px"><h3>Nastavení kola</h3>
 <label class="sub">Cena otočení (B) <input type="number" min="0" value="${WP().cost}" onchange="wheelCost(this.value)" style="width:90px"></label>
 <table><tr><th>Výhra</th><th>Typ</th><th>Body</th><th>Šance %</th><th></th></tr>${p.map(x=>`<tr>
 <td><input value="${esc(x.name)}" onchange="wheelEdit(${x.id},'name',this.value)" style="width:110px"></td>
 <td><select onchange="wheelEdit(${x.id},'type',this.value)"><option value="points" ${x.type==='points'?'selected':''}>Body</option><option value="item" ${x.type==='item'?'selected':''}>Věc</option></select></td>
 <td><input type="number" value="${x.val}" ${x.type==='item'?'disabled':''} onchange="wheelEdit(${x.id},'val',this.value)" style="width:75px"></td>
 <td><input type="number" step="0.1" min="0" value="${x.chance}" onchange="wheelEdit(${x.id},'chance',this.value)" style="width:70px"></td>
 <td><button class="btn red" onclick="wheelDel(${x.id})">✕</button></td></tr>`).join('')}</table>
 <p class="sub" style="color:${ok?'var(--green)':'var(--red-hi)'}">Součet šancí: ${+sum.toFixed(2)} %${ok?'':' (při losování se přepočítá na 100 %)'}</p>
 <button class="btn green" onclick="wheelAdd()">+ Přidat výhru</button></div>`}
function wheelCost(v){if(!isStaff())return;WP().cost=Math.max(0,parseInt(v)||0);saveState();renderWheel()}
function wheelEdit(id,k,v){if(!isStaff())return;const x=WP().prizes.find(p=>p.id===id);if(!x)return;
 x[k]=(k==='val'||k==='chance')?Math.max(0,parseFloat(v)||0):v;if(k==='type'&&v==='item')x.val=0;saveState();renderWheel()}
function wheelAdd(){if(!isStaff())return;WP().prizes.push({id:State.nextId++,name:'Nová výhra',type:'points',val:100,chance:0});saveState();renderWheel()}
function wheelDel(id){if(!isStaff())return;if(WP().prizes.length<=2)return toast('Kolo musí mít aspoň 2 výhry',true);WP().prizes=WP().prizes.filter(p=>p.id!==id);saveState();renderWheel()}
function drawWheel(){
 const cv=document.getElementById('wheelCv');if(!cv)return;const c=cv.getContext('2d'),P=WP().prizes,n=P.length,r=170,a=2*Math.PI/n;
 c.clearRect(0,0,360,360);c.save();c.translate(180,180);c.rotate(WHEEL.angle);c.strokeStyle='#050507';
 P.forEach((p,i)=>{c.beginPath();c.moveTo(0,0);c.arc(0,0,r,i*a,(i+1)*a);c.fillStyle=WCOL[i%WCOL.length];c.fill();c.stroke();
  c.save();c.rotate(i*a+a/2);c.fillStyle='#fff';c.font='bold 13px sans-serif';c.textAlign='right';c.fillText(p.name.slice(0,14),r-12,5);c.restore()});
 c.restore();c.fillStyle='#19e65c';c.beginPath();c.moveTo(340,180);c.lineTo(360,170);c.lineTo(360,190);c.fill()}
function pickPrize(){const P=WP().prizes,t=P.reduce((s,x)=>s+x.chance,0);if(t<=0)return -1;let r=Math.random()*t;
 for(let i=0;i<P.length;i++){r-=P[i].chance;if(r<0)return i}return P.length-1}
function spinWheel(){
 if(WHEEL.spinning)return;const W=WP();
 if(State.user.points<W.cost)return toast('Nemáš dost bodů',true);
 const idx=pickPrize();if(idx<0)return toast('Kolo nemá nastavené šance',true);
 addPoints(-W.cost);WHEEL.spinning=true;document.getElementById('spinBtn').disabled=true;
 const a=2*Math.PI/W.prizes.length,start=WHEEL.angle,t0=performance.now();
 const target=start+6*Math.PI*2+((2*Math.PI-(idx*a+a/2))-(start%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
 (function step(t){const p=Math.min(1,(t-t0)/4000);WHEEL.angle=start+(target-start)*(1-Math.pow(1-p,3));drawWheel();
  if(p<1)return requestAnimationFrame(step);
  WHEEL.spinning=false;const b=document.getElementById('spinBtn');if(b)b.disabled=false;
  const w=W.prizes[idx];
  if(w.type==='item'){State.inventory.push({uid:Date.now()+Math.random(),name:w.name,cat:'Kolo štěstí',qty:1,code:null,date:new Date().toLocaleString('cs-CZ')});saveState();renderHeader()}
  else if(w.val)addPoints(w.val);
  toast('Výsledek: '+w.name)})(t0)}
