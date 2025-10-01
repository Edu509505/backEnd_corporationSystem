import { Sequelize } from "sequelize";

import database from '../db.js';

const Quantitativa = database.define("quantitativa", {
    idVersionamento: {
        type: Sequelize.INTEGER,
        references: { 
            model: "versionamentos",
            key: "id",
        }
    },
    numeracao: {
        type: Sequelize.INTEGER,

    },
    descricao: {
        type: Sequelize.STRING,

    },
    quantidade: {
        type: Sequelize.INTEGER,

    },
    valorUnitario: {
        type: Sequelize.INTEGER,

    },
    unidadeDeMedida: {
        type: Sequelize.STRING,

    },
    valorTotal: {
        type: Sequelize.INTEGER,
    }
});

export default Quantitativa;