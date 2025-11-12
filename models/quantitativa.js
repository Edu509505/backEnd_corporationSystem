import { Sequelize } from "sequelize";

import database from '../db/database.js';
import Versionamento from "./versionamento.js";

const Quantitativa = database.define("quantitativas", {
    idVersionamento: {
        type: Sequelize.INTEGER,
        references: {
            model: Versionamento,
            key: "id",
        },
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valorUnitario: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    unidadeDeMedida: {
        type: Sequelize.ENUM("M²","Hora", "Diaria"),
        allowNull: false
    }
});

export default Quantitativa;