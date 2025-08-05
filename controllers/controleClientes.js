import Clientes from "../models/clientes.js";

async function createCliente(req, res){
    const { cliente, cnpj, local, status } = req.body
    const clientes = await Clientes.create({ cliente, cnpj, local, status }) 

    if(clientes){
        res.status(200).json({cliente, cnpj, local, status})
    }else{
        res.status(500).json({message: 'Não foi possivel criar'})
    }
}

async function getCliente(req,res){
    const clientes = await Clientes.findAll()

    if(clientes){
        res.json(clientes.map(clientes => clientes.toJSON()))
    } else {
        res.status(500).json({message: 'Não foi possível buscar usuários'})
    }
}

export default { createCliente, getCliente }