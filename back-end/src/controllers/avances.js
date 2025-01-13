import { prisma } from '../config/db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

//De momento se trabajan con rutas absolutas, hasta eso se almacena en bd, podría ser relativa o solo nombre de archivo,
//también de momento se almacenan todos los archivos en una sola carpeta.
// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Directorio donde se almacenarán los archivos
const FILEDIRECTORY = path.resolve(__dirname, '../public');

//Configuración de almacenamiento de archivos
const storage = multer.diskStorage({
  filename: function (res, file, cb) {
    const ext = file.originalname.split(".").pop();
    const fileName = file.originalname.split(".")[0];
    const fecha = Date.now();
    cb(null, `${fileName + fecha}.${ext}`);
  },
  destination: function (res, file, cb){
    cb(null, FILEDIRECTORY);
  }
});

//Middle que sube archivo
export const upload = multer({storage});

//Obtener todos los avances en actividad
//Ver esto por si el id de la actividad viene en el reqbody
export const getAvances = async (req,res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.status(418).json({
        message: "ID no proporcionado"
      })
    }

    // Convertir el ID a un número y validar
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "ID inválido"
      })
    }
    const avances = await prisma.aCTIVIDAD.findUnique({
      where: { act_id: parsedId },
      include: { 
        plan: true,
        avances: true 
      }
    })
    return res.json(avances)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Obtener un avance
export const getAvance = async (req,res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.status(418).json({
        message: "ID no proporcionado"
      })
    }

    // Convertir el ID a un número y validar
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "ID inválido"
      })
    }
    const avance = await prisma.rEPORTEAVANCE.findUnique({
      where: { avance_id: parsedId },
      include: { archivos: true }
    })
    return res.json(avance)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong",
      error: error.message
    })
  }
}

//Obtener un archivo
export const getArchivo = async (req,res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.status(418).json({
        message: "ID no proporcionado"
      })
    }

    // Convertir el ID a un número y validar
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "ID inválido"
      })
    }
    const archivo = await prisma.aRCHIVO.findUnique({
      where: { archivo_id: parsedId }
    })
    if (!archivo){
      return res.status(400).json({
        message: "ID inválido, no existe archivo"
      })
    }
    res.setHeader('Content-Disposition', `attachment; filename="${archivo.nombre}"`);
    return res.download(archivo.ruta);
  } catch (error) {
    return res.status(500).json({
      message:"Error al efectuar la descarga del archivo",
      error: error.message
    })
  }
}

//Crear un avance
export const crearAvance = async (req,res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.status(418).json({
        message: "ID no proporcionado"
      })
    }

    // Convertir el ID a un número y validar
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "ID inválido"
      })
    }

    const { nombre, descripcion } = await req.body;
    const archivos = req.files;

    // Validación de los datos
    if (!nombre || !descripcion) {
      throw new Error('Todos los campos son requeridos (nombre, descripcion)');
    }

    const actividad = await prisma.aCTIVIDAD.findUnique({
      where: { act_id: parsedId },
      include: { plan: true }
    })

    //Validación de permisos para crear reporte de avance
    if (actividad.plan.user_id != req.payloadDecoded.id_cuenta && req.payloadDecoded.is_admin != 1) {
      return res.status(403).json({
        message: "No tienes permisos para crear un avance en esta actividad"
      })
    }

    await prisma.rEPORTEAVANCE.create({
      data: {
        act_id: parsedId,
        nombre: nombre,
        descripcion: descripcion,
        ...(archivos != undefined && archivos.lenght != 0) && {
          //Pendiente
          archivos: {
            create: archivos.map((archivo) => {
              return {
                nombre: archivo.filename,
                ruta: archivo.path
              }
            })
          }
        }
      }
    })

    return res.status(200).json({
      message: "Avance creado!"
    });
  } catch (error) {
    if (req.files){
      req.files.forEach((file) => {
        //Eliminar de la ruta absoluta
        const archivoPathAbs = path.resolve(file.path);
        fs.unlink(archivoPathAbs, (err) => {
          if (err) {
            console.error('Error al eliminar los archivos:', err);
          } else {
            console.log('Archivos eliminados debido a un error en la base de datos.');
          }
        });
      });
    }
    return res.status(500).json({
      message:"Something goes wrong",
      error: error.message
    })
  }
}

//Eliminar avance
export const eliminarAvance = async (req,res) => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(418).json({
        message: "ID no proporcionado"
      })
    }
    // Convertir el ID a un número y validar
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "ID inválido"
      })
    }

    const avance = await prisma.rEPORTEAVANCE.findUnique({
      where: { avance_id: parsedId },
      include: { actividad: { include: { plan: true } } }
    });

    if (!avance) {
      return res.status(500).json({
        message:"No se pudo eliminar el reporte de avance porque ya no existe",
      })
    }

    //Validación de permisos para eliminar reporte de avance
    if (avance.actividad.plan.user_id != req.payloadDecoded.id_cuenta && req.payloadDecoded.is_admin != 1) {
      return res.status(403).json({
        message: "No tienes permisos para eliminar un avance en esta actividad"
      })
    }

    const archivos = await prisma.aRCHIVO.findMany({
      where: { avance_id: parsedId }
    });

    //Eliminar archivo asociado a avance
    if (archivos.length > 0) {
      archivos.forEach((archivo) => {
        //Eliminar de la ruta absoluta
        fs.unlink(archivo.ruta, (err) => {
          if (err) {
            throw new Error('Error al eliminar el archivo', err);
          }
        });
      });
    }

    await prisma.rEPORTEAVANCE.delete({
      where: { avance_id: parsedId }
    });

    return res.status(200).json({
      message: "Reporte de Avance eliminado"
    });
  }
  catch (error){
    return res.status(500).json({
      message:"No se pudo eliminar el reporte de avance",
      error: error.message
    })
  }
}