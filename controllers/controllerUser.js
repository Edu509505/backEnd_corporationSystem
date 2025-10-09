import Usuarios from "../models/usuarios.js";
import z from "zod";

const validaSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(6).max(100),
});

async function createUsuario(req, res) {
  const resposta = await validaSchema.safeParseAsync(req.body);

  if (!resposta.success) {
    return res.status(400).json(resposta.error)
  }

  const propostaValidada = resposta.data;

  const usuario = await Usuarios.create({
    username: propostaValidada.username,
    email: propostaValidada.email,
    password: propostaValidada.password,
    path
  });

  if (usuario) {
    res.status(200).json({ usuario, message: 'Usuario criado com sucesso' })
  } else {
    res.status(500).json({ message: 'Não foi possivel criar' })
  }
}

async function getUsuario(req, res) {
  const usuarios = await Usuarios.findAll()

  if (usuarios) {
    res.json(Usuarios.map(Usuarios => Usuarios.toJSON()))
  } else {
    res.status(500).json({ message: 'Não foi possível buscar usuários' })
  }
}

async function updateUsuario(req, res) {
  const resposta = await validaSchema.safeParseAsync(req.body);
  if (!resposta.success) {
    return res.status(400).json(resposta.error)
  }

  try {
    const { id } = req.params
    const { username, email, password } = resposta.data

    const [rowsUpdate] = await Usuarios.update(
      { username, email, password, path },
      { where: { id } }
    )
    if (rowsUpdate === 0) {
      return res.status(404).json({ message: 'Não foi possível atualizar' })
    }
    res.status(200).json({ message: 'Usuario Atualizado' })
  } catch {
    res.status(500).json({ message: 'Erro ao atualizar Usuario' })
  }
}

export default { createUsuario, getUsuario, updateUsuario }