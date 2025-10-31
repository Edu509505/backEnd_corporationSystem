import { Sequelize } from "sequelize";

import database from '../db/database.js';

const Usuarios = database.define("usuarios", {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    path: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.ENUM("plebe", "adm"),
        allowNull: false,
        defaultValue: "plebe",
    }
});

// Coloquei uma virgula a mais
export default Usuarios