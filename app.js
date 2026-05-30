
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

async function apiRegister(name,email,password){
  const r = await fetch(`${API_BASE}/api/register`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name,email,password})
  });
  return await r.json();
}


// ============ DATA ============
let usuarios = [
  { id:1, name:'Administrador', email:'admin@guatemala.com',   pass:'admin123',   rol:'admin',   estado:'activo' },
  { id:2, name:'Ennio Muños',  email:'Emuñoz@guatemala.com', pass:'cliente123', rol:'cliente', estado:'activo' },
  { id:3, name:'Ana Patricia',  email:'Apatricia@correo.com',      pass:'pass123',    rol:'cliente', estado:'activo' },
  { id:3, name:'Emanuel Catalan',  email:'ecatalan@correo.com',      pass:'pass123',    rol:'cliente', estado:'activo' },
];
let nextUserId = 4;

const DESTINOS = [
  {
    id:1, nombre:'Tikal', region:'Petén', cat:'Arqueológico', imgCard:'Imagenes/Peten.jpg', imgDetalle:'Imagenes/PetenPortada.jpg',
    descCorta:'Ciudad maya perdida en la selva, Patrimonio de la Humanidad UNESCO.',
    descFull:'Tikal fue una de las ciudades mayas más poderosas de la era clásica. Sus templos se elevan por encima del dosel de la selva tropical, creando un panorama místico que te transporta miles de años atrás.',
    extra:'El Templo I (Templo del Gran Jaguar) y el Templo IV son los más impresionantes. La fauna local incluye monos, tucanes y jaguares. Se recomienda amanecer en el complejo para escuchar la selva despertar.',
    highlights:['Patrimonio UNESCO','Selva tropical','Amanecer mágico','Fauna silvestre'],
    clima:'Cálido húmedo', epoca:'Nov – Mayo', dif:'Moderada', entrada:'Q150 extranjeros',
    bg:'linear-gradient(135deg,#2d5a1b,#1a3d0a)', rating:'★★★★★', visitas:'125,000/año'
  },
  {
    id:2, nombre:'Lago Atitlán', region:'Sololá', cat:'Natural', imgCard:'Imagenes/Atitlan.jpg', imgDetalle:'Imagenes/AtitlanPortada.gif',
    descCorta:'El lago más hermoso del mundo, rodeado de tres volcanes y pueblos indígenas.',
    descFull:'El Lago Atitlán, ubicado a 1562 metros sobre el nivel del mar, es uno de los destinos más fotogénicos de Guatemala. Aldous Huxley lo llamó "el lago más hermoso del mundo".',
    extra:'Los pueblos de San Pedro la Laguna, Santiago Atitlán y Panajachel ofrecen artesanías únicas, textiles coloridos y gastronomía local. Las actividades incluyen kayak, senderismo al volcán San Pedro y visitas a los mercados mayas.',
    highlights:['3 volcanes','Pueblos mayas','Artesanías','Kayak y deportes'],
    clima:'Templado fresco', epoca:'Todo el año', dif:'Fácil', entrada:'Libre (lanchas Q25)',
    bg:'linear-gradient(135deg,#1a5276,#0e3d6b)', rating:'★★★★★', visitas:'180,000/año'
  },
  {
    id:3, nombre:'Antigua Guatemala', region:'Sacatepéquez', cat:'Colonial', imgCard:'Imagenes/Antigua.jpg', imgDetalle:'Imagenes/AntiguaPortada.jpg',
    descCorta:'Ciudad colonial Patrimonio UNESCO con iglesias barrocas y calles adoquinadas.',
    descFull:'La Antigua Guatemala, fundada en 1543, es una de las ciudades coloniales mejor conservadas de América Latina. Sus ruinas de conventos e iglesias barrocas cuentan historias de conquista, fe y terremotos.',
    extra:'La Semana Santa en Antigua es un espectáculo mundial. Las alfombras de aserrín teñido y los desfiles religiosos atraen visitantes de todo el planeta. El Mercado de Artesanías y el Parque Central son paradas obligatorias.',
    highlights:['Patrimonio UNESCO','Semana Santa','Arquitectura barroca','Gastronomía'],
    clima:'Templado agradable', epoca:'Todo el año', dif:'Fácil', entrada:'Libre',
    bg:'linear-gradient(135deg,#7d3c98,#4a235a)', rating:'★★★★★', visitas:'250,000/año'
  },
  {
    id:4, nombre:'Volcán Pacaya', region:'Escuintla', cat:'Aventura', imgCard:'Imagenes/Pacaya.jpg', imgDetalle:'Imagenes/PacayaPortada.jpg',
    descCorta:'Volcán activo accesible donde puedes tocar lava y vivir una experiencia única.',
    descFull:'El Volcán Pacaya es uno de los volcanes más activos de Centroamérica. A tan solo 50 km de Ciudad de Guatemala, ofrece una experiencia volcánica única: caminar sobre flujos de lava solidificada y observar fumarolas activas.',
    extra:'El ascenso dura entre 2 y 3 horas y se pueden contratar guías locales. Llevar ropa abrigada ya que en la cima las temperaturas bajan considerablemente. Los amaneceres y atardeceres desde la cima son espectaculares.',
    highlights:['Lava activa','Caminata 3h','Vista 360°','Guías locales'],
    clima:'Variable (frío en cima)', epoca:'Nov – Abril', dif:'Moderada', entrada:'Q50',
    bg:'linear-gradient(135deg,#922b21,#641e16)', rating:'★★★★☆', visitas:'80,000/año'
  },
  {
    id:5, nombre:'Chichicastenango', region:'Quiché', cat:'Cultural', imgCard:'Imagenes/Chichicastenango.jpg', imgDetalle:'Imagenes/IglesiaCatolica.jpg',
    descCorta:'El mercado indígena más colorido y auténtico de Guatemala.',
    descFull:'El mercado de Chichicastenango, conocido como "Chichi", es el mercado indígena más grande y colorido de Centroamérica. Cada jueves y domingo, miles de vendedores k\'iche\' llenan las calles con textiles, máscaras, artesanías y productos locales.',
    extra:'La Iglesia de Santo Tomás es única: los sacerdotes mayas realizan ceremonias en sus escalinatas, quemando incienso junto a las ceremonias católicas. El Popol Vuh, libro sagrado maya, fue descubierto aquí.',
    highlights:['Mercado jueves y domingo','Textiles mayas','Ceremonia K\'iche\'','Artesanías únicas'],
    clima:'Fresco de montaña', epoca:'Todo el año', dif:'Fácil', entrada:'Libre',
    bg:'linear-gradient(135deg,#b7770d,#7d5a0c)', rating:'★★★★★', visitas:'95,000/año'
  },
  {
    id:6, nombre:'Semuc Champey', region:'Alta Verapaz', cat:'Natural', imgCard:'Imagenes/Semuc.jpg', imgDetalle:'Imagenes/SemucPortada.jpg',
    descCorta:'Piscinas naturales de agua turquesa en medio de la selva tropical.',
    descFull:'Semuc Champey es uno de los secretos mejor guardados de Guatemala. Sobre el Río Cahabón, una plataforma natural de piedra calcárea de 300 metros forma una serie de piscinas escalonadas de aguas cristalinas en tonos turquesa y verde esmeralda.',
    extra:'Se accede desde el pueblo de Lanquín por caminos de tierra. Las actividades incluyen tubing en el río, exploración de cuevas con velas y senderismo al mirador. La biodiversidad del área es impresionante con cientos de especies de aves.',
    highlights:['Piscinas turquesa','Tubing','Cuevas','Selva virgen'],
    clima:'Cálido húmedo', epoca:'Marzo – Junio', dif:'Difícil (acceso)', entrada:'Q50',
    bg:'linear-gradient(135deg,#148f77,#0e6655)', rating:'★★★★★', visitas:'60,000/año'
  },
  {
    id:7,
    nombre:'Laguna Magdalena',
    region:'Huehuetenango',
    cat:'Natural',
    imgCard:'Imagenes/HuehuetenangoPortada.png',
    imgDetalle:'Imagenes/LagunaMagdalena.jpeg',
    descCorta:'Hermosa laguna rodeada de montañas y naturaleza en el altiplano guatemalteco.',
    descFull:'La Laguna Magdalena es uno de los destinos naturales más impresionantes de Huehuetenango. Sus aguas tranquilas reflejan el paisaje montañoso y crean un ambiente relajante ideal para quienes buscan contacto con la naturaleza y tranquilidad lejos de la ciudad.',
    extra:'La laguna es conocida por su clima fresco y sus paisajes rodeados de bosques y montañas. Los visitantes pueden disfrutar caminatas, fotografía y recorridos en los alrededores mientras observan aves y la belleza natural de la región. Los amaneceres y atardeceres ofrecen vistas espectaculares.',
    highlights:['Paisaje montañoso','Clima fresco','Naturaleza tranquila','Atardeceres espectaculares'],
    clima:'Frío templado',
    epoca:'Oct – Abril',
    dif:'Fácil',
    entrada:'Q10 nacionales',
    bg:'linear-gradient(135deg,#1f4d5a,#0d2d35)',
    rating:'★★★★★',
    visitas:'18,000/año'
  },
  {
    id:8,
    nombre:'Laguna de Chicabal',
    region:'Quetzaltenango',
    cat:'Natural',
    imgCard:'Imagenes/Quetzaltenango.png',
    imgDetalle:'Imagenes/LaguanChicavalPortada.png',
    descCorta:'Laguna sagrada rodeada de bosque nuboso y ubicada en el cráter de un volcán.',
    descFull:'La Laguna de Chicabal es uno de los destinos naturales y espirituales más importantes de Guatemala. Situada dentro del cráter del Volcán Chicabal, esta laguna destaca por su ambiente místico, sus senderos rodeados de bosque nuboso y la tranquilidad que ofrece a los visitantes.',
    extra:'La laguna es considerada un lugar sagrado para la cultura maya mam, donde aún se realizan ceremonias tradicionales. El recorrido incluye caminatas entre naturaleza, miradores y una larga escalinata que conduce hasta la orilla de la laguna. La neblina y el clima fresco crean un paisaje único durante gran parte del año.',
    highlights:['Laguna sagrada','Bosque nuboso','Senderismo','Cultura maya mam'],
    clima:'Frío húmedo',
    epoca:'Nov – Abril',
    dif:'Moderada',
    entrada:'Q25 nacionales',
    bg:'linear-gradient(135deg,#355c3a,#1b2f1d)',
    rating:'★★★★★',
    visitas:'35,000/año'
  },
  {
    id:9,
    nombre:'Cueva de Anda Mirá',
    region:'Jutiapa',
    cat:'Aventura',
    imgCard:'Imagenes/CuevasPortada.gif',
    imgDetalle:'Imagenes/CuevasPortada.jpg',
    descCorta:'Impresionante cueva natural rodeada de paisajes rocosos y naturaleza oriental.',
    descFull:'La Cueva de Anda Mirá es uno de los atractivos naturales más interesantes de Jutiapa. Este destino destaca por sus formaciones rocosas, su ambiente misterioso y la experiencia de exploración que ofrece a los visitantes que disfrutan del turismo de aventura y contacto con la naturaleza.',
    extra:'El recorrido hacia la cueva permite apreciar paisajes secos característicos del oriente de Guatemala. En el interior pueden observarse formaciones naturales creadas por la humedad y el paso del tiempo. Es un lugar ideal para caminatas, fotografía y exploración, especialmente durante la temporada seca.',
    highlights:['Turismo de aventura','Formaciones rocosas','Exploración natural','Paisajes orientales'],
    clima:'Cálido seco',
    epoca:'Nov – Abril',
    dif:'Moderada',
    entrada:'Q15 nacionales',
    bg:'linear-gradient(135deg,#6a4a2f,#3b2415)',
    rating:'★★★★☆',
    visitas:'12,000/año'
}
];

let currentUser  = null;
let currentDest  = null;
let activeFilter = 'Todos';


async function doLogin(){
  const email=document.getElementById('login-email').value.trim();
  const pass=document.getElementById('login-pass').value.trim();
  try{
    const result=await apiLogin(email,pass);
    if(!result.success){
      document.getElementById('login-error').classList.remove('hidden');
      return;
    }
    document.getElementById('login-error').classList.add('hidden');
    currentUser=result.user;
    afterLogin();
  }catch(e){
    showNotif('Error de conexión con el servidor');
  }
}

async function doRegister(){
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value.trim();
  if(!name||!email||!pass){ showNotif('Completa todos los campos'); return; }
  try{
    const result=await apiRegister(name,email,pass);
    if(!result.success){ showNotif(result.message||'No fue posible registrar'); return; }
    showNotif('Usuario registrado correctamente');
  }catch(e){
    showNotif('Error de conexión con el servidor');
  }
}

function afterLogin(){
  document.getElementById('navbar').classList.remove('hidden');
  document.getElementById('nav-username').textContent = currentUser.name;
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
  showNotif('¡Bienvenido, ' + currentUser.name.split(' ')[0] + '!');
}

function logout(){
  currentUser = null;
  document.getElementById('navbar').classList.add('hidden');
  ['nav-admin','nav-cliente'].forEach(id=>document.getElementById(id).classList.add('hidden'));
  showView('login');
  switchLoginTab('login');
}


function showView(v){
  document.querySelectorAll('.view').forEach(el=>el.classList.remove('active'));
  document.getElementById('view-'+v).classList.add('active');
  document.querySelectorAll('.nav-links button').forEach(b=>b.classList.remove('active'));
  const nb = document.getElementById('nav-'+v);
  if(nb) nb.classList.add('active');
  window.scrollTo(0,0);
  if(v==='destinos') renderDestinos(activeFilter);
  if(v==='admin')   renderAdmin();
}
function goHome(){ if(currentUser) showView('home'); }

function switchLoginTab(tab){
  document.getElementById('login-form').classList.toggle('hidden', tab!=='login');
  document.getElementById('register-form').classList.toggle('hidden', tab!=='register');
  document.querySelectorAll('.tab-switch button').forEach((b,i)=>{
    b.classList.toggle('active', (i===0&&tab==='login')||(i===1&&tab==='register'));
  });
}


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

function renderHomeCards(){
  document.getElementById('home-cards').innerHTML =
    DESTINOS.slice(0,3).map(d=>createCard(d,`openDetalle(${d.id})`)).join('');
}

function renderDestinos(filter){
  activeFilter = filter;
  const cats = ['Todos',...new Set(DESTINOS.map(d=>d.cat))];
  document.getElementById('filter-bar').innerHTML = cats.map(c=>
    `<button class="filter-btn${c===filter?' active':''}" onclick="renderDestinos('${c}')">${c}</button>`
  ).join('');
  const list = filter==='Todos'?DESTINOS:DESTINOS.filter(d=>d.cat===filter);
  document.getElementById('destinos-cards').innerHTML = list.map(d=>createCard(d,`openDetalle(${d.id})`)).join('');
}

function openDetalle(id){

  const d = DESTINOS.find(x=>x.id===id);

  if(!d) return;

  currentDest = d;

  document.getElementById('detalle-hero').style.background =
  `url('${d.imgDetalle}') center/cover no-repeat`;

  document.getElementById('detalle-region').textContent =
  d.region+' · '+d.cat;

  document.getElementById('detalle-titulo').textContent =
  d.nombre;

  document.getElementById('detalle-subtitle').textContent =
  'Sobre '+d.nombre;

  document.getElementById('detalle-desc').textContent =
  d.descFull;

  document.getElementById('detalle-extra').textContent =
  d.extra;

  document.getElementById('detalle-highlights').innerHTML =
  d.highlights.map(h=>
    `<span class="highlight-tag">${h}</span>`
  ).join('');

  document.getElementById('info-region').textContent =
  d.region;

  document.getElementById('info-clima').textContent =
  d.clima;

  document.getElementById('info-epoca').textContent =
  d.epoca;

  document.getElementById('info-dif').textContent =
  d.dif;

  document.getElementById('info-entrada').textContent =
  d.entrada;

  showView('detalle');
}

function renderAdmin(){
  document.getElementById('kpi-users').textContent = usuarios.length;
  document.getElementById('kpi-dest').textContent  = DESTINOS.length;
  renderAdminUsers();
  renderAdminDest();
}

function adminPanel(p){
  document.querySelectorAll('.admin-panel').forEach(el=>el.classList.remove('active'));
  document.getElementById('panel-'+p).classList.add('active');
  document.querySelectorAll('.sidebar-menu button').forEach(b=>b.classList.remove('active'));
  const sb = document.getElementById('sb-'+p);
  if(sb) sb.classList.add('active');
}

function renderAdminUsers(){
  document.getElementById('admin-users-table').innerHTML = usuarios.map(u=>`
    <tr>
      <td>${u.id}</td><td>${u.name}</td><td>${u.email}</td>
      <td><span class="badge ${u.rol==='admin'?'badge-blue':'badge-green'}">${u.rol}</span></td>
      <td><span class="badge ${u.estado==='activo'?'badge-green':'badge-red'}">${u.estado}</span></td>
      <td>
        <button class="btn btn-outline" style="padding:4px 10px;font-size:.75rem;" onclick="toggleUser(${u.id})">
          ${u.estado==='activo'?'Bloquear':'Activar'}
        </button>
      </td>
    </tr>`).join('');
}

function renderAdminDest(){
  document.getElementById('admin-dest-table').innerHTML = DESTINOS.map(d=>`
    <tr>
      <td>${d.emoji} ${d.nombre}</td>
      <td>${d.region}</td>
      <td><span class="badge badge-blue">${d.cat}</span></td>
      <td><span class="badge badge-green">Publicado</span></td>
      <td>
        <button class="btn btn-outline" style="padding:4px 10px;font-size:.75rem;" onclick="showNotif('Edición próximamente')">Editar</button>
        <button class="btn btn-danger"  style="padding:4px 10px;font-size:.75rem;margin-left:4px;" onclick="showNotif('Función en desarrollo')">Eliminar</button>
      </td>
    </tr>`).join('');
}

function toggleUser(id){
  const u = usuarios.find(x=>x.id===id);
  if(!u) return;
  u.estado = u.estado==='activo'?'bloqueado':'activo';
  renderAdminUsers();
  showNotif('Usuario '+u.estado);
}

function addUser(){
  const name  = document.getElementById('m-name').value.trim();
  const email = document.getElementById('m-email').value.trim();
  const pass  = document.getElementById('m-pass').value.trim();
  const rol   = document.getElementById('m-rol').value;
  if(!name||!email||!pass){ showNotif('Completa todos los campos'); return; }
  usuarios.push({ id:nextUserId++, name, email, pass, rol, estado:'activo' });
  closeModal('addUser');
  renderAdminUsers();
  document.getElementById('kpi-users').textContent = usuarios.length;
  showNotif('Usuario creado exitosamente');
}

function saveDestino(){
  const n = document.getElementById('nd-nombre').value.trim();
  if(!n){ showNotif('Escribe el nombre del destino'); return; }
  const nd = {
    id: DESTINOS.length + 1,
    nombre: n,
    region: document.getElementById('nd-region').value||'Guatemala',
    cat:    document.getElementById('nd-cat').value,
    emoji:  document.getElementById('nd-emoji').value||'📍',
    descCorta: document.getElementById('nd-desc-short').value||'Nuevo destino turístico.',
    descFull:  document.getElementById('nd-desc-full').value||'',
    extra: '',
    highlights: [document.getElementById('nd-cat').value],
    clima: document.getElementById('nd-clima').value||'Templado',
    epoca: document.getElementById('nd-epoca').value||'Todo el año',
    dif:   document.getElementById('nd-dif').value,
    entrada: document.getElementById('nd-precio').value||'Libre',
    bg: 'linear-gradient(135deg,#1a6e3c,#0e4d2a)',
    rating:'★★★★☆', visitas:'Nuevo'
  };
  DESTINOS.push(nd);
  adminPanel('destinos-admin');
  renderAdminDest();
  document.getElementById('kpi-dest').textContent = DESTINOS.length;
  showNotif('¡Destino "'+nd.nombre+'" publicado!');
}

function updateClienteView(){
  if(!currentUser) return;
  document.getElementById('cliente-nombre').textContent = currentUser.name;
  document.getElementById('cliente-email').textContent  = currentUser.email;
  document.getElementById('profile-name').textContent   = currentUser.name;
  document.getElementById('profile-email').textContent  = currentUser.email;
  document.getElementById('edit-name').value            = currentUser.name;
  document.getElementById('profile-avatar').textContent = currentUser.name[0].toUpperCase();
  // Favorites (demo)
  const favs = DESTINOS.slice(0,3);
  document.getElementById('fav-grid').innerHTML = favs.map(d=>`
  <div class="fav-card" onclick="openDetalle(${d.id})">

    <div class="fav-card-img">
      <img src="${d.imgCard}" alt="${d.nombre}">
    </div>

    <div class="fav-card-body">
      <h4>${d.nombre}</h4>
      <p>${d.region}</p>
    </div>

  </div>
`).join('');
  // Recommendations
  document.getElementById('rec-cards').innerHTML =
    DESTINOS.slice(3,6).map(d=>createCard(d,`openDetalle(${d.id})`)).join('');
}


function showModal(id){ document.getElementById('modal-'+id).classList.add('open'); }
function closeModal(id){ document.getElementById('modal-'+id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click', e=>{ if(e.target===m) m.classList.remove('open'); });
});


let notifTimer;
function showNotif(msg){
  const el = document.getElementById('notif');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(()=>el.classList.remove('show'), 3000);
}

renderHomeCards();
renderDestinos('Todos');
