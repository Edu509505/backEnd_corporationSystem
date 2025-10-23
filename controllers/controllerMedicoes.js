import Medicoes from "../models/medicoes.js";
import z from "zod";

const medicoesSechema = z.object({
    idCliente: z.coerce.number(1),
    idProposta: z.coerce.number(1),
    local: z.string(3),
    data: z.coerce.date(1),
    periodo: z.string(1),
    valorTotal: z.coerce.number(1)
})

async function createMedicao(req, res) {
    try {
        const informacoesValidadas = await medicoesSechema.safeParseAsync(req.body)
        res.status(200).json(informacoesValidadas.data)

    if (!informacoesValidadas.success) return res.status(400).json(informacoesValidadas.error)
        
    await Medicoes.create(informacoesValidadas.data)
    } catch (e) {
        console.log('e', e);
        res.status(500);
    }

}

export default { createMedicao }
