import z, { includes } from 'zod'
import DiarioDeObra from "../models/diarioDeObra.js";
import ItensDoDia from '../models/itensDoDia.js';

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


    const { itensDoDia } = req.body;

    const novosItensDoDia = await Promise.all(
        itensDoDia.map(async (item) => {
            const {
                idQuantitativa,
                descricao,
                quantidade,
            } = item;

            return await ItensDoDia.create({
                idDiarioDeObra: diarioDeObra.id, // associa ao diário criado
                idQuantitativa,
                descricao,
                quantidade,
            });
        })
    );


    console.log(diarioDeObra);

    res.status(200).json(diarioDeObra);

}

const { DiarioDeObra, ItensDoDia } = require('../models');

async function getDiarioDeObraComItens(req, res) {
  try {
    const { id } = req.params; // id do diário de obra
    const diario = await DiarioDeObra.findByPk(id, {
      include: "itensDoDia"
    });

    if (!diario) {
      return res.status(404).json({ error: 'Diário de obra não encontrado' });
    }

    res.json(diario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default { createDiarioDeObra, getDiarioDeObraComItens }