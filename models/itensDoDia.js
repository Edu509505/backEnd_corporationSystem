import { Sequelize } from "sequelize";

import database from "../db.js";

 const ItensDoDia = database.define('itensDoDia', {
    idDiarioDeObra: {
        type: Sequelize.INTEGER,
        references: {
            model: "diarioDeObra",
            key: "id",
        },
        allowNull: false,
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    itemQuantitativa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


export default ItensDoDia