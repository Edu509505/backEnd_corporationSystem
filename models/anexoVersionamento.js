import { Sequelize } from "sequelize";

import database from "../db.js";

const AnexoVersionamento = database.define("anexoVersionamento", {
    //Aqui ele pega o id da tabela 
    idVersionamento: {
        type: Sequelize.INTEGER,
        references: {
            model: "versionamentos", //Tabela
            key: "id" //Coluna
        },
        allowNull: false
    },
    path: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default AnexoVersionamento;
