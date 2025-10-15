import { Sequelize } from "sequelize";

import database from "../db.js";
import Proposta from "./propostas.js";
import Clientes from "./clientes.js";
import Contratos from "./contratos.js";
import DiarioDeObra from "./diarioDeObra.js";

const Medicoes = database.define("medicoes", {
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
      key:"id",
    }
  },
  idContrato: {
    type: Sequelize.INTEGER,
    references: {
      model: Contratos,
      key: "id",
    },
    allowNull: false,
  },
  idDiarioDeObra: {
    type: Sequelize.INTEGER,
    references: {
      model: DiarioDeObra,
      key: "id",
    }
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
  tipo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  observacao: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  quantidade: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  valorUnitario: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  valor: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  valorTotalDaMedicao: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

export default Medicoes;
