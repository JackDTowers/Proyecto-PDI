//Archivo Rutas Sistema PDI
import { Router } from 'express'
import { getEjes, getEje } from '../controllers/ejes.js';
import { getObjetivos, getObjetivo } from '../controllers/objetivos.js';

const router = Router();

//Rutas Eje
router.get('/ejes', getEjes)
router.get('/ejes/:id', getEje)

//Rutas Objetivo
router.get('/objetivos', getObjetivos)
router.get('/objevitos/:id', getObjetivo)

export default router