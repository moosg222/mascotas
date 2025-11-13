import usuarios from "../schemas/usuarios.js";

class usuariosModelo {
  async create(usuario) {
    return await usuarios.create(usuario);
  }

  // Leer todos los usuarios (filtro opcional)
  async readAll(filter = {}) {
    return usuarios.find(filter);
  }

  // Buscar por email y devolver con rol poblado
  async findByEmail(email) {
    return usuarios.findOne({ email }).populate("rol");
  }

  async readOne(id) {
    return usuarios.findById(id);
  }

  async update(id, usuario) {
    return usuarios.findByIdAndUpdate(id, usuario, { new: true });
  }

  async delete(id) {
    return usuarios.findByIdAndDelete(id);
  }

  async updateByEmail(email, datosActualizados) {
    return usuarios.findOneAndUpdate(
      { email },
      { $set: datosActualizados },
      { new: true }
    );
  }

  async deleteByEmail(email) {
    return usuarios.findOneAndDelete({ email });
  }
}

export default new usuariosModelo();
