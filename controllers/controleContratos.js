import Contratos from "../models/contratos.js";

async function createContrato(req, res) {
    const  validacaoSchema = z.object({
        idCliente: z.coerce.number().nonempty("Campo Obrigatório"),
        idProposta: z.coerce.number().nonempty("Campo Obrigatório"),
        contrato_validado: z.string().nonempty("Campo Obrigatório"),
        nome: z.string().nonempty("Campo Obrigatório"),
        descricao: z.string().nonempty("Campo Obrigatório"),
        local: z.string().nonempty("Campo Obrigatório")
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
            contrato_: contratoValidada.contrato_validado,
            nome: contratoValidada.nome,
            descricao: contratoValidada.descricao,
            status: 'ATIVO',
            local: contratoValidada.local    
        });

            res.status(200).json({
                idCliente,
                idProposta,
                contrato_,
                nome,
                descricao,
                status: contrato.status,
                local
            });
        } catch (error) {
            res.status(500).json({ message: "Erro ao criar contrato", error });
        }
}

async function getContratos(req, res) {
    const contratos = await Contratos.findAll({include: ['cliente_contrato', 'proposta']});

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


export default { createContrato, getContratos, getContratoId }