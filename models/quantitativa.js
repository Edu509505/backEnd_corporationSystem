import { Sequelize } from "sequelize";

import database from '../db.js';
import Versionamento from "./versionamento.js";

const Quantitativa = database.define("quantitativa", {
    idVersionamento: {
        type: Sequelize.INTEGER,
        references: {
            model: Versionamento,
            key: "id",
        }
    },
    descricao: {
        type: Sequelize.STRING,

    },
    quantidade: {
        type: Sequelize.STRING,

    },
    valorUnitario: {
        type: Sequelize.STRING,

    },
    unidadeDeMedida: {
        type: Sequelize.STRING,

    }
});

export default Quantitativa;