import { Sequelize, DataTypes } from "sequelize";

import database from "../db/database.js";
import Proposta from "./propostas.js";
import Medicoes from "./medicoes.js";



const DiarioDeObra = database.define('diarioDeObras', {
  idProposta: {
    type: Sequelize.INTEGER,
    references: {
      model: Proposta,
      key: "id",
    },
    allowNull: false
  },
  idMedicao: {
    type: Sequelize.INTEGER,
    references: {
      model: Medicoes,
      key: "id",
    }
  },
  dataDia: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

export default DiarioDeObra 