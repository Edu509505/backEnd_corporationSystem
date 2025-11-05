import sequelize from "../db/database.js"

async function dashboard(req, res) {
  const { periodoInicial, periodoFinal } = req.params;

  try {
    const [data] = await sequelize.query(
      `
      SELECT 
        d.dataDia,
        SUM(i.quantidade) AS total_m2
      FROM 
        DiarioDeObra d
      JOIN 
        ItensDoDia i ON i.idDiarioDeObra = d.id
      WHERE 
        d.dataDia BETWEEN :periodoInicial AND :periodoFinal
      GROUP BY 
        d.dataDia
      ORDER BY 
        d.dataDia ASC;
      `,
      {
        replacements: { periodoInicial, periodoFinal },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
}

export default { dashboard }