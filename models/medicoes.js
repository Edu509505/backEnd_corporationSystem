import { Sequelize } from "sequelize";

import database from "../db/database.js";
import Proposta from "./propostas.js";
import Clientes from "./clientes.js";

const Medicoes = database.define("medicoes", {
  idCliente: {
    type: Sequelize.INTEGER,
    references: {
      model: Clientes,
      key: "id"
    }
  },
  idProposta: {
    type: Sequelize.INTEGER,
    references: {
      model: Proposta,
      key: "id"
    }
  },
  observacao: {
    type: Sequelize.STRING,
    allowNull: true
  },
  periodoInicial: {
    type: Sequelize.STRING,
    allowNull: false
  },
  periodoFinal: {
    type: Sequelize.STRING,
    allowNull: false
  },
  faturado :{
    type: Sequelize.STRING,
    allowNull: false
  },
  valorTotal: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

export default Medicoes;
