import express from 'express'

import database from './db.js'
import router from './routes.js'
import './models/clientes.js'

database.sync()

const app = express()

app.use(express.json())
app.use(router)

app.listen(3000, () => {
    console.log('O servirdor está escutando a porta 3000')
})