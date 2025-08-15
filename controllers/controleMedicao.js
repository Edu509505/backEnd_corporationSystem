import Usuarios from "../models/usuarios.js"

async function createUsuario (req, res){
    const { id, email, password, idProposta, idContrato, idMedicao, path } = req.body
    const usuarios = await Usuarios.create({ id, email, password, idProposta, idContrato, idMedicao, path })

    if(usuarios){
        res.status(200).json({ id, email, password, idProposta, idContrato, idMedicao, path })
    }else{
        res.status(500).json({ message: "Não fpo possivel criar" })
    }
}

async function getUsuario(req, res) {
    const usuarios = await Usuarios.findAll()

    if(usuarios){
        res.json(usuarios.map(usuarios => usuarios.toJSON()))
    } else {
        res.status(500).json({ message: "Não foi possível encontrar o usuario" })
    }
}

export default { createUsuario, getUsuario }