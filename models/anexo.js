import { Sequelize } from "sequelize";

import database from "../db.js";

const Anexo = database.define("anexos", {
    anexo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    path: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Anexo;
