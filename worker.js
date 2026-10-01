/* Cloudflare Worker – bezpečná výměna kódu za token (client secret nesmí být na GitHub Pages).
   Nastavení: Variables → KICK_CLIENT_ID, KICK_CLIENT_SECRET (Secret), ALLOWED_ORIGIN (např. https://mmaverick14.github.io) */
export default{async fetch(req,env){
 const cors={'Access-Control-Allow-Origin':env.ALLOWED_ORIGIN,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,OPTIONS'};
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return new Response('Method not allowed',{status:405,headers:cors});
 const {code,code_verifier,redirect_uri}=await req.json();
 const t=await fetch('https://id.kick.com/oauth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
  body:new URLSearchParams({grant_type:'authorization_code',client_id:env.KICK_CLIENT_ID,client_secret:env.KICK_CLIENT_SECRET,redirect_uri,code_verifier,code})});
 if(!t.ok)return new Response('token error',{status:401,headers:cors});
 const {access_token}=await t.json();
 const u=await fetch('https://api.kick.com/public/v1/users',{headers:{Authorization:'Bearer '+access_token}});
 const d=(await u.json()).data?.[0];
 if(!d)return new Response('user error',{status:401,headers:cors});
 return new Response(JSON.stringify({username:d.name,id:d.user_id,avatar:d.profile_picture,is_sub:false}),{headers:{...cors,'Content-Type':'application/json'}});
}}
