export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // ================= REGISTER =================
    if (url.pathname === "/api/register") {
      const { nombre, email, password } = await request.json();

      const exists = await env.DB.prepare(
        "SELECT id FROM usuarios WHERE email = ?"
      ).bind(email).first();

      if (exists) {
        return json({ success: false, message: "Usuario ya existe" }, cors);
      }

      const hash = await sha256(password);

      await env.DB.prepare(
        `INSERT INTO usuarios (nombre, email, password_hash)
         VALUES (?, ?, ?)`
      ).bind(nombre, email, hash).run();

      return json({ success: true }, cors);
    }

    // ================= LOGIN =================
    if (url.pathname === "/api/login") {
      const { email, password } = await request.json();

      const user = await env.DB.prepare(
        "SELECT * FROM usuarios WHERE email = ?"
      ).bind(email).first();

      if (!user) {
        return json({ success: false, message: "No existe usuario" }, cors);
      }

      const hash = await sha256(password);

      if (hash !== user.password_hash) {
        return json({ success: false, message: "Password incorrecto" }, cors);
      }

      const token = crypto.randomUUID();

      await env.DB.prepare(
        `INSERT INTO sesiones (usuario_id, token, fecha_expiracion)
         VALUES (?, ?, datetime('now', '+1 day'))`
      ).bind(user.id, token).run();

      return json({
        success: true,
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      }, cors);
    }

    // ================= DESTINOS =================
    if (url.pathname === "/api/destinos") {
      const rows = await env.DB.prepare(
        "SELECT * FROM destinos WHERE activo = 1"
      ).all();

      return json({ success: true, destinos: rows.results }, cors);
    }

    return new Response("Not Found", { status: 404, headers: cors });
  }
};

// ================= HELPERS =================
function json(data, cors) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...cors }
  });
}

// simple hash (para demo)
async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
