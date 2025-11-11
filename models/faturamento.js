import { Sequelize } from "sequelize";

import database from "../db/database.js";
import Medicoes from "./medicoes.js";
import Clientes from "./clientes.js";
import Proposta from "./propostas.js";

const Faturamento = database.define("faturamentos", {
    idMedicao: {
        type: Sequelize.INTEGER,
        references: {
            model: Medicoes,
            key: "id",
        },
        allowNull: false,
    },
    idCliente: {
        type: Sequelize.INTEGER,
        references: {
            model: Clientes,
            key: "id",
        },
        allowNull: false,
    },
    idProposta: {
        type: Sequelize.INTEGER,
        references: {
            model: Proposta,
            key: "id",
        },
        allowNull: false,
    },
    numeroDaNota: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    valor: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    vencimento: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pagamento: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

export default Faturamento;