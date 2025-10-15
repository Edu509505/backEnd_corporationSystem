import z from 'zod';
import ItensDoDia from "../models/itensDoDia.js";

const validaItensDoDia = z.object({
    idDiarioDeObra: z.coerce.number(),
    descricao: z.string().min(1),
    itemQuantitativa: z.string().min(1),
    quantidade: z.coerce.number().min(1),
});

async function createItensDoDia(req, res) {
    const resposta = await validaItensDoDia.safeParseAsync(req.body);

    if (!resposta.success) {
        return res.status(400).json(resposta.error);
    }

    const itensValidado = resposta.data;

    const itensDoDia = await ItensDoDia.create({
        idDiarioDeObra: itensValidado.idDiarioDeObra,
        descricao: itensValidado.descricao,
        itemQuantitativa: itensValidado.itemQuantitativa,
        quantidade: itensValidado.quantidade,
    });

    console.log(itensDoDia);

    res.status(200).json(itensDoDia);

}


export default { createItensDoDia }