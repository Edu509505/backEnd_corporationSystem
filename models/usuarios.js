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
            model: "Propostas",
            type: "id"
        }
    },
    idContrato:{
        type: Sequelize.INTEGER,
        references: {
            model: "Contratos",
            key:"id"
        }
    },
    idMedicao:{
        type: Sequelize.INTEGER,
        references:{
            model: "Medicao",
            key: "id"
        }
    },
    path:{
        type: Sequelize.STRING
    }
})

export default Usuarios