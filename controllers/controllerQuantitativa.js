import Proposta from '../models/propostas.js';
import Quantitativa from '../models/quantitativa.js';
import Versionamento from '../models/versionamento.js';

async function createQuantitativa(req, res) {
    try {
        const { itens } = req.body;

        const novasQuantitativas = await Promise.all(
            itens.map(async (item) => {
                const {
                    idVersionamento,
                    descricao,
                    quantidade,
                    valorUnitario, // aqui é "valor", não "valorUnitario"
                    unidadeDeMedida,
                } = item;

                return await Quantitativa.create({
                    idVersionamento,
                    descricao,
                    quantidade,
                    valorUnitario: valorUnitario, // se quiser renomear aqui
                    unidadeDeMedida,
                });
            })
        );

        return res.status(201).json(novasQuantitativas);
    } catch (error) {
        console.error("Erro ao criar quantitativa:", error);
        return res.status(500).json({ error: "Erro ao criar quantitativa" });
    }
}


async function getQuantitativas(req, res) {
    try {
        const { idProposta } = req.params;
        console.log('idProposta to aqui', idProposta)

        //query que pega a proposta o versionamento aprovado da proposta que foi mandada

        const versionamentoAprovado = await Versionamento.findOne({
            where: {
                idProposta,
                status: 'APROVADA'
            }
        })

        console.log(versionamentoAprovado)
        const quantitativas = await Quantitativa.findAll({
            where: { idVersionamento: versionamentoAprovado.id }
        });
        console.log(quantitativas)
        if (!quantitativas || quantitativas.length === 0) {
            return res.status(404).json({ error: "Nenhuma quantitativa encontrada" });
        }

        return res.status(200).json(quantitativas);
    } catch (error) {
        console.error("Erro ao buscar quantitativas:", error);
        return res.status(500).json({ error: "Erro ao buscar quantitativas" });
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

async function getIdQuantitativa(req, res) {
    const { id } = req.params

    const quantitativa = await Quantitativa.findByPk(id)

    if (!quantitativa) return res.status(404).json({ error: "Quantitativa não encontrada" });

    res.status(200).json(quantitativa)

}


export default { createQuantitativa, getQuantitativas, updateQuantitativa, getIdQuantitativa };