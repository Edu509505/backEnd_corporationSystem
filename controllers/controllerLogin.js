import Usuarios from "../models/usuarios.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const SECRET_KEY = '123456789012345'

async function login(req, res) {
    console.log('req.body', req.body);
    const { email, password } = req.body

    console.log('to aqui', req.body);

    const user = await Usuarios.findOne({ where: { email } })

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }


    const senhaValida = await bcrypt.compare(password, user.password);

    if (!senhaValida) {
        return res.status(401).json({ error: 'Senha incorreta' });
    }


    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1d" });

    res.cookie("authorization", token, {
        httpOnly: true,       // protege contra acesso via JavaScript
        secure: false,         // só envia em HTTPS (remova em dev se necessário)
        sameSite: "strict",   // evita envio cruzado
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    })
        .json({
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                role: user.role // se tiver
            }

        });
}

export default { login }