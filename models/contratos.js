import { Sequelize } from "sequelize";

import database from "../db.js";

const Contratos = database.define("contratos", {
  idCliente: {
    type: Sequelize.INTEGER,
    references: {
      model: "clientes",
      key: "id",
    },
    allowNull: false,
  },
  idProposta: {
    type: Sequelize.INTEGER,
    references: {
      model: "propostas",
      key: "id",
    }
  },
  contrato: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  local: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

export default Contratos;
