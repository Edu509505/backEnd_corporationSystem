import { readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import z from 'zod';
import dayjs from 'dayjs';
import { Op } from 'sequelize';
//import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import Proposta from "../models/propostas.js";
import Versionamento from "../models/versionamento.js";
import AnexoVersionamento from '../models/anexoVersionamento.js';

const validacaoSchema = z.object({
    idCliente: z.coerce.number(),
    nomeDaProposta: z.string(),
    descricao: z.string(),
    valorProposta: z.coerce.number(),
    statusProposta: z.enum(['EM_ANALISE', 'APROVADA', 'REPROVADA']).default('EM_ANALISE')
});



async function createProposta(req, res) {
    const resposta = await validacaoSchema.safeParseAsync(req.body);

    if (!resposta.success) {
        return res.status(400).json(resposta.error)
    }

    const propostaValidada = resposta.data;

    try {
        const proposta = await Proposta.create({
            idCliente: propostaValidada.idCliente,
            nomeDaProposta: propostaValidada.nomeDaProposta,
            descricao: propostaValidada.descricao,
            valorProposta: propostaValidada.valorProposta,
            statusProposta: 'EM_ANALISE'
        });

        const versionamento = await Versionamento.create({
            idProposta: proposta.id,
            versao: 1,
            status: 'EM_ANALISE'
        });

        // Processar múltiplos arquivos
        if (req.files && req.files.length > 0) {
            // Iterar sobre cada arquivo enviado
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];

                // Caminho do arquivo
                const filePath = path.join(import.meta.dirname, '..', 'temp', file.filename);
                console.log('filePath', filePath);

                // Ler o arquivo
                const fileContent = readFileSync(filePath);

                // Extrair extensão do arquivo
                const extensaoDoArquivo = file.originalname.split('.').reverse()[0];

                // Upload para S3 - cada arquivo com nome único
                const s3Key = `/${versionamento.idProposta}/${versionamento.id}.${extensaoDoArquivo}`;
                const command = new PutObjectCommand({
                    Bucket: 'anexo-versionamento',
                    Key: s3Key,
                    Body: fileContent
                });

                await s3.send(command);

                // Salvar referência no banco para cada arquivo
                await AnexoVersionamento.create({
                    idVersionamento: versionamento.id,
                    path: s3Key // salva o caminho direto do s3
                });
            }
        }

        console.log("Quantidade de arquivos recebidos:", req.files ? req.files.length : 0);
        console.log("Arquivos processados:", req.files ? req.files.map(f => f.originalname) : []);


        res.status(200).json({
            idCliente: proposta.idCliente,
            nomeDaProposta: proposta.nomeDaProposta,
            descricao: proposta.descricao,
            valorProposta: proposta.valorProposta,
            statusProposta: proposta.statusProposta,
            id: proposta.id,
        });

    } catch (error) {
        console.error('Erro ao criar proposta:', error);
        res.status(500).json({ message: 'Não foi possível criar a proposta' });
    }
}

// async function createProposta(req, res) {
//     const { idCliente, nomeDaProposta, descricao } = req.body
//     // const extensao = req.files.originalname.split('.').reverse()[0]
//     // console.log('req.file arrumado ', extensao);

//     const proposta = await Proposta.create({ idCliente, nomeDaProposta, descricao })

//     const versionamento = await Versionamento.create({ idProposta: proposta.id, versao: 1, status: 'EM_ANALISE' });

//     //UPANDO ARQUIVO
//     const filePath = path.join(import.meta.dirname, '..', 'temp', req.files.filename);
//     //Explicando a linha: o path.join() é uma função que junta diferentes partes de um caminho,
//     // o import.meta.dirname está dizedo para o código "Estou nessa pasta"
//     // logo após os '..', 'temp' é como se você estivesse fazendo '../temp/arquivo
//     // req.file.filename é o nome do aqrquivo que eu estou colocando em meu diretório


//     console.log('filePath', filePath)

//     const file = readFileSync(filePath);
//     //essa variável está lendo o arquivo

//     const extensaoDoArquivo = req.files.originalname.split('.').reverse()[0];

//     const command = new PutObjectCommand({
//         Bucket: 'anexo-versionamento',
//         Key: `/${versionamento.idProposta}/${versionamento.id}.${extensaoDoArquivo}`,
//         Body: file
//     });

//     await s3.send(command);

//     await AnexoVersionamento.create({ idVersionamento: versionamento.id, path: filePath })

//     if (proposta) {
//         res.status(200).json({ idCliente, nomeDaProposta, descricao, id: proposta.id })
//     } else {
//         res.status(500).json({ message: 'Não foi possivel criar' })
//     }
// }

async function getProposta(req, res) {
    const { id } = req.params

    const proposta = await Proposta.findByPk(id, { include: 'cliente' });

    if (proposta) {
        res.status(200).json(proposta.toJSON());
    } else {
        res.status(500).json({ message: 'Não foi possível buscar por essa proposta!' });
    }
}

async function getPropostas(req, res) {
    const propostas = await Proposta.findAll({ include: 'cliente' });

    if (propostas) {
        res.json(propostas.map(propostas => propostas.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}

async function getPropostasAprovadas(req, res) {
    const { id } = req.params
    const getPropostasAprovadas = await Proposta.findAll({ where: { idCliente: id, statusProposta: 'APROVADA' } })

    if (getPropostasAprovadas) {
        res.json(getPropostasAprovadas.map(propostasAprovadas => propostasAprovadas.toJSON()))
    }
}

async function getTodasAsPropostasAprovadas(req, res) {
    const getPropostasAprovadas = await Proposta.findAll({ where: { statusProposta: 'APROVADA' } })

    if (getPropostasAprovadas) {
        res.json(getPropostasAprovadas.map(propostasAprovadas => propostasAprovadas.toJSON()))
    }
}

async function getPropostaVersionamentoAprovado(req, res) {
    const { id } = req.params
    const versionamentoAprovado = await Proposta.findByPk(id, { include: "propostaVersionamento", where: { status: "APROVADA" } })

    console.log("versionamentoAprovado", versionamentoAprovado.toJSON())

    if (versionamentoAprovado) {
        res.status(200).json(versionamentoAprovado)
    }
}

async function getTodasPropostasAprovadas(req, res) {
    try {
        const propostasAprovadas = await Proposta.findAll({
            where: { statusProposta: 'APROVADA' }
        });
        // || propostasAprovadas.length === 0
        if (!propostasAprovadas) {
            return res.status(404).json({ message: "Nenhuma proposta aprovada encontrada" });
        }

        const propostasFiltradas = propostasAprovadas.map(proposta => ({
            id: proposta.id,
            idCliente: proposta.idCliente,
            nomeDaProposta: proposta.nomeDaProposta,
            descricao: proposta.descricao
        }));

        res.status(200).json(propostasFiltradas);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar propostas aprovadas", error: error.message });
    }

}

async function getPropostasEmAnalise(req, res) {
    try {
        const propostasEmAnalise = await Proposta.findAll({
            where: { statusProposta: 'EM_ANALISE' }
        });

        if (propostasEmAnalise.length === 0) {
            return res.status(404).json({ message: "Nenhuma proposta em análise encontrada" });
        }

        return res.status(200).json(propostasEmAnalise);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar propostas em análise", error: error.message });
    }
}


async function updateProposta(req, res) {
    const { id } = req.params;
    const { nomeDaProposta, descricao, valorProposta, statusProposta } = req.body;

    try {
        const proposta = await Proposta.findByPk(id);

        if (!proposta) {
            return res.status(404).json({ message: 'Proposta não encontrada' });
        }

        proposta.nomeDaProposta = nomeDaProposta;
        proposta.descricao = descricao;
        proposta.valorProposta = valorProposta;
        proposta.statusProposta = statusProposta;

        await proposta.save();

        res.status(200).json(proposta);
    } catch (error) {
        console.error('Erro ao atualizar proposta:', error);
        res.status(500).json({ message: 'Não foi possível atualizar a proposta' });
    }
}


async function getComparacaoPropostas(req, res) {
    try {
        // Datas de início e fim do mês atual
        const inicioMesAtual = dayjs().startOf('month').toDate();
        const fimMesAtual = dayjs().endOf('month').toDate();

        // Datas de início e fim do mês anterior
        const inicioMesAnterior = dayjs().subtract(1, 'month').startOf('month').toDate();
        const fimMesAnterior = dayjs().subtract(1, 'month').endOf('month').toDate();

        // Contar propostas do mês atual
        const totalMesAtual = await Proposta.count({
            where: {
                createdAt: {
                    [Op.between]: [inicioMesAtual, fimMesAtual]
                }
            }
        });

        // Contar propostas do mês anterior
        const totalMesAnterior = await Proposta.count({
            where: {
                createdAt: {
                    [Op.between]: [inicioMesAnterior, fimMesAnterior]
                }
            }
        });

        // Retornar os dados como JSON
        return res.status(200).json({
            mesAtual: totalMesAtual,
            mesAnterior: totalMesAnterior,
            diferenca: totalMesAtual - totalMesAnterior,
            variacaoPercentual: totalMesAnterior === 0
                ? null
                : (((totalMesAtual - totalMesAnterior) / totalMesAnterior) * 100).toFixed(2)
        });

    } catch (error) {
        console.error('Erro ao buscar comparação de propostas:', error);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
}


export default { createProposta, getProposta, getPropostas, getPropostasAprovadas, getPropostaVersionamentoAprovado, getTodasPropostasAprovadas, getComparacaoPropostas, getTodasAsPropostasAprovadas }
