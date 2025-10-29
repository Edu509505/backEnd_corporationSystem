import { Sequelize } from "sequelize";

import database from "../db/database.js";
import Medicoes from "./medicoes.js";

export const Faturamento = database.define("faturamento", {
    idMedicao: {
        type: Sequelize.INTEGER,
        references: {
            model: Medicoes,
            key: "id",
        },
        allowNull: false,
    },
    valor: {
        type: Sequelize.INTEGER,
        allowNull: false   
    }
});

