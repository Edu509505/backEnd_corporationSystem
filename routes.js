import { Router } from "express";
import multer from 'multer';

const pastaTemp = multer({
    dest: 'temp/', limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 10 // máximo 10 arquivos
    }
});

import controleClientes from "./controllers/controleClientes.js";
import controleContrato from "./controllers/controleContratos.js";
import controleMedicoes from "./controllers/controleMedicoes.js";
import controlePropostas from "./controllers/controlePropostas.js";
import controllerLogin from "./controllers/controllerLogin.js";
import controllerUser from "./controllers/controllerUser.js";
import controleVersionamento from "./controllers/controleVersionamento.js";
import controlerQuantitativa from "./controllers/controlerQuantitativa.js";
import AnexoVersionamento from "./models/anexoVersionamento.js";
import controleDiarioDeObra from "./controllers/controleDiarioDeObra.js";
//import controleAnexoVersionamento from "./controllers/controleAnexoVersionamento.js";
const router = Router();

router.post('/login', controllerLogin.login);

router.post('/usuario', controllerUser.createUsuario);
router.get('/usuarios', controllerUser.getUsuario);
router.put('/usuario/:id', controllerUser.updateUsuario);

router.get('/clientes', controleClientes.getCliente);
router.get('/cliente/:id', controleClientes.getClientId);
router.post('/clientes', controleClientes.createCliente);
router.put('/cliente/:id', controleClientes.updateCliente);

router.get('/clientes/:id/contratos', controleClientes.getClienteContrato);

router.get('/contratos', controleContrato.getContratos);
router.get('/contrato/:id', controleContrato.getContratoId);
router.post('/contrato', controleContrato.createContrato);

router.get('/medicoes', controleMedicoes.getMedicoes);
router.post('/medicoes', controleMedicoes.createMedicao);

router.post('/proposta', pastaTemp.array('files', 10), controlePropostas.createProposta);
router.get('/proposta/:id', controlePropostas.getProposta);
router.get('/propostas', controlePropostas.getPropostas);
router.put('/proposta/:id', controlePropostas.updateProposta);

router.post(
    '/proposta/:idProposta/versao',
    pastaTemp.array('files', 10),
    controleVersionamento.createVersionamento
);

router.get('/versionamento/:id', controleVersionamento.getVersionamento);
router.get('/versionamentos', controleVersionamento.getVersionamentos);
router.get('/proposta/:idProposta/versionamentos', controleVersionamento.getPropostaVersionamentos);
router.put('/versionamento/:id', controleVersionamento.updateVersionamento);

router.post('/quantitativa', controlerQuantitativa.createQuantitativa);
router.get('/quantitativa/:idVersionamento', controlerQuantitativa.getQuantitativas);
router.put('/quantitativa/:id', controlerQuantitativa.updateQuantitativa);

router.get('/versionamento/:idVersionamento/anexos/urls', controleVersionamento.getImageVersionamento);

router.post('/diarioDeObra', controleDiarioDeObra.createDiarioDeObra);
router.get('/diarioDeObra/:id', controleDiarioDeObra.getDiarioDeObra);


// router.post('/versionamento/:idProposta', controleVersionamento.createVersionamento);

//router.post('/anexoVersionamento', controleAnexoVersionamento.uploadAnexoVersionamento)

//router.post('/image/upload/formdata', pastaTemp.single('file'), imageController.uploadImageFormData);

export default router