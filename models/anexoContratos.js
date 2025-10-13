import { Sequelize } from "sequelize";
import Contrato from "./contratos.js";

import database from "../db.js";

const AnexoVersionamento = database.define("anexoContratos", {
    //Aqui ele pega o id da tabela 
    idContato: {
        type: Sequelize.INTEGER,
        references: {
            model: Contrato, //Tabela
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
