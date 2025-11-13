// Backend/app.js
import "dotenv/config";
import express from "express";
import cors from "cors";

import mascotasRoutes from "./routes/mascotas.js";
import usuariosRoutes from "./routes/usuarios.js";
import dbclient from "./config/dbclient.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/usuarios", usuariosRoutes);
app.use("/mascotas", mascotasRoutes);

// Servir archivos estáticos desde la carpeta "public"
// Servir archivos estáticos desde la carpeta "public" (ruta absoluta)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "registro.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "reset-password.html"));
});

app.get("/verificarEmail", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "verificarEmail.html"));
});

app.get("/CRUDmascotas", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mascotas.html"));
});

// Escuchar el puerto definido en las variables de entorno (con fallback)
try {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("Error initializing the application:", err);
}

process.on("SIGINT", () => {
  console.log("Cerrando la aplicación...");
  dbclient.cerrarConexion();
  process.exit();
});
