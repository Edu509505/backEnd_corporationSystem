import { Sequelize } from "sequelize";

import database from "../db.js";

const Proposta = database.define("propostas", {
  idCliente: {
    type: Sequelize.INTEGER,
    references: {
      model: "clientes",
      key: "id",
    },
    allowNull: false,
  },
  nomeDaProposta: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  valorProposta: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  statusProposta: {
    type: Sequelize.ENUM('EM_ANALISE', 'APROVADA', 'REPROVADA'),
    allowNull: false
  }

});

export default Proposta;
