import { Sequelize } from "sequelize";

import database from "../db.js";

 const ItensDoDia = database.define('itensDoDia', {
    idDiaDeObra: {
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
    itemQuantativa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quandtidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


export default ItensDoDia