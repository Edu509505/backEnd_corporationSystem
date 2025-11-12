import sequelize from "../db/database.js";
import dayjs from "dayjs";

async function dashboard(req, res) {
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
        itensDoDia i ON i.idDiarioDeObra = d.id
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

export default { dashboard };