//Archivo Rutas Sistema PDI
import { Router } from 'express'
import { getEjes, getEje, crearEje } from '../controllers/ejes.js';
import { getObjetivos, getObjetivo, crearObjetivo } from '../controllers/objetivos.js';
import { crearUsuario, eliminarUsuario, getUsers } from '../controllers/usuarios.js';
import { getMapaEstrategico } from '../controllers/mapaestrategico.js';
import { crearPlan, eliminarPlan, getPlan, getPlanes, getPlanesxUsuario } from '../controllers/planes.js';
import { checkToken, isAdmin, login } from '../controllers/auth.js';
import { crearAvance, eliminarAvance, getArchivo, getAvance, getAvances, upload } from '../controllers/avances.js';

const router = Router();

//Ruta Login
router.post('/login', login)

//Rutas Eje
router.get('/ejes', getEjes)
router.get('/ejes/:id', getEje)
router.post('/ejes', crearEje)

//Rutas Objetivo
router.get('/objetivos', getObjetivos)
router.get('/objetivos/:id', getObjetivo)
router.post('/objetivos', crearObjetivo)

//Rutas Usuario
router.get('/usuarios', checkToken, isAdmin, getUsers)
router.post('/usuarios', checkToken, isAdmin, crearUsuario)
router.delete('/usuarios/:id', checkToken, isAdmin, eliminarUsuario)

//Ruta Mapa Estrategico
router.get('/mapa-estrategico', checkToken, getMapaEstrategico)

//Rutas Plan de Accion
router.get('/planes', getPlanes)
router.get('/planes/usuario/:id', checkToken, getPlanesxUsuario)
router.get('/planes/:id', getPlan)
router.post('/planes', checkToken, isAdmin, crearPlan)
router.delete('/planes/:id', eliminarPlan)

//Rutas Avance
router.get('/actividades/:id', getAvances)
router.get('/avances/:id', getAvance)
router.get('/avances/file/:id', getArchivo)
router.post('/avances/:id', checkToken, upload.single('archivo'), crearAvance)
router.delete('/avances/:id', eliminarAvance)

export default router