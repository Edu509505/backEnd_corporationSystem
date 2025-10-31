import bcrypt from "bcrypt";
import Usuarios  from "../models/usuarios.js";

async function criarUsuario() {
  const senha = "@_SenhaMaisDificilDesseMundo123_@";
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const novoUsuario = await Usuarios.create({
    username: "Eduardo Nascimento",
    email: "tio.edu@email.com",
    password: senhaCriptografada,
    role: "plebe", // ou "adm"
  });

  console.log("Usuário criado:", novoUsuario.toJSON());
}

criarUsuario().catch(console.error);
