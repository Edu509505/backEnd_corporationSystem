import { Sequelize } from "sequelize";

import database from "../db/database.js";
import Clientes from "./clientes.js";
import Proposta from "./propostas.js";

const Contratos = database.define("contratos", {
  idCliente: {
    type: Sequelize.INTEGER,
    references: {
      model: Clientes,
      key: "id",
    },
    allowNull: false,
  },
  idProposta: {
    type: Sequelize.INTEGER,
    references: {
      model: Proposta,
      key: "id",
    }
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Contratos;
