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
  }
});

export default Proposta;
