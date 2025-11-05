import Medicoes from "../models/medicoes.js";
import DiarioDeObra from "../models/diarioDeObra.js";
import Versionamento from "../models/versionamento.js";
import Quantitativa from "../models/quantitativa.js";
import z from "zod";
import { Op } from 'sequelize';
import { measureMemory } from "node:vm";
import { TransitionDefaultMinimumObjectSize } from "@aws-sdk/client-s3";

const itensMedicaoSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    observacao: z.string(),
    periodoInicial: z.string(),
    periodoFinal: z.string(),
})

async function createMedicao(req, res) {
    try {

        //ANTES DE ENTEDER ESSA LÓGICA, É PRECISO LENMRAR QUE TODO O CALCULO ESTÁ SENDO FEITO AQUI
        //OU SEJA, TODA A LÓGICA QUE FOI IMPLEMENTADA NO FRONT-END DE PEGAR OS VALORES FILTRAR E SOMAR,
        //FOI COLOCADA AQUI, ALÉM DISSO, ESSA LÓGICA TAMBÉM PEGA TODOS OS DIÁRIOS DE OBRA DEFINIDOS PELO PERÍODO
        //E ATUALIZA O CAMPO idMedicao PARA QUE NAS PRÓXIMAS REQUISIÇÕES TODOS OS DIÁRIOS DE OBRA COM ESSE CAMPO
        //PREENCHIDO NÃO APAREÇA PARA SER CALCUADO

        //DESABAFO: AINDA ESTOU PENSADNO EM LARGAR TUDO E VIRAR PEDREIRO 

        console.log(req.body)

        const verificacao = await itensMedicaoSchema.parseAsync(req.body)

        const trazerPeriodo = await DiarioDeObra.findAll(
            {
                where: {
                    idProposta: verificacao.idProposta,
                    dataDia: {
                        [Op.between]: [verificacao.periodoInicial, verificacao.periodoFinal]
                    },
                    idMedicao: null,
                },
                include: "itensDoDia"
            })

        const versionamentoAprovado = await Versionamento.findOne({
            where: {
                idProposta: verificacao.idProposta,
                status: 'APROVADA'
            }
        })

        console.log(versionamentoAprovado)
        const quantitativas = await Quantitativa.findAll({
            where: { idVersionamento: versionamentoAprovado.id }
        });
        console.log("QUANTITATIVAS___________________", quantitativas)
        console.log("TRAZER PERÍODO____________", trazerPeriodo)

        function calculo(val) {
            let resultado = null;
            const calculo = trazerPeriodo
                .map((value) =>
                    value.itensDoDia
                        .map((value2) => value2.idQuantitativa === val && value2.quantidade)
                        .filter((valor) => valor)
                )
                .flat();

            for (let i = 0; i < calculo.length; i++) {
                resultado += calculo[i];
            }

            return resultado;
        }

        //Aqui ele pega tudo já somado e faz a soma final
        //Exemplo: vai pegar todos os resultados da tabela, multiplicar pelo valor definido na quantitativa e logo após isso vai somar tudo

        function resultadosSomados() {
            let resultado = null;
            const resultadoFinal = quantitativas.map(
                (value) => calculo(value.id) * value.valorUnitario
            );

            for (let i = 0; i < resultadoFinal.length; i++) {
                resultado += resultadoFinal[i];
            }

            return resultado;
        }

        console.log("RESULTADOS SOMADOS_______", resultadosSomados() * 100)


        //AQUI ELE CRIA DE FATO A MEDIÇÃO
        const medicao = await Medicoes.create({
            idCliente: verificacao.idCliente,
            idProposta: verificacao.idProposta,
            observacao: verificacao.observacao,
            periodoInicial: verificacao.periodoInicial,
            periodoFinal: verificacao.periodoFinal,
            valorTotal: resultadosSomados() * 100
        })


        const [rowsUpdate] = await DiarioDeObra.update(
            { idMedicao: medicao.id },
            {
                where: {
                    idProposta: verificacao.idProposta,
                    dataDia: {
                        [Op.between]: [verificacao.periodoInicial, verificacao.periodoFinal]
                    },
                    idMedicao: null,
                },
            }
        )

        console.log(rowsUpdate)
        if (rowsUpdate === 0) {
            return res.status(400).json({ message: 'Não foi possível atualizar' })
        }
        else { if (medicao) res.status(200).json(verificacao) }
    } catch {
        res.status(500).json({ message: 'Não foi possível criar' })
    }

}

async function getMedicoes(req, res){
    try{
        const todasAsMedicoes = await Medicoes.findAll({include: ['propostaMedicao', 'clienteMedicao']})
        if(!todasAsMedicoes){
            res.status(404).json({ message: "Não foi possível encontrar" })
        } 

        res.status(200).json(todasAsMedicoes)

    }catch{ 
        res.status(500).json({ message: "Erro no Servidor" })
    }
}

export default { createMedicao, getMedicoes }
