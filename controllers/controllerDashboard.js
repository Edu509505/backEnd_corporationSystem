import sequelize from "../db/database.js";
import dayjs from "dayjs";

async function dashboarM2(req, res) {
  const { dataInicial, dataFinal } = req.params;

  // Validação básica dos parâmetros
  if (!dataInicial || !dataFinal) {
    return res.status(400).json({ error: 'Parâmetros dataInicial e dataFinal são obrigatórios.' });
  }

  // Validação de formato de data
  const dataInicialValida = dayjs(dataInicial, 'YYYY-MM-DD', true).isValid();
  const dataFinalValida = dayjs(dataFinal, 'YYYY-MM-DD', true).isValid();

  if (!dataInicialValida || !dataFinalValida) {
    return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD.' });
  }

  try {
    const data = await sequelize.query(
      `
      SELECT 
        d.dataDia,
        SUM(i.quantidade) AS total_m2
      FROM 
        diarioDeObras d
      JOIN 
        itensDosDias i ON i.idDiarioDeObra = d.id
      WHERE 
        d.dataDia BETWEEN :dataInicial AND :dataFinal
      GROUP BY 
        d.dataDia
      ORDER BY 
        d.dataDia ASC;
      `,
      {
        replacements: { dataInicial, dataFinal },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log('Dados do dashboard:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error.message, error.stack);
    res.status(500).json({ error: 'Erro interno ao buscar dados do dashboard.' });
  }
}


async function dashboardFaturamentoPorMes(req, res) {
  const { dataMes } = req.params;

  if (!dataMes || !dayjs(dataMes, 'YYYY-MM', true).isValid()) {
    return res.status(400).json({ error: 'Parâmetro dataMes é obrigatório e deve estar no formato YYYY-MM.' });
  }

  const inicioDoMes = dayjs(dataMes, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
  const fimDoMes = dayjs(dataMes, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

  try {
    const resultado = await sequelize.query(
      `
      SELECT
        strftime('%Y-%m', createdAt) AS referencia,
        SUM(valor) AS totalPago
      FROM Faturamentos
      WHERE pagamento = 'PAGA'
        AND createdAt BETWEEN :inicio AND :fim
      GROUP BY referencia;
      `,
      {
        replacements: { inicio: inicioDoMes, fim: fimDoMes },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const referencia = resultado[0]?.referencia || dataMes;
    const totalPago = resultado[0]?.totalPago || 0;

    const nomeMesAbreviado = dayjs(referencia, 'YYYY-MM').format('MMM/YYYY'); // Ex: Nov/2025

    return res.status(200).json({
      mesReferencia: nomeMesAbreviado,
      totalPago,
    });
  } catch (error) {
    console.error('Erro ao buscar faturamento por mês:', error.message, error.stack);
    res.status(500).json({ error: 'Erro interno ao buscar faturamento por mês.' });
  }
}



export default { dashboarM2, dashboardFaturamentoPorMes };