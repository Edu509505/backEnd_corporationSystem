import { Sequelize } from "sequelize";

import database from "../db.js";

const Versionamento = database.define("versionamentos", {
    versao: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idProposta: {
        type: Sequelize.INTEGER,
        references: {
            model: "propostas",
            key: "id",
        },
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['versao','idProposta']
        }
    ]
});

export default Versionamento;
