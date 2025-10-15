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

    console.log(itensValidado)

    try {
        const itensDoDia = await ItensDoDia.create(itensValidado);
        res.status(200).json(itensDoDia);
    } catch (erro) {
        console.error("Erro ao criar item:", erro);
        res.status(500).json({ mensagem: "Erro interno ao salvar item." });
    }

}


export default { createItensDoDia }