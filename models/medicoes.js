import { Sequelize } from "sequelize";

import database from "../db.js";

const Medicoes = database.define("medicoes", {
  idCliente: {
    type: Sequelize.NUMBER,
    references: {
      model: "Clientes",
      key: "id",
    },
    allowNull: false,
  },
  idContrato: {
    type: Sequelize.NUMBER,
    references: {
      model: "Contratos",
      key: "id",
    },
    allowNull: false,
  },
  obra: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  local: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  periodo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tipo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  observacoes: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantidade: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  valorUnitario: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  valor: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  valorTotalDaMedicao: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

export default Medicoes;
