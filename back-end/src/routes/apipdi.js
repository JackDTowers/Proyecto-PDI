//Archivo Rutas Sistema PDI
import { Router } from 'express'
import { getEjes, getEje, crearEje } from '../controllers/ejes.js';
import { getObjetivos, getObjetivo, crearObjetivo, getObjetivoxUsuario } from '../controllers/objetivos.js';
import { cambiarClave, crearUsuario, editarUsuario, eliminarUsuario, getUser, getUsers } from '../controllers/usuarios.js';
import { getMapaEstrategico } from '../controllers/mapaestrategico.js';
import { crearPlan, editarObservaciones, editarPlan, eliminarPlan, getPlan, getPlanes, getPlanesxUsuario } from '../controllers/planes.js';
import { checkToken, isAdmin, login, whosUser } from '../controllers/auth.js';
import { crearAvance, editarAvance, editarEstado, eliminarAvance, getArchivo, getAvance, getAvances, upload } from '../controllers/avances.js';

const router = Router();
const MAXFILES = 10;

//Ruta Login
router.post('/login', login)

//Rutas Eje
router.get('/ejes', getEjes)
router.get('/ejes/:id', getEje)
router.post('/ejes', crearEje)

//Rutas Objetivo
router.get('/objetivos', getObjetivos)
router.get('/objetivos/:id', getObjetivo)
router.get('/objetivos/usuario/:id', checkToken, whosUser, getObjetivoxUsuario)
router.post('/objetivos', crearObjetivo)

//Rutas Usuario
router.get('/usuarios', checkToken, isAdmin, getUsers)
router.get('/usuarios/:id', checkToken, isAdmin, getUser)
router.post('/usuarios', checkToken, isAdmin, crearUsuario)
router.patch('/usuarios/:id', checkToken, isAdmin, editarUsuario)
router.put('/usuarios/:id', checkToken, cambiarClave)
router.delete('/usuarios/:id', checkToken, isAdmin, eliminarUsuario)

//Ruta Mapa Estrategico
router.get('/mapa-estrategico', checkToken, getMapaEstrategico)

//Rutas Plan de Accion
router.get('/planes', getPlanes)
router.get('/planes/usuario/:id', checkToken, whosUser, getPlanesxUsuario)
router.get('/planes/:id', getPlan)
router.post('/planes', checkToken, isAdmin, crearPlan)
router.patch('/planes/:id', checkToken, editarObservaciones)
router.put('/planes/:id', checkToken, isAdmin, editarPlan)
router.delete('/planes/:id', checkToken, isAdmin, eliminarPlan)

//Ruta Actividad
router.patch('/actividades/:id', checkToken, editarEstado)

//Rutas Avance
router.get('/actividades/:id', getAvances)
router.get('/avances/:id', getAvance)
router.get('/avances/file/:id', getArchivo)
router.post('/avances/:id', checkToken, upload.array('archivos', MAXFILES), crearAvance)
router.patch('/avances/:id', checkToken, upload.array('archivos', MAXFILES), editarAvance)
router.delete('/avances/:id', checkToken, eliminarAvance)

export default router