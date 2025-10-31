import Medicoes from "../models/medicoes.js";
import z from "zod";

const itensMedicaoSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    observacao: z.string(),
    periodoInicial: z.date("Data Inicial Obrigatória"),
    periodoFinal: z.date("Data Final Obrigatória"),
})

async function createMedicao(req, res) {

    console.log(req.body)

    const verificacao = await itensMedicaoSchema.parseAsync(req.body)

    const medicao = await Medicoes.create(verificacao)

    if (medicao) res.status(200).json(verificacao)
    else res.status(500).json({ message: 'Não foi possível criar' })
}

export default { createMedicao }
