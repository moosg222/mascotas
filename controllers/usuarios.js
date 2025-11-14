import { generarToken, verificarJWT } from "../helpers/autenticacion.js";
import sendEmail from "../helpers/sendEmail.js";
import usuariosModelo from "../models/usuarios.js";
import rolesModelo from "../models/roles.js";
import bcrypt from "bcrypt";

class UsuariosController {
  // ========================
  // Helper: Generar HTML Email
  // ========================
  generarHTMLCorreo(tipo, link) {
    const templates = {
      verificar: {
        title: "Verifica tu correo",
        message: `Gracias por registrarte. Antes de activar tu cuenta, necesitamos confirmar que este correo te pertenece. Haz clic en el botón para completar la verificación.`,
        color: "#10b981",
      },
      reset: {
        title: "Restablecer tu contraseña",
        message: `Hemos recibido una solicitud para cambiar la contraseña de tu cuenta. Si fuiste tú, haz clic en el botón de abajo para continuar.`,
        color: "#3b82f6",
      },
    };

    const { title, message, color } = templates[tipo];

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          body, html { margin:0; padding:0; width:100%; font-family:Arial,sans-serif; background-color:#f5f5f5; }
          .email-container { max-width:600px; margin:0 auto; padding:20px; background:#fff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); text-align:center; }
          h1 { color:#1f2937; font-size:24px; margin-bottom:16px; }
          p { color:#4b5563; font-size:16px; line-height:1.5; margin-bottom:24px; }
          a.button { display:inline-block; padding:14px 28px; background-color:${color}; color:#fff !important; font-weight:bold; text-decoration:none; border-radius:6px; transition:background-color 0.3s; }
          a.button:hover { opacity:0.85; }
          small { display:block; margin-top:20px; font-size:12px; color:#9ca3af; }
          @media(max-width:480px){ h1{font-size:20px;} p{font-size:14px;} .email-container{padding:15px;} a.button{padding:12px 20px;} }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h1>${title}</h1>
          <p>${message}</p>
          <a href="${link}" class="button">${title}</a>
          <small>Si no solicitaste este mensaje, puedes ignorarlo.</small>
        </div>
      </body>
      </html>
    `;
  }

  // ========================
  // Registrar usuario
  // ========================
  async register(req, res) {
    try {
      const { nombre, telefono, clave, email } = req.body;
      const rol = "cliente";

      const usuarioExistente = await usuariosModelo.findByEmail(email);
      if (usuarioExistente)
        return res.status(400).json({ message: "El usuario ya existe" });

      const claveEncryptada = await bcrypt.hash(clave, 10);
      const rolAsignado = await rolesModelo.findByRol(rol);
      if (!rolAsignado)
        return res.status(400).json({ message: "Rol no válido" });

      const nuevoUsuario = await usuariosModelo.create({
        nombre,
        telefono,
        clave: claveEncryptada,
        email,
        verificado: false,
        rol: rolAsignado._id,
      });

      const token = generarToken(email, rolAsignado.nombre, "2h");
      const link = `https://padoptatumascota.netlify.app/usuarios/verificarEmail?token=${token}`;

      await sendEmail(
        email,
        "Verifica tu correo",
        this.generarHTMLCorreo("verificar", link)
      );

      res.status(200).json({
        message: "Usuario registrado. Revisa tu correo para activarlo.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al registrar usuario" });
    }
  }

  // ========================
  // Login usuario
  // ========================
  async login(req, res) {
    try {
      const { email, clave } = req.body;
      const usuario = await usuariosModelo.findByEmail(email);
      if (!usuario)
        return res.status(404).json({ message: "Perfil no encontrado" });

      if (!usuario.verificado)
        return res.status(401).json({
          message: "Debes verificar tu correo antes de iniciar sesión",
        });

      const claveCorrecta = await bcrypt.compare(clave, usuario.clave);
      if (!claveCorrecta)
        return res.status(401).json({ message: "Clave incorrecta" });

      const token = generarToken(email, usuario.rol);
      const { clave: _, ...usuarioSinClave } = usuario.toObject();

      res
        .status(200)
        .json({ message: "Login exitoso", token, usuario: usuarioSinClave });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error en login" });
    }
  }

  // ========================
  // Perfil usuario
  // ========================
  async profile(req, res) {
    try {
      const email = req.emailConectado;
      const usuario = await usuariosModelo.findByEmail(email);
      if (!usuario)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const { clave, ...usuarioSinClave } = usuario.toObject();
      res.status(200).json(usuarioSinClave);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener perfil" });
    }
  }

  // ========================
  // Actualizar perfil
  // ========================
  async actualizarPerfil(req, res) {
    try {
      const emailConectado = req.emailConectado;
      const { nombre, email, telefono, passwordActual, nuevaPassword } =
        req.body;

      const usuario = await usuariosModelo.findByEmail(emailConectado);
      if (!usuario)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const datosActualizados = {
        nombre: nombre || usuario.nombre,
        email: email || usuario.email,
        telefono: telefono || usuario.telefono,
      };

      if (nuevaPassword) {
        if (!passwordActual)
          return res.status(400).json({
            message: "Debe ingresar la contraseña actual para cambiarla",
          });
        const claveCorrecta = await bcrypt.compare(
          passwordActual,
          usuario.clave
        );
        if (!claveCorrecta)
          return res
            .status(401)
            .json({ message: "Contraseña actual incorrecta" });

        datosActualizados.clave = await bcrypt.hash(nuevaPassword, 10);
      }

      const usuarioActualizado = await usuariosModelo.updateByEmail(
        emailConectado,
        datosActualizados
      );
      const token = generarToken(
        usuarioActualizado.email,
        usuarioActualizado.rol
      );
      const { clave, ...usuarioSinClave } = usuarioActualizado.toObject();

      res.status(200).json({ usuario: usuarioSinClave, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar perfil" });
    }
  }

  // ========================
  // Solicitar restablecimiento contraseña
  // ========================
  async solicitarRestablecimiento(req, res) {
    try {
      const { email } = req.body;
      const usuario = await usuariosModelo.findByEmail(email);
      if (!usuario)
        return res.status(404).json({ message: "Correo no registrado" });

      const token = generarToken(email, usuario.rol, "1h");
      const link = `https://padoptatumascota.netlify.app/reset-password?token=${token}`;

      await sendEmail(
        email,
        "Restablecer contraseña",
        this.generarHTMLCorreo("reset", link)
      );
      res.status(200).json({ message: "Correo enviado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al solicitar restablecimiento" });
    }
  }

  // ========================
  // Verificar email
  // ========================
  async verificarEmail(req, res) {
    try {
      const { token } = req.query;
      if (!token) return res.redirect("/verificarEmail?estado=error");

      const { email } = verificarJWT(token);
      const usuario = await usuariosModelo.findByEmail(email);
      if (!usuario) return res.redirect("/verificarEmail?estado=error");

      if (!usuario.verificado)
        await usuariosModelo.updateByEmail(email, { verificado: true });
      return res.redirect("/verificarEmail?estado=ok");
    } catch (error) {
      console.error(error);
      return res.redirect("/verificarEmail?estado=error");
    }
  }

  // ========================
  // Reenviar verificación
  // ========================
  async reenviarVerificacion(req, res) {
    try {
      const { email } = req.body;
      const usuario = await usuariosModelo.findByEmail(email);
      if (!usuario)
        return res.status(404).json({ message: "Correo no registrado" });
      if (usuario.verificado)
        return res
          .status(400)
          .json({ message: "Tu cuenta ya está verificada" });

      const token = generarToken(email, usuario.rol, "2h");
      const link = `https://padoptatumascota.netlify.app/verificarEmail?token=${token}`;
      await sendEmail(
        email,
        "Verificación de correo",
        this.generarHTMLCorreo("verificar", link)
      );

      res.status(200).json({
        message: "Se envió un nuevo enlace de verificación a tu correo",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al reenviar verificación" });
    }
  }

  // ========================
  // Reset contraseña
  // ========================
  async resetPassword(req, res) {
    try {
      const { token, passwordNueva } = req.body;
      if (!token) return res.status(400).json({ message: "Token requerido" });

      const { email } = verificarJWT(token);
      const usuario = await usuariosModelo.findByEmail(email);
      if (!usuario)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const claveEncryptada = await bcrypt.hash(passwordNueva, 10);
      await usuariosModelo.updateByEmail(email, { clave: claveEncryptada });

      res
        .status(200)
        .json({ message: "Contraseña restablecida correctamente" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Token inválido o expirado" });
    }
  }

  // ========================
  // Eliminar perfil
  // ========================
  async deleteProfile(req, res) {
    try {
      const email = req.emailConectado; // Debe venir del middleware de JWT
      const usuario = await usuariosModelo.findByEmail(email);

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Usando deleteOne de Mongoose
      await usuariosModelo.delete({ _id: usuario._id });

      return res
        .status(200)
        .json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar perfil:", error);
      return res.status(500).json({ message: "Error al eliminar perfil" });
    }
  }
}

export default new UsuariosController();
