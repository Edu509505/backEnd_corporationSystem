import { Sequelize } from "sequelize";

import database from "../db.js"
import Medicoes from "./medicoes.js";

const ItensMeciao = database.define("itensMedicao", {
    idMedicao: {
        type: Sequelize.INTEGER,
        references: {
            model: Medicoes,
            key: "id"
        }
    },
    contagem: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    medida: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valorUnitario: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    valorSomado: {
        type: Sequelize.NUMBER,
        allowNull: false
    }
})

export default ItensMeciao