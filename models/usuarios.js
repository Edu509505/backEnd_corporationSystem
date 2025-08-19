import { Sequelize } from "sequelize";

import database from '../db.js';

const Usuarios = database.define("usuarios", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    idProposta:{
        type: Sequelize.INTEGER,
        references: {
            model: "propostas",
            type: "id"
        }
    },
    idContrato:{
        type: Sequelize.INTEGER,
        references: {
            model: "contratos",
            key:"id"
        }
    },
    idMedicao:{
        type: Sequelize.INTEGER,
        references:{
            model: "medicao",
            key: "id"
        }
    },
    path:{
        type: Sequelize.STRING
    }
})

// Coloquei uma virgula a mais
export default Usuarios