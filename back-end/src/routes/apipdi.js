//Archivo Rutas Sistema PDI
import { Router } from 'express'
import { getEjes, getEje, crearEje } from '../controllers/ejes.js';
import { getObjetivos, getObjetivo, crearObjetivo } from '../controllers/objetivos.js';
import { crearUsuario, getUsers } from '../controllers/usuarios.js';
import { getMapaEstrategico } from '../controllers/mapaestrategico.js';
import { crearPlan, getPlan, getPlanes } from '../controllers/planes.js';

const router = Router();

//Rutas Eje
router.get('/ejes', getEjes)
router.get('/ejes/:id', getEje)
router.post('/ejes', crearEje)

//Rutas Objetivo
router.get('/objetivos', getObjetivos)
router.get('/objetivos/:id', getObjetivo)
router.post('/objetivos', crearObjetivo)

//Rutas Usuario
router.get('/usuarios', getUsers)
router.post('/usuarios', crearUsuario)

//Ruta Mapa Estrategico
router.get('/mapa-estrategico', getMapaEstrategico)

//Rutas Plan de Accion
router.get('/planes', getPlanes)
router.get('/planes/:id', getPlan)
router.post('planes', crearPlan)

export default router