import Contratos from "../models/contratos.js";

async function createContrato(req, res){
    const { idCliente, idProposta, contrato, nome, descricao, status, local } = req.body
    const contratos = await Contratos.create({ idCliente, idProposta, contrato, nome, descricao, status, local }) 

    if(contratos){
        res.status(200).json({idCliente, idProposta, contrato, nome, descricao, status, local})
    }else{
        res.status(500).json({message: 'Não foi possivel criar'})
    }
}

async function getContrato(req,res){
    const contratos = await Contratos.findAll()

    if(contratos){
        res.json(contratos.map(contratos => contratos.toJSON()))
    } else {
        res.status(500).json({message: 'Não foi possível buscar usuários'})
    }
}

export default { createContrato, getContrato }