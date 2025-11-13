import mascotas from "../schemas/mascotas.js";

class mascotasModelo {
  async create(mascota) {
    return mascotas.create(mascota);
  }

  async readAll() {
    return mascotas.find({});
  }

  async update(id, mascota) {
    return mascotas.findByIdAndUpdate(id, mascota, { new: true });
  }

  async delete(id) {
    return mascotas.findByIdAndDelete(id);
  }

  async readOne(id) {
    return mascotas.findById(id);
  }
}
export default new mascotasModelo();
