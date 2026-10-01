const SKEY='keysynko_session';
const kickConfigured=()=>!!(KICK.clientId&&KICK.tokenEndpoint);
const getSession=()=>{try{return JSON.parse(localStorage.getItem(SKEY))}catch(e){return null}};
const b64url=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const rnd=n=>b64url(crypto.getRandomValues(new Uint8Array(n)));
async function kickLogin(){
 if(!kickConfigured())return toast('Doplň clientId a tokenEndpoint v config.js',true);
 const v=rnd(48),st=rnd(16),ch=b64url(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(v)));
 sessionStorage.setItem('kick_v',v);sessionStorage.setItem('kick_s',st);
 location.href=KICK.authUrl+'?'+new URLSearchParams({response_type:'code',client_id:KICK.clientId,redirect_uri:KICK.redirectUri,scope:KICK.scope,code_challenge:ch,code_challenge_method:'S256',state:st})}
function kickLogout(){localStorage.removeItem(SKEY);location.reload()}
function roleFor(n){n=n.toLowerCase();const l=a=>a.map(x=>x.toLowerCase()).includes(n);return l(KICK.streamers)?'streamer':l(KICK.admins)?'admin':'viewer'}
function useSession(s){
 let u=State.users.find(x=>x.name===s.username);if(!u){u={name:s.username,points:KICK.startPoints};State.users.push(u)}
 State.user={name:u.name,points:u.points,sub:!!s.is_sub,role:roleFor(s.username),avatar:s.avatar||''};saveState()}
async function initAuth(){
 const q=new URLSearchParams(location.search);
 if(q.get('code')){
  try{if(q.get('state')!==sessionStorage.getItem('kick_s'))throw new Error('state');
   const r=await fetch(KICK.tokenEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:q.get('code'),code_verifier:sessionStorage.getItem('kick_v'),redirect_uri:KICK.redirectUri})});
   if(!r.ok)throw new Error(r.status);localStorage.setItem(SKEY,JSON.stringify(await r.json()))}
  catch(e){toast('Přihlášení přes Kick selhalo',true)}
  history.replaceState({},'',location.pathname)}
 const s=getSession();if(s&&s.username&&kickConfigured())useSession(s);
 document.getElementById('gate').hidden=!(kickConfigured()&&!(s&&s.username))}
function renderAuthUI(){
 const s=getSession(),on=kickConfigured()&&s;
 document.getElementById('demoSeg').hidden=kickConfigured();
 document.getElementById('loginBtn').hidden=!!on;
 document.getElementById('logoutBtn').hidden=!on;
 const a=document.getElementById('avatar');
 if(on&&s.avatar){a.textContent='';a.style.background='url('+s.avatar+') center/cover'}else a.textContent=(State.user.name||'?')[0].toUpperCase()}
