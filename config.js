/* ===== JEDINÉ, CO MUSÍŠ DOPLNIT ===== */
const KICK={
 clientId:'',            // 1) Client ID z Kick Developer (kick.com → Settings → Developer)
 tokenEndpoint:'',       // 2) URL tvého Workeru z worker.js (např. https://kick-auth.TVUJ.workers.dev)
 redirectUri:location.origin+location.pathname, // 3) musí přesně sedět s Redirect URI v Kick aplikaci
 streamers:['keysynko'], // Kick jména se rolí Streamer (malá/velká písmena nehrají roli)
 admins:[],              // Kick jména s rolí Administrátor
 startPoints:1000,       // body pro nového diváka
 scope:'user:read',
 authUrl:'https://id.kick.com/oauth/authorize'
};
