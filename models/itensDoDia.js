import { Sequelize } from "sequelize";

import database from "../db/database.js";
import DiarioDeObra from "./diarioDeObra.js";
import Quantitativa from "./quantitativa.js";

 const ItensDoDia = database.define('itensDosDias', {
    idDiarioDeObra: {
        type: Sequelize.INTEGER,
        references: {
            model: DiarioDeObra,
            key: "id",
        },
        allowNull: false,
    },
    idQuantitativa: {
        type: Sequelize.INTEGER,
        references:{
            model: Quantitativa,
            key: "id",
        },
        allowNull: false,
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});


export default ItensDoDia