import Clientes from './clientes.js';
import Contratos from './contratos.js';
import Medicoes from './medicoes.js';
import Proposta from './propostas.js';
import Versionamento from './versionamento.js';
import Anexo from './anexoVersionamento.js';
import Quantitativa from './quantitativa.js';


Clientes.hasMany(Contratos, {foreignKey: "idCliente"});
Contratos.belongsTo(Clientes, {foreignKey: "idCliente"});
//Clientes.hasMany(Proposta, {foreignKey: "idCliente"})

// UM CLIENTE ESTÁ ATRELADO A VÁRIAS PROPOSTA - 1:N
Clientes.hasMany(Proposta, {foreignKey: "idCliente"});
Proposta.belongsTo(Clientes,{foreignKey:"idCliente", as: "cliente"});

//UMA PROPOSTA TERÁ VÁRIOS VERSIONAMENTO - 1:N
Proposta.hasMany(Versionamento, {foreignKey: "idProposta"});

Anexo.belongsTo(Versionamento, {foreignKey: "idVersionamento"});
//Versionamento.hasMany(Anexo, {foreignKey: ""})

Medicoes.belongsTo(Contratos);

Quantitativa.belongsTo(Versionamento, {foreignKey: "idVersionamento"});


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
