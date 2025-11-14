import "dotenv/config";
import jsonwebtoken from "jsonwebtoken";

// Genera un token JWT. 'rol' puede ser: string, array o un objeto { nombre }
export function generarToken(email, rol, expiresIn = "1h") {
  let rolesValue = [];
  if (Array.isArray(rol)) rolesValue = rol;
  else if (typeof rol === "string") rolesValue = [rol];
  else if (rol && typeof rol === "object") {
    if (rol.nombre) rolesValue = [rol.nombre];
    else if (rol.roles && Array.isArray(rol.roles)) rolesValue = rol.roles;
    else rolesValue = [];
  }

  const payload = { email, roles: rolesValue };
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
}

export function verificarToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");


  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.emailConectado = decoded.email;
    req.roles = decoded.roles;
    next();
  } catch (error) {

    console.error("ERROR VERIFICANDO JWT:", error);
    res.status(401).json({ mensaje: "Token no valido" });
  }
}

export function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    const usuarioRoles = req.roles || [];

    const tienePermiso = usuarioRoles.some((rol) =>
      rolesPermitidos.includes(rol)
    );
    if (!tienePermiso) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }
    next();
  };
}

export function verificarJWT(token) {
  if (!token) throw new Error("Token no proporcionado");
  return jsonwebtoken.verify(token, process.env.JWT_SECRET);
}
