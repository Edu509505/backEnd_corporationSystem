import dotenv from 'dotenv'

dotenv.config()

export default {
	development: {
        dialect: 'sqlite',
        storage: 'database.db'
    },
	production: {
		username: process.env.DB_USER_PROD,
		password: process.env.DB_PASSWORD_PROD,
		database: process.env.DB_NAME_PROD,
		host: process.env.DB_HOST_PROD,
		dialect: process.env.DB_DIALECT_PROD
	}

}