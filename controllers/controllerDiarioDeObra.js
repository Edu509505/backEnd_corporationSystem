import z from 'zod'
import DiarioDeObra from "../models/diarioDeObra.js";
import ItensDoDia from '../models/itensDoDia.js';
import Quantitativa from '../models/quantitativa.js';
import Proposta from '../models/propostas.js';
import Clientes from '../models/clientes.js';
import { Op } from 'sequelize';

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
    dataDia: diarioValidado.dataDia.toISOString().slice(0, 10)
  });

  console.log("Data formatada:", diarioValidado.dataDia.toISOString().slice(0, 10));

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

async function getDiarioDeObraId(req, res) {
  const { idProposta } = req.params;

  try {
    const diarios = await DiarioDeObra.findAll({
      where: { idProposta }
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

async function getDiarioDeObraPorProposta(req, res) {
  const { idProposta } = req.params;

  try {
    const diarios = await DiarioDeObra.findAll({
      where: { idProposta },
      include: [
        {
          model: Proposta,
          as: 'propostaDiario',
          include: {
            model: Clientes,
            as: 'cliente'
          }
        },
        {
          model: ItensDoDia,
          as: 'itensDoDia',
          include: {
            model: Quantitativa,
            as: 'quantitativa'
          }
        }
      ],
    });

    if (diarios.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum diário encontrado para esta proposta.' });
    }

    res.status(200).json(diarios);
  } catch (error) {
    console.error('Erro ao buscar diário de obra:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
}

async function getTodosOsDiariosDeObra(req, res) {
  try {
    const diarios = await DiarioDeObra.findAll({
      include: [
        {
          model: Proposta,
          as: 'propostaDiario',
          include: {
            model: Clientes,
            as: 'cliente'
          }
        },
        // {
        //   model: ItensDoDia,
        //   as: 'itensDoDia',
        //   include: {
        //     model: Quantitativa,
        //     as: 'quantitativa'
        //   }
        // }
      ],
    });

    res.status(200).json(diarios);
  } catch (error) {
    console.error('Erro ao buscar diários de obra:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
}

async function getDiarioDeObraPeriodo(req, res) {
  try {
    const datas = req.params
    console.log("datas da Requisição", datas.idProposta)
    const trazerPeriodo = await DiarioDeObra.findAll(
      {
        where: {
          idProposta: datas.idProposta,
          dataDia: {
            [Op.between]: [datas.dataInicial, datas.dataFinal]
          },
          idMedicao: null,
        },
        include: "itensDoDia"
      })

    res.status(200).json(trazerPeriodo)

  } catch {
    res.status(500).json({ message: "Erro Interno" })
  }
}

async function getDiarioDeObraComMedicaoPeriodo(req, res) {
  try {
    const { idMedicao } = req.params
    const datas = req.params

    const trazerPeriodo = await DiarioDeObra.findAll(
      {
        where: {
          idProposta: datas.idProposta,
          dataDia: {
            [Op.between]: [datas.dataInicial, datas.dataFinal]
          },
          idMedicao: idMedicao,
        },
        include: [
          {
            model: ItensDoDia,
            as: "itensDoDia"
          }
        ]
      });




    console.log(trazerPeriodo)
    if (trazerPeriodo.length == null) return res.status(500).json({ message: "Não foi possível encontrar" })
    res.status(200).json(trazerPeriodo)

  } catch {
    res.status(500).json({ message: "Erro Interno" })
  }
}

export default { createDiarioDeObra, getDiarioDeObraPorProposta, getTodosOsDiariosDeObra, getDiarioDeObraPeriodo, getDiarioDeObraComMedicaoPeriodo, getDiarioDeObraId }