import mongoose from "mongoose";
const usuarioSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    telefono: { type: String, trim: true },
    clave: { type: String, required: true },
    verificado: {
      type: Boolean,
      default: false,
    },
    rol: { type: mongoose.Schema.Types.ObjectId, ref: "roles", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("usuario", usuarioSchema);
