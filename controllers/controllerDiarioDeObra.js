import z from 'zod'
import DiarioDeObra from "../models/diarioDeObra.js";

const validaDiarioDeObra = z
    .object({
        idProposta: z.coerce.number().optional(),
        dataDia: z.coerce.date(),
    })

async function createDiarioDeObra(req, res) {
    const resposta = await validaDiarioDeObra.safeParseAsync(req.body);


    if (!resposta.success) {
        return res.status(400).json(resposta.error)
    }

    const diarioValidado = resposta.data;
    console.log(diarioValidado.dataDia)

    const diarioDeObra = await DiarioDeObra.create({
        idProposta: diarioValidado.idProposta,
        dataDia: diarioValidado.dataDia,
    });

    console.log(diarioDeObra);

    res.status(200).json(diarioDeObra);

}

async function getDiarioDeObra(req, res) {
    const { idProposta, nomeDaProposta } = req.params
    const diario = await DiarioDeObra.findAll({
        where: {
            idProposta: idProposta,
            nomeDaProposta: nomeDaProposta
        }
    })

    if (!diario) {
        res.status(404).json({ message: 'Não foi possivel encontrar' })
    }

    res.status(200).json(diario);
}


export default { createDiarioDeObra, getDiarioDeObra }