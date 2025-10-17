import { Sequelize, DataTypes } from "sequelize";
import Versionamento from "./versionamento.js";

import database from "../db.js";
import Proposta from "./propostas.js";
import Contratos from "./contratos.js";


const DiarioDeObra = database.define('diarioDeObra', {
    idProposta: {
        type: Sequelize.INTEGER,
        references: {
          model: Proposta,
          key: "id",
        }
      },
    dataDia: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
  
});

export default  DiarioDeObra 