import Clientes from './clientes'
import Contratos from './contratos'
import Medicoes from './medicoes'
import Proposta from './propostas'

Clientes.hasMany(Contratos)
Clientes.hasMany(Proposta)

Proposta.belongsTo(Clientes)
Contratos.belongsTo(Clientes)
Medicoes.belongsTo(Contratos)




/*

- 1:1 (um para um) → .hasOne() e .belongsTo()
👉 Um registro está ligado a um único do outro lado (ex: um usuário tem uma carteira).
- 1:N (um para muitos) → .hasMany() e .belongsTo()
👉 Um registro pode se ligar a vários outros (ex: um usuário tem vários pedidos).
- N:1 (muitos para um) → .belongsTo()
👉 Vários registros pertencem a um só (ex: vários pedidos pertencem a um usuário). Geralmente já vem embutido no “outro lado” do 1:N.
- N:N (muitos para muitos) → .belongsToMany() com through
👉 Cada lado pode se relacionar com vários do outro, e precisa de uma tabela intermediária (ex: alunos e turmas).

*/
