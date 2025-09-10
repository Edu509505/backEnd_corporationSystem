import { Sequelize } from "sequelize";
import Versionamento from "./versionamento.js";

import database from "../db.js";

const AnexoVersionamento = database.define("anexoVersionamento", {
    //Aqui ele pega o id da tabela 
    idVersionamento: {
        type: Sequelize.INTEGER,
        references: {
            model: Versionamento, //Tabela
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
