import z from "zod"
import ItensMedicao from "../models/itensMedicao"

const itensMedicaoSchema = z.object({
    idMedicao: z.number().min(1), 
    descricao: z.string().min(3, "Coloque uma descrição Válida"),
    medida: z.string().min(1, "Coloque uma unidade de medida Válida"),
    valorUnitario: z.number().min(1),
    quantidade: z.number().min(1),
    valorSomado: z.number().min(1)
})

async function createItemMedicao(req, res){
    const verificacao = await itensMedicaoSchema.parseAsync(req.body)
    const itensMedicao = await ItensMedicao.create(verificacao)
    console.log(itensMedicao)

    if(itensMedicao) res.status(200).json(itensMedicao)
    else res.status(500).json({ message: 'Não foi possível criar' })
}

export default { createItemMedicao }