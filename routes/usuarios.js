import express from "express";
const route = express.Router();
import UsuariosController from "../controllers/usuarios.js";
import { verificarToken } from "../helpers/autenticacion.js";

route.post("/register", UsuariosController.register.bind(UsuariosController));
route.post("/login", UsuariosController.login.bind(UsuariosController));
route.get("/perfil", verificarToken, UsuariosController.profile.bind(UsuariosController));
route.put("/perfil", verificarToken, UsuariosController.actualizarPerfil.bind(UsuariosController));
route.delete("/perfil", verificarToken, UsuariosController.deleteProfile.bind(UsuariosController));
route.post("/recuperar", UsuariosController.solicitarRestablecimiento.bind(UsuariosController));
route.post("/reset-password", UsuariosController.resetPassword.bind(UsuariosController));
route.get("/verificarEmail", UsuariosController.verificarEmail.bind(UsuariosController));
route.post("/reenviarVerificacion", UsuariosController.reenviarVerificacion.bind(UsuariosController));

export default route;
