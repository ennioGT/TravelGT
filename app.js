 // ===== Cloudflare D1 API Configuration =====
const API_BASE = 'https://api.travel.cadgt.com';

async function apiLogin(email, password){
  const r = await fetch(`${API_BASE}/api/login`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
  });
  return await r.json();
}

async function apiRegister(nombre,email,password){
  const r = await fetch(`${API_BASE}/api/register`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({nombre,email,password})
  });
  return await r.json();
}


// ============ DATA (LOCAL DEMO) ============
let usuarios = [
  { id:1, name:'Administrador', email:'admin@guatemala.com', pass:'admin123', rol:'admin', estado:'activo' },
  { id:2, name:'Ennio Muños', email:'Emuñoz@guatemala.com', pass:'cliente123', rol:'cliente', estado:'activo' },
  { id:3, name:'Ana Patricia', email:'Apatricia@correo.com', pass:'pass123', rol:'cliente', estado:'activo' },
  { id:4, name:'Emanuel Catalan', email:'ecatalan@correo.com', pass:'pass123', rol:'cliente', estado:'activo' }
];

let nextUserId = 5;


// ============ LOGIN STATE ============
let currentUser  = null;
let currentDest  = null;
let activeFilter = 'Todos';


// ===================== AUTH =====================

async function doLogin(){
  const email=document.getElementById('login-email').value.trim();
  const pass=document.getElementById('login-pass').value.trim();

  try{
    const result = await apiLogin(email,pass);

    if(!result.success){
      document.getElementById('login-error').classList.remove('hidden');
      return;
    }

    document.getElementById('login-error').classList.add('hidden');

    currentUser = result.usuario; // ✅ FIX IMPORTANTE

    afterLogin();

  }catch(e){
    showNotif('Error de conexión con el servidor');
  }
}


async function doRegister(){
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value.trim();

  if(!name||!email||!pass){
    showNotif('Completa todos los campos');
    return;
  }

  try{
    const result = await apiRegister(name,email,pass);

    if(!result.success){
      showNotif(result.message||'No fue posible registrar');
      return;
    }

    showNotif('Usuario registrado correctamente');

  }catch(e){
    showNotif('Error de conexión con el servidor');
  }
}


// ===================== AFTER LOGIN =====================

function afterLogin(){
  document.getElementById('navbar').classList.remove('hidden');
  document.getElementById('nav-username').textContent = currentUser.nombre || currentUser.name;

  const badge = document.getElementById('nav-role-badge');
  badge.textContent = currentUser.rol === 'admin' ? 'Admin' : 'Cliente';
  badge.classList.remove('hidden');

  const adminBtn  = document.getElementById('nav-admin');
  const clientBtn = document.getElementById('nav-cliente');

  if(currentUser.rol==='admin'){
    adminBtn.classList.remove('hidden');
    clientBtn.classList.remove('hidden');
    showView('admin');
  } else {
    clientBtn.classList.remove('hidden');
    showView('home');
  }

  updateClienteView();
  showNotif('¡Bienvenido, ' + (currentUser.nombre || currentUser.name).split(' ')[0] + '!');
}


// ===================== LOGOUT =====================

function logout(){
  currentUser = null;

  document.getElementById('navbar').classList.add('hidden');

  ['nav-admin','nav-cliente'].forEach(id=>{
    document.getElementById(id).classList.add('hidden');
  });

  showView('login');
  switchLoginTab('login');
}


// ===================== VIEWS =====================

function showView(v){
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');

  document.querySelectorAll('.nav-links button').forEach(b=>b.classList.remove('active'));

  const nb = document.getElementById('nav-'+v);
  if(nb) nb.classList.add('active');

  window.scrollTo(0,0);

  if(v==='destinos') renderDestinos(activeFilter);
  if(v==='admin') renderAdmin();
}

function goHome(){
  if(currentUser) showView('home');
}


// ===================== LOGIN UI =====================

function switchLoginTab(tab){
  document.getElementById('login-form').classList.toggle('hidden', tab!=='login');
  document.getElementById('register-form').classList.toggle('hidden', tab!=='register');

  document.querySelectorAll('.tab-switch button').forEach((b,i)=>{
    b.classList.toggle('active', (i===0&&tab==='login')||(i===1&&tab==='register'));
  });
}


// ===================== DESTINOS =====================

function createCard(d, onclick){
  return `
  <div class="dest-card" onclick="${onclick}">
    <div class="dest-card-img">
      <img src="${d.imgCard}" alt="${d.nombre}">
    </div>
    <div class="dest-card-body">
      <div class="region">${d.region} · ${d.cat}</div>
      <h3>${d.nombre}</h3>
      <p>${d.descCorta}</p>
      <div class="dest-card-footer">
        <span class="rating">${d.rating}</span>
        <span class="price">${d.visitas}</span>
      </div>
    </div>
  </div>`;
}


// ===================== INIT =====================

renderHomeCards();
renderDestinos('Todos');
