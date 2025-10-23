import dotenv from 'dotenv'

dotenv.config()

export default {
	development: {
        dialect: 'sqlite',
        storage: 'database.db'
    },
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT
	}
}