import express from 'express'
import cors from 'cors'
import database from './db/database.js'
import router from './routes.js'
import './models/clientes.js'
import './models/associations.js'
import cookieParser from 'cookie-parser'

database.sync()

const app = express()

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router)

app.listen(process.env.APP_PORT, () => {
    console.log(`O servidor está escutando a porta ${process.env.APP_PORT}`)
})