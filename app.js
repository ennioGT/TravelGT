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

// ================= STATE =================
let currentUser = null;
let currentDest = null;
let activeFilter = 'Todos';

// ================= NOTIFICACIONES =================
let notifTimer;

function showNotif(msg){
  const el = document.getElementById('notif');
  if(!el) return;

  el.textContent = msg;
  el.classList.add('show');

  clearTimeout(notifTimer);

  notifTimer = setTimeout(()=>{
    el.classList.remove('show');
  }, 3000);
}

// ================= HOME =================
function renderHomeCards(){
  document.getElementById('home-cards').innerHTML =
    DESTINOS.slice(0,3).map(d=>createCard(d,`openDetalle(${d.id})`)).join('');
}

// ================= LOGIN =================
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

    currentUser = result.usuario;

    afterLogin();

  }catch(e){
    showNotif('Error de conexión con el servidor');
  }
}

// ================= REGISTER =================
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
      showNotif(result.message||'Error al registrar');
      return;
    }

    showNotif('Usuario registrado correctamente');

  }catch(e){
    showNotif('Error de conexión con el servidor');
  }
}

// ================= AFTER LOGIN =================
function afterLogin(){
  document.getElementById('navbar').classList.remove('hidden');
  document.getElementById('nav-username').textContent = currentUser.nombre;

  const badge = document.getElementById('nav-role-badge');
  badge.textContent = currentUser.rol;

  showView('home');
  renderHomeCards();

  showNotif('Bienvenido ' + currentUser.nombre);
}

// ================= VIEWS =================
function showView(v){
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
}

// ================= INIT =================
renderHomeCards();
