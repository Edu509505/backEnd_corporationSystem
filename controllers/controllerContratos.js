import Contratos from "../models/contratos.js";
import z from "zod";

async function createContrato(req, res) {
    const validacaoSchema = z.object({
        idCliente: z.coerce.number(),
        idProposta: z.coerce.number(),
        titulo: z.string(),
        local: z.string()
    });

    const resposta = await validacaoSchema.safeParseAsync(req.body);

    if (!resposta.success) {
        return res.status(400).json(resposta.error);
    }

    const contratoValidada = resposta.data;

    try {
        const contrato = await Contratos.create({
            idCliente: contratoValidada.idCliente,
            idProposta: contratoValidada.idProposta,
            titulo: contratoValidada.titulo,
            status: 'ATIVO',
            local: contratoValidada.local
        });

        res.status(200).json({
            idCliente: contrato.idCliente,
            idProposta: contrato.idProposta,
            titulo: contrato.titulo,
            status: contrato.status,
            local: contrato.local
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar contrato", error });
    }
}

async function getContratos(req, res) {
    const contratos = await Contratos.findAll({ include: ['cliente_contrato', 'proposta'] });

    if (contratos) {
        res.json(contratos.map(contratos => contratos.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar' })
    }
}

async function getContratoId(req, res) {
    const { id } = req.params;

    try {
        const contratoId = await Contratos.findOne({ where: id })

        if (contratoId) {
            res.json(contratoId.toJSON())
        } else {
            res.status(404).json({ message: 'Contrato inexistente' })
        }

    } catch (error) {
        res.status(500).json({ message: "Erro ao encotrar", error })
    }
}


export default { createContrato, getContratos, getContratoId }