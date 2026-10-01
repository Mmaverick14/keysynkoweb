let shopCat='Vše';
function renderShop(){
 const el=document.getElementById('tab-shop');
 const items=State.items.filter(i=>shopCat==='Vše'||i.cat===shopCat);
 el.innerHTML=`<h1>Obchod za Body</h1><p class="sub">Utrať své body za tikety, poukazy a výhody.</p>
 <div class="chips">${CATS.map(c=>`<button class="chip ${c===shopCat?'active':''}" onclick="setShopCat('${c}')">${c}</button>`).join('')}</div>
 <div class="grid">${items.map(i=>`<div class="card item"><div class="row"><span class="badge blue">${esc(i.cat)}</span>${i.subOnly?'<span class="badge sub">POUZE SUB</span>':''}</div>
 <h3>${esc(i.name)}</h3><p class="sub">${esc(i.desc||'')}</p><div class="price">${fmt(i.price)} B</div>
 <div class="row" style="margin-top:.6rem"><input class="qty" id="q${i.id}" type="number" min="1" value="1" aria-label="Počet kusů"><button class="btn" onclick="buyItem(${i.id})">Koupit</button></div></div>`).join('')||'<p class="sub">V této kategorii nic není.</p>'}</div>`}
function setShopCat(c){shopCat=c;renderShop()}
function genCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<12;i++)s+=(i&&i%4===0?'-':'')+a[Math.floor(Math.random()*a.length)];return s}
function buyItem(id){
 const i=State.items.find(x=>x.id===id);if(!i)return;
 const q=Math.max(1,parseInt(document.getElementById('q'+id).value)||1),total=i.price*q;
 if(i.subOnly&&!State.user.sub)return toast('Tato položka je pouze pro subscribery',true);
 if(State.user.points<total)return toast('Nemáš dost bodů ('+fmt(total)+' B)',true);
 addPoints(-total);
 State.inventory.push({uid:Date.now()+Math.random(),name:i.name,cat:i.cat,qty:q,code:i.cat==='Poukazy'?genCode():null,date:new Date().toLocaleString('cs-CZ')});
 saveState();renderHeader();toast(`Koupeno: ${q}× ${i.name}`)}
