import { Sequelize } from "sequelize";
import config from "./config.js";

// const database = new Sequelize(config[process.env.NODE_ENV || 'development']);
const database = new Sequelize(config [process.env.NODE_ENV]);

console.log('config[process.env.NODE_ENV || \'development\']', config[process.env.NODE_ENV]);
console.log("Host do banco:", process.env.DB_HOST_PROD);

try {
    await database.authenticate()

    console.log('Banco de dados inicializado com sucesso!');
} catch (error){
    console.error('Erro ao inicializar o banco de dados', error);
}

export default database