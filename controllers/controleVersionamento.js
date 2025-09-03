import Versionamento from "../models/versionamento.js";

async function createVersionamento(req, res) {
    const { versao, idProposta, status } = req.body
    const versionamento = await Versionamento.create({ versao: 1, idProposta, status: 'Em Análise'})

    if (versionamento) {
        res.status(200).json({ versao, idProposta, status })
    } else {
        res.status(500).json({ message: 'Não foi possivel criar' })
    }
}

async function getVersionamento(req, res) {
    const versionamento = await Versionamento.findAll()

    if (versionamento) {
        res.json(versionamento.map(versionamento => versionamento.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}

export default { createVersionamento, getVersionamento }