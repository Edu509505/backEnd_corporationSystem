import z, { includes } from 'zod'
import DiarioDeObra from "../models/diarioDeObra.js";
import ItensDoDia from '../models/itensDoDia.js';
import Quantitativa from '../models/quantitativa.js';

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

async function getDiarioDeObraPorProposta(req, res) {
  const { idProposta } = req.params;

  try {
    const diarios = await DiarioDeObra.findAll({
      where: { idProposta },
      include: [
        {
          model: ItensDoDia,
          as: 'itensDoDia',
          include: 'quantitativa'  // nome do alias usado no relacionamento
        },
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
          model: ItensDoDia,
          as: 'itensDoDia',
          include: 'quantitativa'  
        },
      ],
      order: [['dataDia', 'DESC']], // opcional: ordena por data
    });

    res.status(200).json(diarios);
  } catch (error) {
    console.error('Erro ao buscar diários de obra:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
}

async function getDiarioDeObraParaGrafico(req, res){
  //const {} = req.params
  const diarioDeObra = await DiarioDeObra.sequelize.query('SELECT do.idProposta, do.dataDia, i.sum(quantidade), q.unidadeDeMedida, q.descricao FROM itensDia AS i JOIN diarioDeObra AS do ON i.idDiarioDeObra = do.id JOIN quantitativa AS q on i.idQuantitativa = q.id WHERE q.descricao = "calçamento" GROUP BY q.unidadeDeMedida, do.idProposta, do.dataDia, q.descricao')
  
  console.log("DIARIO DE OBRA", diarioDeObra)

  // .findAll({
  //   include: "itensDoDia"
  // })

  

  if(!diarioDeObra) return res.status(404).json({ error: "Nada encontrada"});

  res.status(200).json(diarioDeObra)
}

export default { createDiarioDeObra, getDiarioDeObraPorProposta, getTodosOsDiariosDeObra, getDiarioDeObraParaGrafico }