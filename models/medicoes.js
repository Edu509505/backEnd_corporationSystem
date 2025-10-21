import { Sequelize } from "sequelize";

import database from "../db.js";
import Proposta from "./propostas.js";
import Clientes from "./clientes.js";

const Medicoes = database.define("medicoes", {
  idCliente: {
    type: Sequelize.INTEGER,
    references:{
      model: Clientes,
      key: "id"
    }
  },
  obra: {
    type: Sequelize.INTEGER,
    references: {
      model: Proposta,
      key: "id"
    }
  },
  local: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.DATE,
    allowNull: false
  },
  periodo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  valorTotal: {
    type: Sequelize.NUMBER,
    allowNull: false
  }
});

export default Medicoes;
