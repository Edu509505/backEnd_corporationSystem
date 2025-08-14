import { Sequelize } from "sequelize";

import database from "../db.js";

const Clientes = database.define("clientes", {
  cliente: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cnpj: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  local: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Clientes;
