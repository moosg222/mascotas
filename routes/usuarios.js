import express from "express";
const route = express.Router();
import UsuariosController from "../controllers/usuarios.js";
import { verificarToken } from "../helpers/autenticacion.js";

route.post("/register", UsuariosController.register); /*.bind(UsuariosController)*/
route.post("/login", UsuariosController.login);
route.get("/perfil", verificarToken, UsuariosController.profile);
route.put("/perfil", verificarToken, UsuariosController.actualizarPerfil);
route.delete("/perfil", verificarToken, UsuariosController.deleteProfile);
route.post("/recuperar", UsuariosController.solicitarRestablecimiento);
route.post("/reset-password", UsuariosController.resetPassword);
route.get("/verificarEmail", UsuariosController.verificarEmail);
route.post("/reenviarVerificacion", UsuariosController.reenviarVerificacion);

export default route;
