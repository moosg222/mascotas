import mongoose from "mongoose";
const mascotaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    tipo: { type: String, required: true, enum: ["Perro", "Gato", "Otro"] },
    raza: { type: String },
    edad: {
      type: Number,
      min: [0, "la edad no es correcta"],
      max: [30, "La edad no parece correcta"],
    },
    descripcion: { type: String },
    adoptado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("mascota", mascotaSchema);
