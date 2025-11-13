import express from "express";
const route = express.Router();
import mascotasController from "../controllers/mascotas.js";
import { verificarToken, verificarRol } from "../helpers/autenticacion.js";

route.post("/",  verificarToken, verificarRol("admin", "veterinario"), mascotasController.create);
route.get("/", verificarToken, verificarRol("admin", "veterinario"), mascotasController.readAll);
route.get("/:id", verificarToken, verificarRol("admin", "veterinario"), mascotasController.readOne);
route.put("/:id", verificarToken, verificarRol( "admin","veterinario"), mascotasController.update);
route.delete("/:id", verificarToken, verificarRol("admin","veterinario"), mascotasController.delete);

export default route;
