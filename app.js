
import express from 'express'
import cors from 'cors'


import database from './db/database.js'
import router from './routes.js'
import './models/clientes.js'
import './models/associations.js'
import cookieParser from 'cookie-parser'

database.sync()

const app = express()

app.use(cookieParser());
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173'
    }
))
app.use(router)

app.listen(3000, () => {
    console.log('O servidor está escutando a porta 3000')
})