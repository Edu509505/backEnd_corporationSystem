import ItensDoDia from "../models/itensDoDia.js";

async function tudoDoitensDoDia (req, res){
    const tudo = await ItensDoDia.findAll({include: 'diarioDeObraItensDia'})

    res.json(tudo)
}

export default {tudoDoitensDoDia}