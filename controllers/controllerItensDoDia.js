import z from 'zod';
import ItensDoDia from "../models/itensDoDia.js";

const validaItensDoDia = z.object({
    idDiaDeObra: z.coerce.number(),
    descricao: z.string().min(1),
    itemQuantativa: z.string().min(1),
    quandtidade: z.coerce.number().min(1),
});

async function createItensDoDia(req, res) {
    const resposta = await validaItensDoDia.safeParseAsync(req.body);

    if (!resposta.success) {
        return res.status(400).json(resposta.error);
    }

    const itensValidado = resposta.data;

    const itensDoDia = await ItensDoDia.create({
        idDiaDeObra: itensValidado.idDiaDeObra,
        descricao: itensValidado.descricao,
        itemQuantativa: itensValidado.itemQuantativa,
        quandtidade: itensValidado.quandtidade,
    });

    console.log(itensDoDia);

    res.status(200).json(itensDoDia);

}


export default { createItensDoDia }