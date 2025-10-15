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
import controllerMedicoes from "./controllers/controllerMedicoes.js";
import controllerPropostas from "./controllers/controllerPropostas.js";
import controllerLogin from "./controllers/controllerLogin.js";
import controllerUser from "./controllers/controllerUser.js";
import controllerVersionamento from "./controllers/controllerVersionamento.js";
import controllerrQuantitativa from "./controllers/controllerQuantitativa.js";
import AnexoVersionamento from "./models/anexoVersionamento.js";
import controllerDiarioDeObra from "./controllers/controllerDiarioDeObra.js";
import controllerItensDoDia from "./controllers/controllerItensDoDia.js";
//import controllerAnexoVersionamento from "./controllers/controllerAnexoVersionamento.js";
const router = Router();

router.post('/login', controllerLogin.login);

router.post('/usuario', controllerUser.createUsuario);
router.get('/usuarios', controllerUser.getUsuario);
router.put('/usuario/:id', controllerUser.updateUsuario);

router.get('/clientes', controllerClientes.getCliente);
router.get('/cliente/:id', controllerClientes.getClientId);
router.post('/clientes', controllerClientes.createCliente);
router.put('/cliente/:id', controllerClientes.updateCliente);

router.get('/clientes/:id/contratos', controllerClientes.getClienteContrato);

router.get('/contratos', controllerContrato.getContratos);
router.get('/contrato/:id', controllerContrato.getContratoId);
router.post('/contrato', pastaTemp.array('anexo', 10), controllerContrato.createContrato);

router.get('/medicoes', controllerMedicoes.getMedicoes);
router.post('/medicoes', controllerMedicoes.createMedicao);

router.post('/proposta', pastaTemp.array('files', 10), controllerPropostas.createProposta);
router.get('/proposta/:id', controllerPropostas.getProposta);
router.get('/propostas', controllerPropostas.getPropostas);
router.get('/cliente/:id/propostasAprovadas/', controllerPropostas.getPropostasAprovadas)
router.post(
    '/proposta/:idProposta/versao',
    pastaTemp.array('files', 10),
    controllerVersionamento.createVersionamento
);
router.get('/proposta/:id/versionamentoAprovado/', controllerPropostas.getPropostaVersionamentoAprovado)

router.get('/versionamento/:id', controllerVersionamento.getVersionamento);
router.get('/versionamentos', controllerVersionamento.getVersionamentos);
router.get('/proposta/:idProposta/versionamentos', controllerVersionamento.getPropostaVersionamentos);
router.put('/versionamento/:id', controllerVersionamento.updateVersionamento);

router.post('/quantitativa', controllerrQuantitativa.createQuantitativa);
router.get('/quantitativa/:idVersionamento', controllerrQuantitativa.getQuantitativas);
router.put('/quantitativa/:id', controllerrQuantitativa.updateQuantitativa);

router.get('/versionamento/:idVersionamento/anexos/urls', controllerVersionamento.getImageVersionamento);

router.post('/diarioDeObra', controllerDiarioDeObra.createDiarioDeObra);
router.get('/diarioDeObra/:id', controllerDiarioDeObra.getDiarioDeObra);


router.post('/itensDoDia', controllerItensDoDia.createItensDoDia)


router.post('/versionamento/:idProposta', controllerVersionamento.createVersionamento);

// router.post('/anexoVersionamento', controllerAnexoVersionamento.uploadAnexoVersionamento)

//router.post('/image/upload/formdata', pastaTemp.single('file'), imageController.uploadImageFormData);

export default router