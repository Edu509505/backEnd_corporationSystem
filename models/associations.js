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
import Faturamento from './faturamento.js';
import AnexoFaturamento from './anexosFaturamento.js'
import { MEDIUMINT } from 'sequelize';


Clientes.hasMany(Contratos, { foreignKey: "idCliente" });
Contratos.belongsTo(Clientes, { foreignKey: "idCliente", as: "cliente_contrato" });
//Clientes.hasMany(Proposta, {foreignKey: "idCliente"})

// UM CLIENTE ESTÁ ATRELADO A VÁRIAS PROPOSTA - 1:N
Clientes.hasMany(Proposta, { foreignKey: "idCliente" });
Proposta.belongsTo(Clientes, { foreignKey: "idCliente", as: "cliente" });

//UMA PROPOSTA TERÁ VÁRIOS VERSIONAMENTO - 1:N
Proposta.hasMany(Versionamento, { foreignKey: "idProposta", as: "propostaVersionamento" });
//Varios versionamento pertencem a uma proposta - N:1
Versionamento.belongsTo(Proposta, { foreignKey: "idProposta" });

//N:1
Anexo.belongsTo(Versionamento, { foreignKey: "idVersionamento" });


// //1:N
Medicoes.hasMany(DiarioDeObra, { foreignKey: "idMedicao" });
// //N:1
DiarioDeObra.belongsTo(Medicoes, { foreignKey: "idMedicao", as: "diarioDeObraMedicao" });

//1:N
Proposta.hasMany(Medicoes, { foreignKey: "idProposta", as: "clienteMedicao" });

//N:1
Medicoes.belongsTo(Proposta, { foreignKey: "idProposta", as: "propostaMedicao" });
Medicoes.belongsTo(Contratos, { foreignKey: "idContrato", as: "contratoMedicao" });
Medicoes.belongsTo(Clientes, { foreignKey: "idCliente", as: "clienteMedicao" })

//N:1
Quantitativa.belongsTo(Versionamento, { foreignKey: "idVersionamento" });
Versionamento.hasMany(Quantitativa, { foreignKey: "idVersionamento", as: "quantitativa" });

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
ItensDoDia.belongsTo(DiarioDeObra, { foreignKey: "idDiarioDeObra", as: "diarioDeObraItensDia" });

//N:1
ItensDoDia.belongsTo(Quantitativa, { foreignKey: "idQuantitativa", as: "quantitativa" });
// 1:N
Quantitativa.hasMany(ItensDoDia, { foreignKey: "idQuantitativa" });

//N:1
Faturamento.belongsTo(Medicoes, { foreignKey: "idMedicao", as: "medicaoFaturamento" });
Faturamento.belongsTo(Clientes, { foreignKey: "idCliente", as: "clienteFaturamento" });
Faturamento.belongsTo(Proposta, { foreignKey: "idProposta", as: "propostaFaturamento" })
Faturamento.belongsTo(AnexoFaturamento, { foreignKey: "idFaturamento", as: "anexoFaturamento" })
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
