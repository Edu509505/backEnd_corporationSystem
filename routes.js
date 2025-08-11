import { Router } from "express";

import controleClientes from "./controllers/controleClientes.js";
import controleContrato from "./controllers/controleContratos.js";
import controleMedicoes from "./controllers/controleMedicoes.js";
import controlePropostas from "./controllers/controlePropostas.js";

const router = Router()

router.get('/clientes', controleClientes.getCliente)
router.post('/clientes', controleClientes.createCliente)

router.get('/contratos', controleContrato.getContrato)
router.post('/contratos', controleContrato.createContrato)

router.get('/medicoes', controleMedicoes.getMedicao)
router.post('/medicoes', controleMedicoes.createMedicao)

router.get('/propostas', controlePropostas.getProposta)
router.post('/propostas', controlePropostas.createProposta)

export default router