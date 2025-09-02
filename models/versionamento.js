import { Sequelize } from "sequelize";

import database from "../db.js";

const Versionamento = database.define("versionamentos", {
    idProposta: {
        type: Sequelize.INTEGER,
        references: {
            model: "propostas",
            key: "id",
        },
        allowNull: false,
    },
    idAnexo: {
        type: Sequelize.INTEGER,
        references: {
            model: "anexo",
            key: "id",
        }
    },
    idStatus: {
        type: Sequelize.INTEGER,
        references: {
            model: "status",
            key: "id",
        }
    }
});

export default Versionamento;
