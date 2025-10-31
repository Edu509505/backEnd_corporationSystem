import bcrypt from "bcrypt";
import Usuarios  from "../models/usuarios.js";

async function criarUsuario() {
  const senha = "senha123";
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const novoUsuario = await Usuarios.create({
    username: "João da Silva",
    email: "joao@email.com",
    password: senhaCriptografada,
    role: "plebe", // ou "adm"
  });

  console.log("Usuário criado:", novoUsuario.toJSON());
}

criarUsuario().catch(console.error);
