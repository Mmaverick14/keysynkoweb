/* Stav aplikace + navigace. Vše je globální (window), načítá se jako první. */
const KEY='keysynko_hub_v1';
const DEFAULT_ITEMS=[
 {id:1,name:'Losovací tiket – Gift Sub',cat:'Losování',price:500,subOnly:false,desc:'Tiket do týdenního losování.'},
 {id:2,name:'Herní myš Logitech G Pro',cat:'Hardware',price:45000,subOnly:true,desc:'Výhra v soutěži o hardware.'},
 {id:3,name:'Steam poukaz 10 €',cat:'Poukazy',price:12000,subOnly:false,desc:'Kód pro Steam peněženku.'},
 {id:4,name:'VIP role na Discordu',cat:'VIP',price:8000,subOnly:true,desc:'30 dní VIP.'},
 {id:5,name:'CS2 skin – P250 Sand Dune',cat:'CS2 skiny',price:3000,subOnly:false,desc:'Předáno přes trade.'}];
const PLACEHOLDERS={tasks:'Úkoly a Odměny',monthly:'Měsíční Soutěž',quick:'Rychlá Soutěž',top:'Nejlepší Chatter'};
const CATS=['Vše','Losování','Hardware','Poukazy','VIP','CS2 skiny'];
const DEFAULT_WHEEL=()=>({cost:200,prizes:[{id:1,name:'Smůla',type:'points',val:0,chance:35},{id:2,name:'+50 B',type:'points',val:50,chance:25},{id:3,name:'+100 B',type:'points',val:100,chance:20},{id:4,name:'+300 B',type:'points',val:300,chance:12},{id:5,name:'+1000 B',type:'points',val:1000,chance:5},{id:6,name:'Gift Sub',type:'item',val:0,chance:3}]});
const DEFAULT_PRED=()=>({q:'Vyhraje Keysynko další zápas v League of Legends?',a:'ANO',b:'NE',min:100,open:true,yes:58000,no:27400,left:135,bets:[],result:null});
const freshState=()=>({user:{name:'Viewer_Keysynko',points:19250,sub:true,role:'viewer'},
 items:JSON.parse(JSON.stringify(DEFAULT_ITEMS)),inventory:[],nextId:100,
 users:[{name:'Viewer_Keysynko',points:19250},{name:'Chatter_2',points:4200},{name:'Chatter_3',points:870}],wheel:DEFAULT_WHEEL(),pred:DEFAULT_PRED()});
let State=freshState();
function loadState(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.user)State=Object.assign(freshState(),s)}catch(e){}}
function saveState(){try{localStorage.setItem(KEY,JSON.stringify(State))}catch(e){}}
const isStaff=()=>['admin','streamer'].includes(State.user.role);
const fmt=n=>Number(n).toLocaleString('cs-CZ');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(msg,err){const t=document.getElementById('toast');t.textContent=msg;t.className='toast show'+(err?' err':'');clearTimeout(t._t);t._t=setTimeout(()=>t.className='toast',2200)}
function openModal(html){document.getElementById('modalBox').innerHTML=html;document.getElementById('modal').hidden=false}
function closeModal(){document.getElementById('modal').hidden=true}
function renderHeader(){
 document.getElementById('userName').textContent=State.user.name;
 document.getElementById('userPts').textContent='💰 '+fmt(State.user.points)+' B';
 document.getElementById('segViewer').classList.toggle('on',!isStaff());document.getElementById('segStaff').classList.toggle('on',isStaff());
 document.getElementById('invCount').textContent=State.inventory.length;if(typeof renderAuthUI==='function')renderAuthUI()}
function addPoints(n){State.user.points+=n;const u=State.users.find(x=>x.name===State.user.name);if(u)u.points=State.user.points;saveState();renderHeader()}
function applyRole(){
 document.querySelectorAll('.staff-only').forEach(e=>e.classList.toggle('hidden-role',!isStaff()));
 const act=document.querySelector('.tab.active');
 if(!isStaff()&&act&&['tab-admin','tab-overlays'].includes(act.id))switchTab('predictions')}
function setRole(r){if(typeof kickConfigured==='function'&&kickConfigured())return;State.user.role=r;saveState();applyRole();renderHeader();refreshAll()}
function switchTab(name){
 if(['admin','overlays'].includes(name)&&!isStaff())return toast('Přístup jen pro administrátora / streamera',true);
 document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.id==='tab-'+name));
 document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
 if(PLACEHOLDERS[name]){document.getElementById('tab-'+name).innerHTML='<h1>'+PLACEHOLDERS[name]+'</h1><p class="sub">Tento modul se připravuje.</p><div class="card">Zatím tu nic není.</div>';return}
 const fn={predictions:'renderPredictions',wheel:'renderWheel',shop:'renderShop',inventory:'renderInventory',admin:'renderAdmin',overlays:'renderOverlays'}[name];
 if(typeof window[fn]==='function')window[fn]()}
function refreshAll(){const a=document.querySelector('.tab.active');if(a)switchTab(a.id.replace('tab-',''))}
document.addEventListener('DOMContentLoaded',async()=>{
 loadState();if(typeof initAuth==='function')await initAuth();
 document.querySelectorAll('#nav button').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
 document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
 applyRole();renderHeader();switchTab('predictions')});
