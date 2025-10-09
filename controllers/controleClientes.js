import Clientes from "../models/clientes.js";
import Contratos from "../models/contratos.js";
import { cnpj } from "cpf-cnpj-validator";
import z from "zod"

const criarClienteSchema = z.object({
  cliente: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  cnpj: z
    .string()
    .min(18, "Escreva um cnpj válido")
    .refine((val) => cnpj.isValid(val), "Cnpj Inválido")
    .nonempty("Campo Obrigatório"),
  local: z
    .string()
    .min(3, "Escreva um nome válido")
    .nonempty("Campo Obrigatório"),
  status: z.enum(["ATIVO", "INATIVO"])
})

async function createCliente(req, res) {
  const verificar = await criarClienteSchema.parseAsync(req.body)
  const clientes = await Clientes.create(verificar)

  if (clientes) {
    res.status(200).json(verificar)
  } else {
    res.status(500).json({ message: 'Não foi possivel criar' })
  }
}

async function getCliente(req, res) {
  const clientes = await Clientes.findAll()

  if (clientes) {
    res.json(clientes.map(clientes => clientes.toJSON()))
  } else {
    res.status(500).json({ message: 'Não foi possível buscar usuários' })
  }
}

async function getClientId(req, res) {
  const { id } = req.params;

  try {
    const getClient = await Clientes.findByPk(id);

    if (getClient) {
      res.json(getClient.toJSON());
    } else {
      res.status(404).json({ message: "Não foi possível encontrar" })
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao encotrar", error })
  }
}

async function updateCliente(req, res) {
  const verificar = await criarClienteSchema.safeParseAsync(req.body)

  // const visualizarAtualizcao = await 

  if (!verificar.success) return res.status(400).json(verificar.error)
  try {
    const { id } = req.params
    const [rowsUpdate] = await Clientes.update(
      verificar.data,
      { where: { id } }
    )
    if (rowsUpdate === 0) {
      return res.status(400).json({ message: 'Não foi possível atualizar' })
    }
    res.status(200).json(verificar, { message: 'Cliente Atualizado' })
  } catch {
    res.status(500).json(verificar, { message: 'Erro ao atualizar Cliente' })
  }
}

async function getClienteContrato(req, res) {
  try {
    const { id } = req.params;

    const requestCliente = await Clientes.findByPk(id, {
      include: {
        model: Contratos,
        as: 'contratos',
        attributes: ['id', 'idCliente', 'idProposta', 'contrato', 'nome', 'descricao', 'status', 'local']
      }
    });

    if (!requestCliente) {
      return res.status(404).json({ message: 'O cliente não foi encontrado' });
    }

    res.json(requestCliente.contratos);

  } catch (error) {
    console.error('Erro ao buscar cliente e contratos:', error);
    res.status(500).json({ message: 'Erro ao encontrar cliente e contratos', error });
  }
}




export default { createCliente, getCliente, getClientId, getClienteContrato, updateCliente }