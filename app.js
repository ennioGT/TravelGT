const API_BASE = "https://api.travel.cadgt.com";

// ================= NOTIFICACIÓN =================
function showNotif(msg){
  const el = document.getElementById("notif");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(()=>el.classList.remove("show"),3000);
}

// ================= TAB LOGIN =================
function switchLoginTab(tab){

  const login = document.getElementById("login-form");
  const register = document.getElementById("register-form");

  const tabs = document.querySelectorAll(".tab-switch button");

  if(tab === "login"){
    login.classList.remove("hidden");
    register.classList.add("hidden");
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  }

  if(tab === "register"){
    login.classList.add("hidden");
    register.classList.remove("hidden");
    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
  }
}

// ================= LOGIN =================
async function doLogin(){

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-pass").value.trim();

  const r = await fetch(`${API_BASE}/api/login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({email,password})
  });

  const data = await r.json();

  if(!data.success){
    document.getElementById("login-error").classList.remove("hidden");
    return;
  }

  currentUser = data.usuario;

  afterLogin();
}

// ================= REGISTER =================
async function doRegister(){

  const nombre = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-pass").value.trim();

  const r = await fetch(`${API_BASE}/api/register`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({nombre,email,password})
  });

  const data = await r.json();

  if(!data.success){
    showNotif(data.message);
    return;
  }

  showNotif("Usuario registrado correctamente");
  switchLoginTab("login");
}

// ================= STATE =================
let currentUser = null;

// ================= AFTER LOGIN =================
function afterLogin(){
  document.getElementById("navbar").classList.remove("hidden");
  document.getElementById("nav-username").textContent = currentUser.nombre;

  showView("home");
}

// ================= VIEWS =================
function showView(v){

  document.querySelectorAll(".view").forEach(e=>e.classList.remove("active"));
  document.getElementById("view-"+v).classList.add("active");
}

function goHome(){
  if(currentUser) showView("home");
}

function logout(){
  currentUser = null;
  document.getElementById("navbar").classList.add("hidden");
  showView("login");
}
