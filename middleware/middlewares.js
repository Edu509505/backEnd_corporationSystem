import User from "../models/User.js"
import jwt from "jsonwebtoken"


const SECRET_KEY = '123456789012345'

async function authorization(req, res, next) {
    console.log('req.cookies', req.cookies);
    if (!req.cookies.authorization) {
        return res.status(401).send('Você não está autenticado! Faça login primeiro')
    }

    try {
        const token = jwt.verify(req.cookies.authorization, SECRET_KEY)

        const user = await User.findByPk(token.id)

        req.user = user
        next()
    } catch (error) {
        console.log('error', error);
        return res.status(401).send('Token inválido!')
    }
}

export default authorization