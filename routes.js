import { Router } from "express";

import controleClientes from "./controllers/controleClientes.js";
import controleContrato from "./controllers/controleContratos.js";
import controleMedicoes from "./controllers/controleMedicoes.js";
import controlePropostas from "./controllers/controlePropostas.js";
import imageController from "./controllers/controllerImage.js";
import controllerLogin from "./controllers/controllerLogin.js";
import controllerUser from "./controllers/controllerUser.js";
const router = Router()

router.post('/login', controllerLogin.login)

router.post('/usuario', controllerUser.createUsuario)

router.get('/clientes', controleClientes.getCliente)
router.get('/clientes/:id', controleClientes.getClientId)
router.post('/clientes', controleClientes.createCliente)
router.put('/clientes/:id', controleClientes.updateCliente)

router.get('/clientes/:id/contratos', controleClientes.getClienteContrato)

router.get('/contratos', controleContrato.getContrato)
router.get('/contratos/:id', controleContrato.getContratoId)
router.post('/contratos', controleContrato.createContrato)

router.get('/medicoes', controleMedicoes.getMedicao)
router.post('/medicoes', controleMedicoes.createMedicao)

router.get('/propostas', controlePropostas.getProposta)
router.post('/propostas', controlePropostas.createProposta)

router.post('/image/upload/json', imageController.uploadImageFormData)

export default router