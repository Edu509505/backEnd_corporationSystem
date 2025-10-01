import { Sequelize } from "sequelize";

import database from '../db.js';

const Quantitativa = database.define("quantitativa", {
    idVersionamento: {
        type: Sequelize.INTEGER,

    },
    descricao: {
        type: Sequelize.STRING,

    },
    quantidadePrevista: {
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