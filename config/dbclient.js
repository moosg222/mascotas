import { MongoClient } from "mongodb";
import "dotenv/config";
import mongoose from "mongoose";

class dbClient {
  constructor() {
    this.connectDB();
  }
  async connectDB() {
    const queryString = `mongodb+srv://moosg222_db_user:${process.env.PASS_DB}@dbhorizon.uugswo8.mongodb.net/${process.env.NAME_DB}`;
    await mongoose.connect(queryString);
    console.log(`conectado a la base de datos ${process.env.NAME_DB} exitosamente`);
  }

  async cerrarConexion() {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
    }
  }
}

export default new dbClient();
