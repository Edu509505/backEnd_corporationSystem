import { Sequelize } from "sequelize";
import Faturamento from "./faturamento.js";

import database from "../db/database.js";

const AnexoFaturamento = database.define("anexoFaturamentos", {
    //Aqui ele pega o id da tabela 
    idFaturamento: {
        type: Sequelize.INTEGER,
        references: {
            model: Faturamento, //Tabela
            key: "id" //Coluna
        },
        allowNull: false
    },
    path: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default AnexoFaturamento;
