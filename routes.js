import { Router } from "express";
import multer from 'multer';

const pastaTemp = multer({
  dest: 'temp/', limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10 // máximo 10 arquivos
  }
});

import controllerClientes from "./controllers/controllerClientes.js";
import controllerContrato from "./controllers/controllerContratos.js";
import controllerPropostas from "./controllers/controllerPropostas.js";
import controllerLogin from "./controllers/controllerLogin.js";
import controllerUser from "./controllers/controllerUser.js";
import controllerVersionamento from "./controllers/controllerVersionamento.js";
import controllerrQuantitativa from "./controllers/controllerQuantitativa.js";
import controllerDiarioDeObra from "./controllers/controllerDiarioDeObra.js";
import controllerAnexoContrato from "./controllers/controllerAnexoContratos.js"
import controllerItensDia from "./controllers/controllerItensDoDia.js"
import authentication from "./middleware/middlewares.js";
import controllerMedicao from "./controllers/controllerMedicoes.js"
import controllerDashBoard from './controllers/controllerDashboard.js'
import controllerFaturamento from './controllers/controllerFaturamento.js'
import controllerAnexoFaturamento from "./controllers/controllerAnexoFaturamento.js";
const router = Router();

router.get("/me", authentication, (req, res) => {
  if (!req.user) {
    return res.status(404).send("Usuário não encontrado");
  }
  const { id, username, email, role } = req.user;
  res.json({ id, name: username, email, role });
});

router.post("/logout", (req, res) => {
  res.clearCookie("authorization", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // true em produção com HTTPS
  });
  res.sendStatus(200);
});


router.post('/login', controllerLogin.login);

router.post('/usuario', authentication, controllerUser.createUsuario);
router.get('/usuarios', authentication, controllerUser.getUsuario);
router.put('/usuario/:id', authentication, controllerUser.updateUsuario);

router.get('/clientes', authentication, controllerClientes.getCliente);
router.get('/cliente/:id', authentication, controllerClientes.getClientId);
router.post('/clientes', authentication, controllerClientes.createCliente);
router.put('/cliente/:id', authentication, controllerClientes.updateCliente);

router.get('/clientes/:id/contratos', authentication, controllerClientes.getClienteContrato);

router.get('/contratos', authentication, controllerContrato.getContratos);
router.get('/contrato/:id', authentication, controllerContrato.getContratoId);
router.post('/contrato', authentication, pastaTemp.array('anexo', 10), controllerContrato.createContrato);
router.get('/contrato/:id/anexoContrato/url', authentication, controllerAnexoContrato.getAnexoContrato)

router.post('/proposta', authentication, pastaTemp.array('files', 10), controllerPropostas.createProposta);
router.get('/proposta/:id', authentication, controllerPropostas.getProposta);
router.get('/propostas', authentication, controllerPropostas.getPropostas);
router.get('/getTodasAsPropostasAprovedas', authentication, controllerPropostas.getTodasAsPropostasAprovadas)
router.get('/cliente/:id/propostasAprovadas/', authentication, controllerPropostas.getPropostasAprovadas)
router.post('/proposta/:idProposta/versao',authentication, pastaTemp.array('files', 10),controllerVersionamento.createVersionamento);
router.get('/proposta/:id/versionamentoAprovado', authentication, controllerPropostas.getPropostaVersionamentoAprovado);
router.get('/proposta/:idProposta/verAprovado', authentication, controllerVersionamento.getPropostaVersionamentoAprovado)
router.get('/propostasAprovadas', authentication, controllerPropostas.getTodasPropostasAprovadas);

router.get('/versionamento/:id', authentication, controllerVersionamento.getVersionamento);
router.get('/versionamentos', authentication, controllerVersionamento.getVersionamentos);
router.get('/proposta/:idProposta/versionamentos', authentication, controllerVersionamento.getPropostaVersionamentos);
router.put('/versionamento/:id', authentication, controllerVersionamento.updateVersionamento);

router.post('/quantitativa', authentication, controllerrQuantitativa.createQuantitativa);
router.get('/quantitativa/:idProposta', authentication, controllerrQuantitativa.getQuantitativas);
router.put('/quantitativa/:id', authentication, controllerrQuantitativa.updateQuantitativa);

router.get('/versionamento/:idVersionamento/anexos/urls', authentication, controllerVersionamento.getImageVersionamento);

router.post('/diarioDeObra', authentication, controllerDiarioDeObra.createDiarioDeObra);
router.get('/diario-de-obra/proposta/:idProposta', authentication, controllerDiarioDeObra.getDiarioDeObraPorProposta);
router.get('/diarioDeObra', authentication, controllerDiarioDeObra.getTodosOsDiariosDeObra);
router.get('/diarioDeObra/:dataInicial/:dataFinal/proposta/:idProposta/medicao/:idMedicao', authentication, controllerDiarioDeObra.getDiarioDeObraComMedicaoPeriodo)
router.get('/diarioDeObraPeriodo/:dataInicial/:dataFinal/proposta/:idProposta', authentication, controllerDiarioDeObra.getDiarioDeObraPeriodo)
router.get('/dashboard/:dataInicial/:dataFinal', authentication, controllerDashBoard.dashboarM2);

router.post('/versionamento/:idProposta', authentication, controllerVersionamento.createVersionamento);

router.get('/todosOsItensDoDia', authentication, controllerItensDia.tudoDoitensDoDia);

router.post('/criarMedicao', authentication, controllerMedicao.createMedicao);

router.post('/criarMedicao', authentication, controllerMedicao.createMedicao)
router.get('/getMedicoes', authentication, controllerMedicao.getMedicoes)
router.get('/getMedicao/:id', authentication, controllerMedicao.getMedicao)
router.get('/getMedicoes/propostas/:idProposta', authentication, controllerMedicao.getMedicaoProposta)
router.post('/criarMedicao', authentication, controllerMedicao.createMedicao);

router.get('/comparacao-propostas', authentication, controllerPropostas.getComparacaoPropostas);
router.get('/propostasEmAnalise', authentication, controllerPropostas.getPropostasEmAnalise);

router.post('/createFaturamento', authentication, pastaTemp.single('anexo'), controllerFaturamento.createFaturamento)
router.get('/getTodosOsFaturamentos', authentication, controllerFaturamento.getFaturamento)
router.get('/getFaturamentoId/:id', authentication, controllerFaturamento.getFaturamentoId)
router.get('/faturamento/:id/anexoFaturamento/url', authentication, controllerAnexoFaturamento.getAnexoFaturamento)
router.put('/updateStatusNotaFiscal/notaFiscal/:id', authentication, controllerFaturamento.updateFaturamento)
router.post('/createFaturamento', authentication, pastaTemp.single('anexo'), controllerFaturamento.createFaturamento);

router.get('/cardFaturamento', authentication, controllerFaturamento.getFaturamentoCard);
router.get('/dashboardFaturamento/:dataMes', controllerDashBoard.dashboardFaturamentoPorMes);
// router.post('/anexoVersionamento', controllerAnexoVersionamento.uploadAnexoVersionamento)

//router.post('/image/upload/formdata', pastaTemp.single('file'), imageController.uploadImageFormData);

export default router