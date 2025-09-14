import Contratos from "../models/contratos.js";

async function createContrato(req, res) {
    const {
        idCliente,
        idProposta,
        contrato,
        nome,
        descricao,
        status,
        local
    } = req.body

    const contratos = await Contratos.create({
        idCliente,
        idProposta,
        contrato,
        nome,
        descricao,
        status,
        local
    });

    if (contratos) {
        res.status(200).json({
            idCliente,
            idProposta,
            contrato,
            nome,
            descricao,
            status,
            local
        });
    } else {
        res.status(500).json({ message: 'Não foi possivel criar' });
    }
}

async function getContrato(req, res) {
    const contratos = await Contratos.findAll()

    if (contratos) {
        res.json(contratos.map(contratos => contratos.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar' })
    }
}

async function getContratoId(req, res) {
    const { id } = req.params;

    try {
        const contratoId = await Contratos.findOne({ where: id})

        if (contratoId) {
            res.json(contratoId.toJSON())
        } else {
            res.status(404).json({ message: 'Contrato inexistente' })
        }

    } catch (error) {
        res.status(500).json({ message: "Erro ao encotrar", error })
    }
}


export default { createContrato, getContrato, getContratoId }