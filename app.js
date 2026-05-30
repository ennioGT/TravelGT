const API_BASE = "https://api.travel.cadgt.com";

let currentUser = null;
let token = null;
let destinos = [];

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  showView("login");
  loadDestinos();
});

// ================= VIEW =================
function showView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + view).classList.add("active");
}

// ================= NOTIF =================
function showNotif(msg) {
  const n = document.getElementById("notif");
  n.textContent = msg;
  n.classList.add("show");

  setTimeout(() => n.classList.remove("show"), 2500);
}

// ================= LOGIN TAB =================
function switchLoginTab(tab) {
  const login = document.getElementById("login-form");
  const register = document.getElementById("register-form");
  const tabs = document.querySelectorAll(".tab-switch button");

  tabs.forEach(t => t.classList.remove("active"));

  if (tab === "login") {
    login.classList.remove("hidden");
    register.classList.add("hidden");
    tabs[0].classList.add("active");
  } else {
    login.classList.add("hidden");
    register.classList.remove("hidden");
    tabs[1].classList.add("active");
  }
}

// ================= REGISTER =================
async function doRegister() {
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: document.getElementById("reg-name").value,
        email: document.getElementById("reg-email").value,
        password: document.getElementById("reg-pass").value
      })
    });

    const data = await res.json();

    if (!data.success) {
      showNotif(data.message || "Error registro");
      return;
    }

    showNotif("Usuario creado");
    switchLoginTab("login");

  } catch (e) {
    console.error(e);
    showNotif("Error de conexión");
  }
}

// ================= LOGIN =================
async function doLogin() {
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-pass").value
      })
    });

    const data = await res.json();

    if (!data.success) {
      document.getElementById("login-error").classList.remove("hidden");
      return;
    }

    currentUser = data.user;
    token = data.token;

    document.getElementById("navbar").classList.remove("hidden");
    document.getElementById("nav-username").textContent = currentUser.nombre;

    showNotif("Bienvenido " + currentUser.nombre);
    showView("home");

  } catch (e) {
    console.error(e);
    showNotif("Error login");
  }
}

// ================= LOGOUT =================
function logout() {
  currentUser = null;
  token = null;
  document.getElementById("navbar").classList.add("hidden");
  showView("login");
}

// ================= DESTINOS =================
async function loadDestinos() {
  try {
    const res = await fetch(`${API_BASE}/api/destinos`);
    const data = await res.json();
    destinos = data.destinos || [];

    renderHomeCards();
  } catch (e) {
    console.error(e);
  }
}

// ================= RENDER HOME =================
function renderHomeCards() {
  const c = document.getElementById("home-cards");
  if (!c) return;

  c.innerHTML = "";

  destinos.slice(0, 6).forEach(d => {
    c.innerHTML += `
      <div class="dest-card">
        <div class="dest-card-img">
          ${d.imagen ? `<img src="${d.imagen}">` : "🏞️"}
        </div>
        <div class="dest-card-body">
          <div class="region">${d.departamento || ""}</div>
          <h3>${d.nombre}</h3>
          <p>${d.descripcion || ""}</p>
        </div>
      </div>
    `;
  });
}
