import mascotasModelo from "../models/mascotas.js";

class mascotasController {
  constructor() {}

  async create(req, res) {
    try {
      const data = await mascotasModelo.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async update(req, res) {
    try {
      const id = req.params.id;
      const data = await mascotasModelo.update(id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send("Error al actalizar mascota");
    }
  }

  async readAll(req, res) {
    try {
      const data = await mascotasModelo.readAll();
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send("Error al leer mascota");
    }
  }

  async readOne(req, res) {
    try {
      const id = req.params.id;
      const data = await mascotasModelo.readOne(id);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).send("Error al leer mascota");
    }
  }

  async delete(req, res) {
    try {
      const id = req.params.id;
      const data = await mascotasModelo.delete(id);
      res.status(206).json(data);
    } catch (error) {
      res.status(500).send("Error al eliminar mascota");
    }
  }
}

export default new mascotasController();
