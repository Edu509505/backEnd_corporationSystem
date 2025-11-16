import DiarioDeObra from "../models/diarioDeObra.js";
import ItensDoDia from "../models/itensDoDia.js";
import Quantitativa from "../models/quantitativa.js";

async function tudoDoitensDoDia(req, res) {
    const tudo = await ItensDoDia.findAll({ include: 'diarioDeObraItensDia' })

    res.json(tudo)
}

async function itensDoDiaDiario(req, res) {
    const { idDiarioDeObra } = req.params;

    try {
        const diarios = await ItensDoDia.findAll({
            where: { idDiarioDeObra: idDiarioDeObra },
            include: [
                {
                    model: DiarioDeObra,
                    as: "diarioDeObraItensDia"
                },
                {
                    model: Quantitativa,
                    as: "quantitativaItensDia"
                }
            ]
        });

        if (!diarios) {
            return res.status(404).json({ mensagem: 'Não foi possível encontrar' });
        }

        res.status(200).json(diarios);
    } catch (error) {
        console.error('Erro ao buscar diário de obra:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

export default { tudoDoitensDoDia, itensDoDiaDiario }