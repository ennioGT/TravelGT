const API_BASE = "https://api.travel.cadgt.com";

let currentUser = null;
let token = null;
let destinos = [];

let activeFilter = "Todos";
let currentDest = null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  showView("login");
  loadDestinos();
});

// ================= VIEW =================
function showView(view) {

  document
    .querySelectorAll(".view")
    .forEach(v => v.classList.remove("active"));

  const target =
    document.getElementById("view-" + view);

  if (target) {
    target.classList.add("active");
  }

  if (view === "destinos") {
    renderDestinos(activeFilter);
  }

  window.scrollTo(0, 0);
}

// ================= NOTIF =================
function showNotif(msg) {

  const n =
    document.getElementById("notif");

  if (!n) return;

  n.textContent = msg;
  n.classList.add("show");

  setTimeout(
    () => n.classList.remove("show"),
    2500
  );
}

// ================= LOGIN TAB =================
function switchLoginTab(tab) {

  const login =
    document.getElementById("login-form");

  const register =
    document.getElementById("register-form");

  const tabs =
    document.querySelectorAll(
      ".tab-switch button"
    );

  tabs.forEach(t =>
    t.classList.remove("active")
  );

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

    const res =
      await fetch(
        `${API_BASE}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            nombre:
              document.getElementById(
                "reg-name"
              ).value,
            email:
              document.getElementById(
                "reg-email"
              ).value,
            password:
              document.getElementById(
                "reg-pass"
              ).value
          })
        }
      );

    const data =
      await res.json();

    if (!data.success) {

      showNotif(
        data.message ||
        "Error registro"
      );

      return;
    }

    showNotif("Usuario creado");

    switchLoginTab("login");

  } catch (e) {

    console.error(e);

    showNotif(
      "Error de conexión"
    );
  }
}

// ================= LOGIN =================
async function doLogin() {

  try {

    const res =
      await fetch(
        `${API_BASE}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email:
              document.getElementById(
                "login-email"
              ).value,
            password:
              document.getElementById(
                "login-pass"
              ).value
          })
        }
      );

    const data =
      await res.json();

    if (!data.success) {

      document
        .getElementById(
          "login-error"
        )
        .classList.remove(
          "hidden"
        );

      return;
    }

    currentUser =
      data.user;

    token =
      data.token;

    document
      .getElementById(
        "navbar"
      )
      .classList.remove(
        "hidden"
      );

    document.getElementById(
  "nav-username"
).textContent =
  currentUser.nombre;

const badge =
  document.getElementById(
    "nav-role-badge"
  );

badge.classList.remove(
  "hidden"
);

badge.textContent =
  currentUser.rol;

if (
  currentUser.rol ===
  "admin"
) {

  document
    .getElementById(
      "nav-admin"
    )
    .classList.remove(
      "hidden"
    );

  document
    .getElementById(
      "nav-cliente"
    )
    .classList.add(
      "hidden"
    );

} else {

  document
    .getElementById(
      "nav-cliente"
    )
    .classList.remove(
      "hidden"
    );

  document
    .getElementById(
      "nav-admin"
    )
    .classList.add(
      "hidden"
    );
}

showNotif(
  "Bienvenido " +
  currentUser.nombre
);
console.log(data);
console.log(data.user);
showView("home");

// ================= LOGOUT =================
function logout() {

  currentUser = null;
  token = null;

  document
    .getElementById(
      "navbar"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "nav-admin"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "nav-cliente"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "nav-role-badge"
    )
    .classList.add(
      "hidden"
    );

  showView("login");
}

// ================= LOAD DESTINOS =================
async function loadDestinos() {

  try {

    const res =
      await fetch(
        `${API_BASE}/api/destinos`
      );

    const data =
      await res.json();

    destinos =
      data.destinos || [];

    renderHomeCards();
    renderDestinos();

  } catch (e) {

    console.error(e);
  }
}

// ================= HOME =================
function renderHomeCards() {

  const c =
    document.getElementById(
      "home-cards"
    );

  if (!c) return;

  c.innerHTML = "";

  destinos
    .slice(0, 6)
    .forEach(d => {

      c.innerHTML += `
        <div class="dest-card"
             onclick="openDetalle(${d.id})">

          <div class="dest-card-img">

            ${
              d.imagen
                ? `<img src="${d.imagen}" alt="${d.nombre}">`
                : "🏞️"
            }

          </div>

          <div class="dest-card-body">

            <div class="region">
              ${d.departamento}
            </div>

            <h3>
              ${d.nombre}
            </h3>

            <p>
              ${d.descripcion || ""}
            </p>

          </div>

        </div>
      `;
    });
}

// ================= DESTINOS =================
function renderDestinos(
  filter = "Todos"
) {

  activeFilter = filter;

  const cards =
    document.getElementById(
      "destinos-cards"
    );

  if (!cards) return;

  const lista =
    filter === "Todos"
      ? destinos
      : destinos.filter(
          d =>
            d.categoria ===
            filter
        );

  cards.innerHTML =
    lista.map(d => `
      <div class="dest-card"
           onclick="openDetalle(${d.id})">

        <div class="dest-card-img">

          ${
            d.imagen
              ? `<img src="${d.imagen}" alt="${d.nombre}">`
              : "🏞️"
          }

        </div>

        <div class="dest-card-body">

          <div class="region">
            ${d.departamento}
          </div>

          <h3>
            ${d.nombre}
          </h3>

          <p>
            ${d.descripcion || ""}
          </p>

        </div>

      </div>
    `).join("");
}

// ================= DETALLE =================
function openDetalle(id) {

    const d = destinos.find(
        x => Number(x.id) === Number(id)
    );

    if (!d) {
        showNotif("Destino no encontrado");
        return;
    }

    currentDest = d;

    // HERO

    document.getElementById("detalle-region").textContent =
        `${d.departamento || ""} · ${d.categoria || ""}`;

    document.getElementById("detalle-titulo").textContent =
        d.nombre || "";

    const hero =
        document.getElementById("detalle-hero");

    if (hero) {

        if (d.imagen) {
            hero.style.backgroundImage =
                `url('${d.imagen}')`;
        } else {
            hero.style.backgroundImage = "none";
        }
    }

    // DESCRIPCIONES

    const desc =
        document.getElementById("detalle-desc");

    if (desc) {
        desc.textContent =
            d.descripcion_larga ||
            d.descripcion ||
            "";
    }

    const extra =
        document.getElementById("detalle-extra");

    if (extra) {
        extra.textContent =
            d.extra ||
            "";
    }

    // INFORMACIÓN LATERAL

    const region =
        document.getElementById("info-region");

    if (region) {
        region.textContent =
            d.departamento || "";
    }

    const clima =
        document.getElementById("info-clima");

    if (clima) {
        clima.textContent =
            d.clima ||
            "No disponible";
    }

    const epoca =
        document.getElementById("info-epoca");

    if (epoca) {
        epoca.textContent =
            d.epoca ||
            "No disponible";
    }

    const dificultad =
        document.getElementById("info-dificultad");

    if (dificultad) {
        dificultad.textContent =
            d.dificultad ||
            "No disponible";
    }

    const entrada =
        document.getElementById("info-entrada");

    if (entrada) {
        entrada.textContent =
            d.entrada ||
            "No disponible";
    }

    // HIGHLIGHTS

    const highlights =
        document.getElementById(
            "detalle-highlights"
        );

    if (highlights) {

        highlights.innerHTML = "";

        if (d.highlights) {

            d.highlights
                .split(",")
                .forEach(item => {

                    highlights.innerHTML += `
                        <span class="highlight-tag">
                            ${item.trim()}
                        </span>
                    `;
                });
        }
    }

    showView("detalle");
}
