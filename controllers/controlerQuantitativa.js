import Quantitativa from '../models/quantitativa.js';

async function createQuantitativa(req, res) {
    try {
        const { idVersionamento, numeracao, descricao, quantidade, valorUnitario, unidadeDeMedida, valorTotal } = req.body;

        const novaQuantitativa = await Quantitativa.create({
            idVersionamento,
            numeracao,
            descricao,
            quantidade,
            valorUnitario,
            unidadeDeMedida,
            valorTotal
        });

        return res.status(201).json(novaQuantitativa);
    } catch (error) {
        console.error("Erro ao criar quantitativa:", error);
        return res.status(500).json({ error: "Erro ao criar quantitativa" });
    }
}

async function getQuantitativa(req, res) {
    try {
        const { id } = req.params;
        const quantitativa = await Quantitativa.findByPk(id);

        if (!quantitativa) {
            return res.status(404).json({ error: "Quantitativa não encontrada" });
        }
        return res.status(200).json(quantitativa);
    } catch (error) {
        console.error("Erro ao buscar quantitativa:", error);
        return res.status(500).json({ error: "Erro ao buscar quantitativa" });
    }
}


async function updateQuantitativa(req, res) {
    try {
        const { id } = req.params;
        const {
            idVersionamento,
            numeracao,
            descricao,
            quantidade,
            valorUnitario,
            unidadeDeMedida,
            valorTotal } = req.body;

        const quantitativa = await Quantitativa.findByPk(id);
        if (!quantitativa) {
            return res.status(404).json({ error: "Quantitativa não encontrada" });
        }
        quantitativa.idVersionamento = idVersionamento;
        quantitativa.numeracao = numeracao;
        quantitativa.descricao = descricao;
        quantitativa.quantidade = quantidade;
        quantitativa.valorUnitario = valorUnitario;
        quantitativa.unidadeDeMedida = unidadeDeMedida;
        quantitativa.valorTotal = valorTotal;

        await quantitativa.save();

        return res.status(200).json(quantitativa);
    } catch (error) {
        console.error("Erro ao atualizar quantitativa:", error);
        return res.status(500).json({ error: "Erro ao atualizar quantitativa" });
    }
}


export default { createQuantitativa, getQuantitativa, updateQuantitativa };