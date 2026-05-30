const API_BASE = "https://api.travel.cadgt.com";

// ================= API =================
async function apiLogin(email, password){
  const r = await fetch(`${API_BASE}/api/login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({email,password})
  });
  return await r.json();
}

async function apiRegister(nombre,email,password){
  const r = await fetch(`${API_BASE}/api/register`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({nombre,email,password})
  });
  return await r.json();
}

// ================= STATE =================
let currentUser = null;

// ================= LOGIN =================
async function doLogin(){
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-pass").value.trim();

  const res = await apiLogin(email,password);

  if(!res.success){
    alert(res.message);
    return;
  }

  currentUser = res.usuario;

  afterLogin();
}

// ================= REGISTER =================
async function doRegister(){
  const nombre = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-pass").value.trim();

  const res = await apiRegister(nombre,email,password);

  if(!res.success){
    alert(res.message);
    return;
  }

  alert("Usuario registrado correctamente");
}

// ================= AFTER LOGIN =================
function afterLogin(){
  document.getElementById("navbar").classList.remove("hidden");
  document.getElementById("nav-username").textContent = currentUser.nombre;

  showView("home");
}

// ================= VIEW =================
function showView(v){
  document.querySelectorAll(".view").forEach(el=>el.classList.remove("active"));
  document.getElementById("view-"+v).classList.add("active");
}
