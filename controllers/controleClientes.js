import Clientes from "../models/clientes.js";
import Contratos from "../models/contratos.js";

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

async function getClientId(req, res) {
    const { id } = req.params;

    try{
        const getClient = await Clientes.findByPk(id);
        
        if (getClient) {
            res.json(getClient.toJSON());
        } else {
            res.status(404).json({ message: "Não foi possível encontrar" })
        }
    }catch (error){
        res.status(500).json({ message: "Erro ao encotrar", error })
    }
}


async function getClienteContrato(req, res) {
    const { id } = req.params;

    try {

        const requestCliente = await Contratos.findOne({ where: { id }})

        if(requestCliente){

            res.json(requestCliente.toJSON())

        }else{

            res.status(404).json({ message: 'O contrato não existe' })

        }
    } catch (error) {

        res.status(500).json({ message: 'erro ao encontrar', error })

    }
}



export default { createCliente, getCliente, getClientId, getClienteContrato }