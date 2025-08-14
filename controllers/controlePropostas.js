import Proposta from "../models/propostas.js";

async function createProposta(req, res) {
    const { idCliente, idProposta, tipoDeProposta, contrato, nome, descricao, status, local  } = req.body
    const propostas = await Proposta.create({ idCliente, idProposta, tipoDeProposta, contrato, nome, descricao, status, local })

    if (propostas) {
        res.status(200).json({ idCliente, idProposta, tipoDeProposta, contrato, nome, descricao, status, local })
    } else {
        res.status(500).json({ message: 'Não foi possivel criar' })
    }
}

async function getProposta(req, res) {
    const propostas = await Proposta.findAll()

    if (propostas) {
        res.json(propostas.map(propostas => propostas.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}

export default { createProposta, getProposta }