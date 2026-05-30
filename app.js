// ===================== CONFIG =====================
const API_BASE = "https://api.travel.cadgt.com";

// ===================== STATE =====================
let currentUser = null;
let destinos = [];

// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
  switchView("view-login");
  loadDestinos();
  renderHomeCards();
});

// ===================== NAV / VIEWS =====================
function showView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + view).classList.add("active");
}

function goHome() {
  showView("home");
}

// ===================== NOTIFICACIONES =====================
function showNotif(msg) {
  const n = document.getElementById("notif");
  n.textContent = msg;
  n.classList.add("show");

  setTimeout(() => {
    n.classList.remove("show");
  }, 2500);
}

// ===================== LOGIN TABS =====================
function switchLoginTab(tab) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabs = document.querySelectorAll(".tab-switch button");

  tabs.forEach(t => t.classList.remove("active"));

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    tabs[0].classList.add("active");
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    tabs[1].classList.add("active");
  }
}

// ===================== REGISTER =====================
async function doRegister() {
  try {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-pass").value;

    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass })
    });

    const data = await res.json();

    if (!data.success) {
      showNotif(data.message || "Error al registrar");
      return;
    }

    showNotif("Cuenta creada correctamente");
    switchLoginTab("login");

  } catch (err) {
    console.error(err);
    showNotif("Error de conexión con el servidor");
  }
}

// ===================== LOGIN =====================
async function doLogin() {
  try {
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;

    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();

    if (!data.success) {
      document.getElementById("login-error").classList.remove("hidden");
      return;
    }

    currentUser = data.user;

    document.getElementById("navbar").classList.remove("hidden");
    document.getElementById("nav-username").textContent = currentUser.name;

    showNotif("Bienvenido " + currentUser.name);
    showView("home");

  } catch (err) {
    console.error(err);
    showNotif("Error de conexión");
  }
}

// ===================== LOGOUT =====================
function logout() {
  currentUser = null;
  document.getElementById("navbar").classList.add("hidden");
  showView("login");
}

// ===================== DESTINOS =====================
async function loadDestinos() {
  try {
    const res = await fetch(`${API_BASE}/api/destinos`);
    const data = await res.json();
    destinos = data.destinos || [];
    renderHomeCards();
  } catch (e) {
    console.error("Error destinos", e);
  }
}

// ===================== RENDER HOME =====================
function renderHomeCards() {
  const container = document.getElementById("home-cards");
  if (!container) return;

  container.innerHTML = "";

  destinos.slice(0, 6).forEach(d => {
    container.innerHTML += `
      <div class="dest-card" onclick="showNotif('Destino: ${d.nombre}')">
        <div class="dest-card-img">${d.emoji || "🏞️"}</div>
        <div class="dest-card-body">
          <div class="region">${d.region}</div>
          <h3>${d.nombre}</h3>
          <p>${d.descripcion}</p>
        </div>
      </div>
    `;
  });
}

// ===================== ADMIN STUB =====================
function adminPanel(panel) {
  document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
  document.getElementById("panel-" + panel).classList.add("active");
}
