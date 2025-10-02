import { Sequelize, DataTypes } from "sequelize";
import Versionamento from "./versionamento.js";

import database from "../db.js";


const DiarioDeObra = database.define('diarioDeObra', {
    idProposta: {
        type: Sequelize.INTEGER,
        references: {
          model: "propostas",
          key: "id",
        }
      },
    dataDia: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    itensDia: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default  DiarioDeObra 