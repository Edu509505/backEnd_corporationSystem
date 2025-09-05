import { Router } from "express";
import multer from 'multer';

const pastaTemp = multer({ dest: 'temp/' });

import controleClientes from "./controllers/controleClientes.js";
import controleContrato from "./controllers/controleContratos.js";
import controleMedicoes from "./controllers/controleMedicoes.js";
import controlePropostas from "./controllers/controlePropostas.js";
import controllerLogin from "./controllers/controllerLogin.js";
import controllerUser from "./controllers/controllerUser.js";
import controleVersionamento from "./controllers/controleVersionamento.js";
import controleAnexoVersionamento from "./controllers/controleAnexoVersionamento.js";
const router = Router();

router.post('/login', controllerLogin.login);

router.post('/usuario', controllerUser.createUsuario);

router.get('/clientes', controleClientes.getCliente);
router.get('/clientes/:id', controleClientes.getClientId);
router.post('/clientes', controleClientes.createCliente);
router.put('/clientes/:id', controleClientes.updateCliente);

router.get('/clientes/:id/contratos', controleClientes.getClienteContrato);

router.get('/contratos', controleContrato.getContrato);
router.get('/contratos/:id', controleContrato.getContratoId);
router.post('/contratos', controleContrato.createContrato);

router.get('/medicoes', controleMedicoes.getMedicao);
router.post('/medicoes', controleMedicoes.createMedicao);

router.get('/propostas', controlePropostas.getProposta);
router.post('/proposta', pastaTemp.single('file'), controlePropostas.createProposta);

router.get('/versionamento', controleVersionamento.getVersionamento);
router.post('/proposta/:idProposta/versao', controleVersionamento.createVersionamento);

router.post('/anexoVersionamento', controleAnexoVersionamento.uploadAnexoVersionamento)

//router.post('/image/upload/formdata', pastaTemp.single('file'), imageController.uploadImageFormData);

export default router