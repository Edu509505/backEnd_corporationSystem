import Usuarios from "../models/usuarios.js"
import jwt from 'jsonwebtoken'

const SECRET_KEY = '123456789012345'

async function login(req, res) {
    console.log('req.body', req.body);
    const { email, password } = req.body

    console.log('to aqui', req.body);

    const user = await Usuarios.findOne({ where: { email } })

    if (!user) {
        return res.status(404).send('Usuário não encontrado')
    }

     const senhaValida = await bcrypt.compare(password, user.password);

    if (senhaValida) {
        return res.status(401).send('Senha incorreta')
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY);

    res.json({ 
        token, 
        usuario: { 
            id: user.id, 
            nome: user.username, 
            email: user.email 
        } 
    });
}

export default { login }