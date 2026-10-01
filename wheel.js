const WHEEL={cost:200,prizes:[{t:'0 B',v:0,c:'#1a1d27'},{t:'+100 B',v:100,c:'#0a84ff'},{t:'+300 B',v:300,c:'#c8102e'},{t:'+50 B',v:50,c:'#0f9d3f'},{t:'0 B',v:0,c:'#1a1d27'},{t:'+1000 B',v:1000,c:'#ff1f3d'}],angle:0,spinning:false};
function renderWheel(){
 document.getElementById('tab-wheel').innerHTML=`<h1>Kolo štěstí</h1><p class="sub">Roztoč kolo za ${WHEEL.cost} B.</p>
 <canvas id="wheelCv" width="360" height="360"></canvas><div><button class="btn red" id="spinBtn" onclick="spinWheel()">Roztočit</button></div>`;
 drawWheel()}
function drawWheel(){
 const cv=document.getElementById('wheelCv');if(!cv)return;const c=cv.getContext('2d'),n=WHEEL.prizes.length,r=170,a=2*Math.PI/n;
 c.clearRect(0,0,360,360);c.save();c.translate(180,180);c.rotate(WHEEL.angle);
 WHEEL.prizes.forEach((p,i)=>{c.beginPath();c.moveTo(0,0);c.arc(0,0,r,i*a,(i+1)*a);c.fillStyle=p.c;c.fill();c.stroke();
  c.save();c.rotate(i*a+a/2);c.fillStyle='#fff';c.font='bold 15px sans-serif';c.textAlign='right';c.fillText(p.t,r-12,5);c.restore()});
 c.restore();c.fillStyle='#19e65c';c.beginPath();c.moveTo(340,180);c.lineTo(360,170);c.lineTo(360,190);c.fill()}
function spinWheel(){
 if(WHEEL.spinning)return;if(State.user.points<WHEEL.cost)return toast('Nemáš dost bodů',true);
 addPoints(-WHEEL.cost);WHEEL.spinning=true;document.getElementById('spinBtn').disabled=true;
 const n=WHEEL.prizes.length,a=2*Math.PI/n,idx=Math.floor(Math.random()*n);
 const target=WHEEL.angle+6*Math.PI*2+((2*Math.PI-(idx*a+a/2))-(WHEEL.angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
 const start=WHEEL.angle,t0=performance.now(),dur=4000;
 (function step(t){const p=Math.min(1,(t-t0)/dur);WHEEL.angle=start+(target-start)*(1-Math.pow(1-p,3));drawWheel();
  if(p<1)return requestAnimationFrame(step);
  WHEEL.spinning=false;const b=document.getElementById('spinBtn');if(b)b.disabled=false;
  const w=WHEEL.prizes[idx];if(w.v)addPoints(w.v);toast('Výsledek: '+w.t)})(t0)}
