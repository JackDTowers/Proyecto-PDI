//Archivo Rutas Sistema PDI
import { Router } from 'express'
import { getEjes, getEje } from '../controllers/ejes.js';
import { getObjetivos, getObjetivo } from '../controllers/objetivos.js';
import { crearUsuario } from '../controllers/usuarios.js';

const router = Router();

//Rutas Eje
router.get('/ejes', getEjes)
router.get('/ejes/:id', getEje)

//Rutas Objetivo
router.get('/objetivos', getObjetivos)
router.get('/objetivos/:id', getObjetivo)

//Rutas Usuario
router.post('/usuarios', crearUsuario)

export default router