import { Sequelize } from "sequelize";

import database from "../db.js";

const Proposta = database.define("propostas", {
  idCliente: {
    type: Sequelize.NUMBER,
    references: {
      model: "Clientes",
      key: "id",
    },
    allowNull: false,
  },
  tipoDeProposta: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Proposta;
