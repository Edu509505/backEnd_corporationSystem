import { Sequelize } from "sequelize";

import database from '../db.js';

const Quantitativa = database.define("quantitativa", {
    idVersionamento: {
        type: Sequelize.STRING,

    },
    numeracao: {
        type: Sequelize.STRING,

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

    },
    valorTotal: {
        type: Sequelize.STRING,
    }
});

export default Quantitativa;