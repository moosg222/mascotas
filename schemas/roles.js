import mongoose from "mongoose";

const rolesSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String },
});

export default mongoose.model("roles", rolesSchema);
