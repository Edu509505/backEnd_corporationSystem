import { Sequelize } from "sequelize";

import database from '../db.js';

const Quantitativa = database.define("quantitativa", {
    idVersionamento:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    numeracao:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    descricao:{
        type: Sequelize.STRING,
        allowNull: false
    },  
    quantidade:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valorUnitario:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    unidadeDeMedida:{
        type: Sequelize.STRING,
        allowNull: false
    },
    valorTotal:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

export default Quantitativa;