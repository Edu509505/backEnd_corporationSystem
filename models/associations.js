import Clientes from './clientes.js';
import Contratos from './contratos.js';
import Medicoes from './medicoes.js';
import Proposta from './propostas.js';
import Versionamento from './versionamento.js';
import Anexo from './anexoVersionamento.js';
import Quantitativa from './quantitativa.js';
import DiarioDeObra from './diarioDeObra.js';
import ItensDoDia from './itensDoDia.js';
import AnexoContrato from './anexoContratos.js'


Clientes.hasMany(Contratos, { foreignKey: "idCliente" });
Contratos.belongsTo(Clientes, { foreignKey: "idCliente", as: "cliente_contrato" });
//Clientes.hasMany(Proposta, {foreignKey: "idCliente"})

// UM CLIENTE ESTÁ ATRELADO A VÁRIAS PROPOSTA - 1:N
Clientes.hasMany(Proposta, { foreignKey: "idCliente" });
Proposta.belongsTo(Clientes, { foreignKey: "idCliente", as: "cliente" });

//UMA PROPOSTA TERÁ VÁRIOS VERSIONAMENTO - 1:N
Proposta.hasMany(Versionamento, { foreignKey: "idProposta" });
//Varios versionamento pertencem a uma proposta - N:1
Versionamento.belongsTo(Proposta, { foreignKey: "idProposta" });


Anexo.belongsTo(Versionamento, { foreignKey: "idVersionamento" });

//N:1
Medicoes.belongsTo(Contratos);

//N:1
Quantitativa.belongsTo(Versionamento, { foreignKey: "idVersionamento" });
Versionamento.hasMany(Quantitativa, { foreignKey: "idVersionamento", as: "quantitativa"});

//1:1
Proposta.hasOne(Contratos, { foreignKey: "idProposta", as: "contrato" });
Contratos.belongsTo(Proposta, { foreignKey: "idProposta", as: "proposta" });

AnexoContrato.belongsTo(Contratos, { foreignKey: "idContrato" })

//NESSA PARTE SERÁ FEITO REQUISIÇÕES COM VÁRIOS INCLUDES PARA APRESNETAR AS INFORMAÇÕES DOS CONTRATOS
Contratos.belongsTo(Clientes, { foreignKey: "idCliente", as: "clientesContratos" })


//DiarioDeObra pertence a uma proposta
//1:N
Proposta.hasMany(DiarioDeObra, { foreignKey: "idProposta", });
//N:1
DiarioDeObra.belongsTo(Proposta, { foreignKey: "idProposta", as: "propostaDiario" });

//DiarioDeObra tem muitos ItensDoDia 
// 1:N
DiarioDeObra.hasMany(ItensDoDia, { foreignKey: "idDiarioDeObra", as: "itensDoDia" });
//N:1
ItensDoDia.belongsTo(DiarioDeObra, { foreignKey: "idDiarioDeObra", as: "diarioDeObra" });

//DiarioDeObra pertence a um contrato
//N:1
DiarioDeObra.belongsTo(Contratos, { foreignKey: "idContrato" });
//1:N
Contratos.hasMany(DiarioDeObra, { foreignKey: "idContrato", as: "diarioDeObraContrato" });

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
