import Medicoes from "../models/medicoes.js";

async function createMedicao(req, res){
    const { idCliente, idContrato, obra, local, periodo, descricao, tipo, observacoes, quantidade, valorUnitario, valor, valorTotalDaMedicao } = req.body
    const medicoes = await Medicoes.create({ idCliente, idContrato, obra, local, periodo, descricao, tipo, observacoes, quantidade, valorUnitario, valor, valorTotalDaMedicao })

    if(medicoes){
        res.status(200).json({idCliente, idContrato, obra, local, periodo, descricao, tipo, observacoes, quantidade, valorUnitario, valor, valorTotalDaMedicao})
    }else{
        res.status(500).json({message: 'Não foi possivel criar'})
    }
}

async function getMedicao(req,res){
    const medicoes = await Medicoes.findAll()

    if(medicoes){
        res.json(medicoes.map(medicoes => medicoes.toJSON()))
    } else {
        res.status(500).json({message: 'Não foi possível buscar usuários'})
    }
}

export default { createMedicao, getMedicao }