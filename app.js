const API_BASE = "https://api.travel.cadgt.com";

let currentUser = null;
let token = null;
let destinos = [];
let activeFilter = "Todos";
let currentDest = null;
document.addEventListener("DOMContentLoaded", () => {
  showView("login");
  loadDestinos();
});
function showView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById("view-" + view);
  if (target) target.classList.add("active");

  if (view === "destinos") renderDestinos(activeFilter);
  if (view === "admin")    adminPanel("dashboard");
  if (view === "cliente")  loadClienteView();

  window.scrollTo(0, 0);
}

function goHome() { showView("home"); }
function showNotif(msg) {
  const n = document.getElementById("notif");
  if (!n) return;
  n.textContent = msg;
  n.classList.add("show");
  setTimeout(() => n.classList.remove("show"), 2500);
}
function switchLoginTab(tab) {
  const login    = document.getElementById("login-form");
  const register = document.getElementById("register-form");
  const tabs     = document.querySelectorAll(".tab-switch button");
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
async function doRegister() {
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre:   document.getElementById("reg-name").value,
        email:    document.getElementById("reg-email").value,
        password: document.getElementById("reg-pass").value
      })
    });
    const data = await res.json();
    if (!data.success) { showNotif(data.message || "Error en registro"); return; }
    showNotif("¡Usuario creado! Ya puedes iniciar sesión.");
    switchLoginTab("login");
  } catch (e) {
    console.error(e);
    showNotif("Error de conexión");
  }
}
async function doLogin() {
  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:    document.getElementById("login-email").value,
        password: document.getElementById("login-pass").value
      })
    });
    const data = await res.json();

    if (!data.success) {
      document.getElementById("login-error").classList.remove("hidden");
      return;
    }

    currentUser = data.user;
    token       = data.token;

    // Navbar
    document.getElementById("navbar").classList.remove("hidden");
    document.getElementById("nav-username").textContent = currentUser.nombre;

    const badge = document.getElementById("nav-role-badge");
    badge.classList.remove("hidden");
    badge.textContent = currentUser.rol.toUpperCase();

    if (currentUser.rol === "admin") {
      document.getElementById("nav-admin").classList.remove("hidden");
      document.getElementById("nav-cliente").classList.add("hidden");
    } else {
      document.getElementById("nav-cliente").classList.remove("hidden");
      document.getElementById("nav-admin").classList.add("hidden");
    }

    showNotif("¡Bienvenido, " + currentUser.nombre + "!");
    showView("home");

  } catch (e) {
    console.error(e);
    showNotif("Error al iniciar sesión");
  }
}
function logout() {
  currentUser = null;
  token = null;
  ["navbar","nav-admin","nav-cliente","nav-role-badge"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  showView("login");
}
async function loadDestinos() {
  try {
    const res  = await fetch(`${API_BASE}/api/destinos`);
    const data = await res.json();
    destinos   = data.destinos || [];
    renderHomeCards();
    renderDestinos();
  } catch (e) {
    console.error("Error cargando destinos:", e);
  }
}
function renderHomeCards() {
  const c = document.getElementById("home-cards");
  if (!c) return;
  c.innerHTML = "";
  destinos.slice(0, 6).forEach(d => {
    c.innerHTML += `
      <div class="dest-card" onclick="openDetalle(${d.id})">
        <div class="dest-card-img">
          ${d.imagen ? `<img src="${d.imagen}" alt="${d.nombre}">` : "🏞️"}
        </div>
        <div class="dest-card-body">
          <div class="region">${d.departamento || ""}</div>
          <h3>${d.nombre}</h3>
          <p>${d.descripcion || ""}</p>
        </div>
      </div>`;
  });
}
function renderDestinos(filter = "Todos") {
  activeFilter = filter;
  const cards = document.getElementById("destinos-cards");
  if (!cards) return;

  // Botones de filtro
  const filterBar = document.getElementById("filter-bar");
  if (filterBar && filterBar.children.length === 0) {
    const categorias = ["Todos", ...new Set(destinos.map(d => d.categoria).filter(Boolean))];
    filterBar.innerHTML = categorias.map(cat => `
      <button class="filter-btn ${cat === activeFilter ? 'active' : ''}"
              onclick="renderDestinos('${cat}')">${cat}</button>
    `).join("");
  } else if (filterBar) {
    filterBar.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.toggle("active", b.textContent === filter);
    });
  }

  const lista = filter === "Todos" ? destinos : destinos.filter(d => d.categoria === filter);
  cards.innerHTML = lista.map(d => `
    <div class="dest-card" onclick="openDetalle(${d.id})">
      <div class="dest-card-img">
        ${d.imagen ? `<img src="${d.imagen}" alt="${d.nombre}">` : "🏞️"}
      </div>
      <div class="dest-card-body">
        <div class="region">${d.departamento || ""}</div>
        <h3>${d.nombre}</h3>
        <p>${d.descripcion || ""}</p>
      </div>
    </div>`).join("");
}
function openDetalle(id) {
  const d = destinos.find(x => Number(x.id) === Number(id));
  if (!d) { showNotif("Destino no encontrado"); return; }
  currentDest = d;

  document.getElementById("detalle-region").textContent  = `${d.departamento || ""} · ${d.categoria || ""}`;
  document.getElementById("detalle-titulo").textContent  = d.nombre || "";

  const hero = document.getElementById("detalle-hero");
  if (hero) hero.style.backgroundImage = d.imagen ? `url('${d.imagen}')` : "none";

  const desc = document.getElementById("detalle-desc");
  if (desc) desc.textContent = d.descripcion_larga || d.descripcion || "";

  const extra = document.getElementById("detalle-extra");
  if (extra) extra.textContent = d.extra || "";

  ["region","clima","epoca","entrada"].forEach(campo => {
    const el = document.getElementById("info-" + campo);
    if (el) el.textContent = d[campo === "region" ? "departamento" : campo] || "No disponible";
  });

  const dif = document.getElementById("info-dif");
  if (dif) dif.textContent = d.dificultad || "No disponible";

  const highlights = document.getElementById("detalle-highlights");
  if (highlights) {
    highlights.innerHTML = "";
    if (d.highlights) {
      d.highlights.split(",").forEach(item => {
        highlights.innerHTML += `<span class="highlight-tag">${item.trim()}</span>`;
      });
    }
  }

  const btnFav = document.getElementById("btn-favorito");
  if (btnFav) {
    const favs = getFavoritos();
    const yaEsFav = favs.some(f => Number(f.id) === Number(d.id));
    btnFav.textContent = yaEsFav ? "♥ En favoritos" : "♥ Guardar favorito";
    btnFav.onclick = () => toggleFavorito(d.id);
  }

  showView("detalle");
}

function getFavoritos() {
  if (!currentUser) return [];
  const key = "favs_" + currentUser.id;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveFavoritos(favs) {
  if (!currentUser) return;
  const key = "favs_" + currentUser.id;
  localStorage.setItem(key, JSON.stringify(favs));
}

function toggleFavorito(id) {
  if (!currentUser) { showNotif("Debes iniciar sesión"); return; }
  const d = destinos.find(x => Number(x.id) === Number(id));
  if (!d) return;

  let favs = getFavoritos();
  const idx = favs.findIndex(f => Number(f.id) === Number(id));

  if (idx >= 0) {
    favs.splice(idx, 1);
    showNotif("Destino eliminado de favoritos");
  } else {
    favs.push({ id: d.id, nombre: d.nombre, departamento: d.departamento, imagen: d.imagen, descripcion: d.descripcion });
    showNotif("¡" + d.nombre + " guardado en favoritos!");
  }

  saveFavoritos(favs);

  // Actualizar botón si estamos en detalle
  const btnFav = document.getElementById("btn-favorito");
  if (btnFav) {
    const yaEsFav = favs.some(f => Number(f.id) === Number(id));
    btnFav.textContent = yaEsFav ? "♥ En favoritos" : "♥ Guardar favorito";
  }
}
function loadClienteView() {
  if (!currentUser) return;

  // Nombre y email en header
  const elNombre = document.getElementById("cliente-nombre");
  const elEmail  = document.getElementById("cliente-email");
  if (elNombre) elNombre.textContent = currentUser.nombre || "Viajero";
  if (elEmail)  elEmail.textContent  = currentUser.email  || "";

  // Perfil
  const profileName   = document.getElementById("profile-name");
  const profileEmail  = document.getElementById("profile-email");
  const profileAvatar = document.getElementById("profile-avatar");
  const editName      = document.getElementById("edit-name");

  if (profileName)   profileName.textContent  = currentUser.nombre || "";
  if (profileEmail)  profileEmail.textContent = currentUser.email  || "";
  if (profileAvatar) profileAvatar.textContent = (currentUser.nombre || "U").charAt(0).toUpperCase();
  if (editName)      editName.value            = currentUser.nombre || "";

  renderFavGrid();

  const recCards = document.getElementById("rec-cards");
  if (recCards) {
    const sample = [...destinos].sort(() => Math.random() - 0.5).slice(0, 3);
    recCards.innerHTML = sample.map(d => `
      <div class="dest-card" onclick="openDetalle(${d.id})">
        <div class="dest-card-img">
          ${d.imagen ? `<img src="${d.imagen}" alt="${d.nombre}">` : "🏞️"}
        </div>
        <div class="dest-card-body">
          <div class="region">${d.departamento || ""}</div>
          <h3>${d.nombre}</h3>
          <p>${d.descripcion || ""}</p>
        </div>
      </div>`).join("");
  }
}

function renderFavGrid() {
  const grid = document.getElementById("fav-grid");
  if (!grid) return;
  const favs = getFavoritos();

  if (favs.length === 0) {
    grid.innerHTML = `<p style="color:#888;font-size:.95rem;">Aún no tienes destinos favoritos. Explora y guarda los que más te gusten.</p>`;
    return;
  }

  grid.innerHTML = favs.map(d => `
    <div class="dest-card" style="position:relative;">
      <div class="dest-card-img">
        ${d.imagen ? `<img src="${d.imagen}" alt="${d.nombre}">` : "🏞️"}
      </div>
      <div class="dest-card-body">
        <div class="region">${d.departamento || ""}</div>
        <h3>${d.nombre}</h3>
        <p>${d.descripcion || ""}</p>
        <button class="btn btn-outline" style="margin-top:8px;font-size:.8rem;padding:4px 10px;"
                onclick="toggleFavorito(${d.id}); renderFavGrid();">✕ Quitar</button>
      </div>
    </div>`).join("");
}

function adminPanel(panel) {
  document.querySelectorAll(".admin-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".sidebar-menu button").forEach(b => b.classList.remove("active"));

  const panelEl = document.getElementById("panel-" + panel);
  if (panelEl) panelEl.classList.add("active");

  const menuBtn = document.getElementById("sb-" + panel);
  if (menuBtn) menuBtn.classList.add("active");

  if (panel === "usuarios")       loadAdminUsuarios();
  if (panel === "destinos-admin") loadAdminDestinos();
}

async function loadAdminUsuarios() {
  const tbody = document.getElementById("admin-users-table");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;">Cargando...</td></tr>`;

  try {
    const res  = await fetch(`${API_BASE}/api/admin/users`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    const users = data.users || data.usuarios || [];

    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;">No hay usuarios registrados.</td></tr>`;
      return;
    }

    tbody.innerHTML = users.map((u, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${u.nombre || u.name || "—"}</td>
        <td>${u.email || "—"}</td>
        <td><span class="badge ${u.rol === 'admin' ? 'badge-blue' : 'badge-green'}">${u.rol || "cliente"}</span></td>
        <td><span class="badge badge-green">Activo</span></td>
        <td>
          <button class="btn btn-outline" style="font-size:.75rem;padding:3px 10px;"
                  onclick="deleteUser(${u.id})">Eliminar</button>
        </td>
      </tr>`).join("");

  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#c00;">Error al cargar usuarios.</td></tr>`;
  }
}

async function loadAdminDestinos() {
  const tbody = document.getElementById("admin-dest-table");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;">Cargando...</td></tr>`;

  try {
    if (destinos.length === 0) await loadDestinos();

    if (destinos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#888;">No hay destinos registrados.</td></tr>`;
      return;
    }

    tbody.innerHTML = destinos.map(d => `
      <tr>
        <td><strong>${d.nombre}</strong></td>
        <td>${d.departamento || "—"}</td>
        <td>${d.categoria || "—"}</td>
        <td><span class="badge badge-green">Publicado</span></td>
        <td>
          <button class="btn btn-outline" style="font-size:.75rem;padding:3px 10px;"
                  onclick="openDetalle(${d.id})">Ver</button>
          <button class="btn btn-outline" style="font-size:.75rem;padding:3px 10px;margin-left:4px;color:#c00;border-color:#c00;"
                  onclick="deleteDestino(${d.id})">Eliminar</button>
        </td>
      </tr>`).join("");

  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#c00;">Error al cargar destinos.</td></tr>`;
  }
}

async function addUser() {
  const nombre   = document.getElementById("m-name").value.trim();
  const email    = document.getElementById("m-email").value.trim();
  const password = document.getElementById("m-pass").value;
  const rol      = document.getElementById("m-rol").value;

  if (!nombre || !email || !password) { showNotif("Completa todos los campos"); return; }

  try {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ nombre, email, password, rol })
    });
    const data = await res.json();
    if (!data.success) { showNotif(data.message || "Error al crear usuario"); return; }

    showNotif("Usuario creado correctamente");
    closeModal("addUser");
    loadAdminUsuarios();

  } catch (e) {
    console.error(e);
    showNotif("Error de conexión");
  }
}

async function deleteUser(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    if (data.success) {
      showNotif("Usuario eliminado");
      loadAdminUsuarios();
    } else {
      showNotif(data.message || "Error al eliminar");
    }
  } catch (e) {
    console.error(e);
    showNotif("Error de conexión");
  }
}

async function saveDestino() {
  const nombre     = document.getElementById("nd-nombre").value.trim();
  const region     = document.getElementById("nd-region").value.trim();
  const categoria  = document.getElementById("nd-cat").value;
  const emoji      = document.getElementById("nd-emoji").value.trim();
  const descShort  = document.getElementById("nd-desc-short").value.trim();
  const descFull   = document.getElementById("nd-desc-full").value.trim();
  const clima      = document.getElementById("nd-clima").value.trim();
  const epoca      = document.getElementById("nd-epoca").value.trim();
  const dificultad = document.getElementById("nd-dif").value;
  const entrada    = document.getElementById("nd-precio").value.trim();

  if (!nombre || !region) { showNotif("El nombre y la región son obligatorios"); return; }

  try {
    const res = await fetch(`${API_BASE}/api/admin/destinos`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        nombre, departamento: region, categoria, emoji,
        descripcion: descShort, descripcion_larga: descFull,
        clima, epoca, dificultad, entrada
      })
    });
    const data = await res.json();
    if (!data.success) { showNotif(data.message || "Error al guardar"); return; }

    showNotif("¡Destino publicado correctamente!");
    await loadDestinos();
    adminPanel("destinos-admin");

  } catch (e) {
    console.error(e);
    showNotif("Error de conexión");
  }
}

async function deleteDestino(id) {
  if (!confirm("¿Seguro que deseas eliminar este destino?")) return;
  try {
    const res = await fetch(`${API_BASE}/api/admin/destinos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await res.json();
    if (data.success) {
      showNotif("Destino eliminado");
      await loadDestinos();
      loadAdminDestinos();
    } else {
      showNotif(data.message || "Error al eliminar");
    }
  } catch (e) {
    console.error(e);
    showNotif("Error de conexión");
  }
}

function showModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (modal) modal.style.display = "flex";
}

function closeModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (modal) modal.style.display = "none";
}
