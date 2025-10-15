import Medicoes from "../models/medicoes.js";
import z from "zod";

const validaSchemaMedicao = z
    .object({
        idCliente: z.coerce.number(),
        idProposta: z.coerce.number(),
        idContrato: z.coerce.number(),
        idDiarioDeObra: z.coerce.number(),
        obra: z.string().min(1),
        local: z.string().min(1),
        periodo: z.coerce.date(),
        tipo: z.string().min(1),
        observacoes: z.string().min(1),
        quantidade: z.coerce.number(),
        valorUnitario: z.coerce.number(),
        valor: z.coerce.number(),
        valorTotalDaMedicao: z.coerce.number()
    })
    .refine(
        (data) =>
            (data.idProposta && !data.idContrato) ||
            (!data.idProposta && data.idContrato),
    );



async function createMedicao(req, res) {
   const resposta = await validaSchemaMedicao.safeParseAsync(req.body);


    if (!resposta.success) {
        return res.status(400).json(resposta.error)
    }

    const medicaoValidada = resposta.data;
    console.log('medicaoValidada', medicaoValidada);
    

    const medicoes = await Medicoes.create({
        idCliente: medicaoValidada.idCliente,
        idProposta: medicaoValidada.idProposta ?? null,
        idContrato: medicaoValidada.idContrato ?? null,
        obra: medicaoValidada.obra,
        local: medicaoValidada.local,
        periodo: medicaoValidada.periodo,
        tipo: medicaoValidada.tipo,
        observacoes: medicaoValidada.observacoes,
        quantidade: medicaoValidada.quantidade,
        valorUnitario: medicaoValidada.valorUnitario,
        valor: medicaoValidada.valor,
        valorTotalDaMedicao: medicaoValidada.valorTotalDaMedicao
    });

    console.log('medicoes', medicoes);

    res.status(200).json(medicoes);
}


async function getMedicao(req, res) {
    const { id } = req.params;

    const medicao = await Medicoes.findByPk(id);

    if (medicao) {
        res.status(200).json(medicao.toJSON());
    } else {
        res.status(500).json({ message: 'Não foi possível encontrar esta medição' });
    }
}

async function getMedicoes(req, res) {
    const medicoes = await Medicoes.findAll()

    if (medicoes) {
        res.json(medicoes.map(medicoes => medicoes.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}

export default { createMedicao, getMedicao, getMedicoes }