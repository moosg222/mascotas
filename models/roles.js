import modelos from "../schemas/roles.js";

class rolesModelo {
   async findByRol(nombre) {
    return modelos.findOne({ nombre });
    // || (await rolesModelo.findOne({ nombre: "cliente" }));
  }
}

export default new rolesModelo();
