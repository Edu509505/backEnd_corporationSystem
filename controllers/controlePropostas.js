import Proposta from "../models/propostas.js";

async function createProposta(req, res) {
    const { idCliente, nomeDaProposta, descricao } = req.body
    const propostas = await Proposta.create({ idCliente, nomeDaProposta, descricao})

    if (propostas) {
        res.status(200).json({ idCliente, nomeDaProposta, descricao})
    } else {
        res.status(500).json({ message: 'Não foi possivel criar' })
    }
}

async function getProposta(req, res) {
    console.log('por favor funciona véi')
    const propostas = await Proposta.findAll()

    if (propostas) {
        res.json(propostas.map(propostas => propostas.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}

export default { createProposta, getProposta }