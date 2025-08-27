import Usuarios from "../models/usuarios.js";

async function createUsuario(req, res) {
  const { username, email, password, path } = req.body
  const usuario = await Usuarios.create({ username, email, password, path })

  if (usuario) {
    res.status(200).json({ username, email, password, path })
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

  try {
    const { id } = req.params
    const { username, email, password, path } = req.body

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