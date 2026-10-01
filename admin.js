function renderAdmin(){
 const el=document.getElementById('tab-admin');if(!isStaff()){el.innerHTML='';return}
 const total=State.users.reduce((s,u)=>s+u.points,0);
 el.innerHTML=`<h1>Administrace</h1><p class="sub">Správa obchodu, bodů a statistiky.</p>
 <div class="grid"><div class="card">Diváků<br><b>${State.users.length}</b></div><div class="card">Body celkem<br><b class="price">${fmt(total)} B</b></div>
 <div class="card">Produktů<br><b>${State.items.length}</b></div><div class="card">Nákupů<br><b>${State.inventory.length}</b></div></div>
 <h2 style="margin-top:1.5rem">Produkty</h2><button class="btn green" onclick="itemForm()">Přidat produkt</button>
 <table><tr><th>Název</th><th>Kategorie</th><th>Cena</th><th>Sub</th><th></th></tr>${State.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${esc(i.cat)}</td><td>${fmt(i.price)}</td><td>${i.subOnly?'ano':'ne'}</td>
 <td class="row"><button class="btn ghost" onclick="itemForm(${i.id})">Upravit</button><button class="btn red" onclick="deleteItem(${i.id})">Smazat</button></td></tr>`).join('')}</table>
 <h2 style="margin-top:1.5rem">Body diváků</h2><button class="btn red" onclick="resetAllPoints()">Resetovat všem</button>
 <table>${State.users.map((u,n)=>`<tr><td>${esc(u.name)}</td><td>${fmt(u.points)} B</td><td><button class="btn ghost" onclick="resetUserPoints(${n})">Reset</button></td></tr>`).join('')}</table>`}
function itemForm(id){
 const i=State.items.find(x=>x.id===id)||{name:'',cat:'Losování',price:100,subOnly:false,desc:''};
 openModal(`<h3>${id?'Upravit':'Nový'} produkt</h3><input id="fName" placeholder="Název" value="${esc(i.name)}">
 <select id="fCat">${CATS.slice(1).map(c=>`<option ${c===i.cat?'selected':''}>${c}</option>`).join('')}</select>
 <input id="fPrice" type="number" min="0" value="${i.price}"><input id="fDesc" placeholder="Popis" value="${esc(i.desc||'')}">
 <label><input id="fSub" type="checkbox" ${i.subOnly?'checked':''}> Pouze sub</label>
 <div class="row"><button class="btn" onclick="saveItem(${id||0})">Uložit</button><button class="btn ghost" onclick="closeModal()">Zrušit</button></div>`)}
function saveItem(id){
 if(!isStaff())return;
 const d={name:fName.value.trim(),cat:fCat.value,price:Math.max(0,parseInt(fPrice.value)||0),desc:fDesc.value,subOnly:fSub.checked};
 if(!d.name)return toast('Zadej název',true);
 if(id)Object.assign(State.items.find(x=>x.id===id),d);else State.items.push({id:State.nextId++,...d});
 saveState();closeModal();renderAdmin();toast('Produkt uložen')}
function deleteItem(id){if(!isStaff()||!confirm('Smazat produkt?'))return;State.items=State.items.filter(x=>x.id!==id);saveState();renderAdmin()}
function resetAllPoints(){if(!isStaff()||!confirm('Resetovat body všem?'))return;State.users.forEach(u=>u.points=0);State.user.points=0;saveState();renderHeader();renderAdmin()}
function resetUserPoints(n){if(!isStaff())return;const u=State.users[n];u.points=0;if(u.name===State.user.name)State.user.points=0;saveState();renderHeader();renderAdmin()}
