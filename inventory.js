function renderInventory(){
 const el=document.getElementById('tab-inventory');
 el.innerHTML=`<h1>Můj inventář</h1><p class="sub">Zakoupené položky a kódy poukazů.</p>`+
 (State.inventory.length?`<div class="grid">${State.inventory.map(x=>`<div class="card"><span class="badge blue">${esc(x.cat)}</span>
 <h3>${esc(x.name)}</h3><p class="sub">${x.qty}× · ${esc(x.date)}</p>
 ${x.code?`<span class="code">${x.code}</span> <button class="btn ghost" onclick="copyCode('${x.code}')">Kopírovat</button>`:''}</div>`).join('')}</div>`
 :'<div class="card">Inventář je prázdný. Podívej se do obchodu.</div>')}
function copyCode(c){(navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>toast('Kód zkopírován')).catch(()=>toast(c))}
