const KEY='ilyshop_demo_orders', PKEY='ilyshop_demo_products', CKEY='ilyshop_demo_cart';
const defaults=[
 {id:'p1',name:'แพ็กเกจเริ่มต้น',category:'Hay Day',price:39,description:'ตัวอย่างสินค้า แก้ไขชื่อและราคาได้ในหน้าแอดมิน'},
 {id:'p2',name:'แพ็กเกจยอดนิยม',category:'Hay Day',price:89,description:'ตัวอย่างสินค้า สามารถเพิ่มรายละเอียดสินค้าได้'},
 {id:'p3',name:'บริการจัดการคลัง',category:'บริการ',price:150,description:'ตัวอย่างบริการ กรุณาตรวจสอบรายละเอียดก่อนสั่งซื้อ'}
];
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
let products=read(PKEY,defaults), cart=read(CKEY,[]);
const $=id=>document.getElementById(id), money=n=>'฿'+Number(n).toLocaleString('th-TH');
function save(){localStorage.setItem(PKEY,JSON.stringify(products));localStorage.setItem(CKEY,JSON.stringify(cart))}
function renderProducts(){let q=$('search').value.toLowerCase(),c=$('category').value;let list=products.filter(p=>(p.name+' '+p.description).toLowerCase().includes(q)&&(c==='all'||p.category===c));$('productTotal').textContent=`${list.length} รายการ`;$('productsGrid').innerHTML=list.length?list.map(p=>`<article class="product-card"><div class="product-art">ily ♡</div><div class="product-info"><small>${esc(p.category||'สินค้า')}</small><h3>${esc(p.name)}</h3><p>${esc(p.description||'')}</p><div class="product-foot"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">+ เพิ่มลงตะกร้า</button></div></div></article>`).join(''):'<div class="empty">ไม่พบสินค้าที่ค้นหา</div>'}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function total(){return cart.reduce((s,x)=>s+x.price*x.qty,0)}
function renderCart(){$('cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0);$('cartTotal').textContent=money(total());$('checkoutTotal').textContent=money(total());$('cartItems').innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><b>${esc(x.name)}</b><small>${money(x.price)} / ชิ้น</small></div><div class="qty"><button data-dec="${x.id}">−</button><b>${x.qty}</b><button data-inc="${x.id}">+</button></div></div>`).join(''):'<div class="empty">ยังไม่มีสินค้าในตะกร้า ♡</div>';$('checkoutBtn').disabled=!cart.length;save()}
function toggleCart(open){$('cartDrawer').classList.toggle('open',open);$('overlay').classList.toggle('show',open)}
$('productsGrid').addEventListener('click',e=>{let id=e.target.dataset.add;if(!id)return;let p=products.find(x=>x.id===id),found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({...p,qty:1});renderCart();toggleCart(true)});
$('cartItems').addEventListener('click',e=>{let id=e.target.dataset.inc||e.target.dataset.dec;if(!id)return;let x=cart.find(i=>i.id===id);if(e.target.dataset.inc)x.qty++;else x.qty--;cart=cart.filter(i=>i.qty>0);renderCart()});
$('openCart').onclick=()=>toggleCart(true);$('closeCart').onclick=()=>toggleCart(false);$('overlay').onclick=()=>toggleCart(false);
$('search').oninput=renderProducts;$('category').onchange=renderProducts;
$('checkoutBtn').onclick=()=>{toggleCart(false);$('checkoutDialog').showModal()};$('closeCheckout').onclick=()=>$('checkoutDialog').close();
$('orderForm').onsubmit=e=>{e.preventDefault();if(!cart.length)return;let f=new FormData(e.target),order={id:'ILY'+Date.now().toString().slice(-8),created:new Date().toISOString(),customer:f.get('customer'),contact:f.get('contact'),gameInfo:f.get('gameInfo'),payment:f.get('payment'),note:f.get('note'),items:cart.map(({id,name,price,qty})=>({id,name,price,qty})),total:total(),status:'รอตรวจสอบ'};let orders=read(KEY,[]);orders.unshift(order);localStorage.setItem(KEY,JSON.stringify(orders));$('orderNumber').textContent=order.id;$('checkoutDialog').close();$('successDialog').showModal();cart=[];renderCart();e.target.reset()};
$('finishOrder').onclick=()=>$('successDialog').close();$('year').textContent=new Date().getFullYear();renderProducts();renderCart();