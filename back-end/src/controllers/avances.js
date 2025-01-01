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
      where: { avance_id: parsedId }
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
    const avance = await prisma.rEPORTEAVANCE.findUnique({
      where: { avance_id: parsedId }
    })
    if (!avance){
      return res.status(400).json({
        message: "ID inválido, no existe avance"
      })
    }
    if (!avance.archivo || avance.archivo == ''){
      return res.status(400).json({
        message: "No existe archivo para el avance proporcionado."
      })
    }
    const nombreArchivo = avance.archivo.split('\\').pop()
    console.log(nombreArchivo)
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
    return res.download(avance.archivo);
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
    const archivo = req.file;
    let archivoAbsoluto

    if (archivo){
      // Ruta relativa del archivo
      const archivoRelativo = archivo.path;  // Esta es la ruta relativa desde el directorio donde se almacenan los archivos
      // Usamos path.resolve() para convertir la ruta relativa en absoluta
      archivoAbsoluto = path.resolve(archivoRelativo);
    }

    // Validación de los datos
    if (!nombre || !descripcion) {
      throw new Error('Todos los campos son requeridos (nombre, descripcion)');
    }

    await prisma.rEPORTEAVANCE.create({
      data: {
        act_id: parsedId,
        nombre: nombre,
        descripcion: descripcion,
        ...(archivo != undefined) && {
          archivo: archivoAbsoluto
        }
      }
    })

    return res.status(200).json({
      message: "Avance creado!"
    });
  } catch (error) {
    if (req.file){
      //Eliminar de la ruta absoluta
      const archivoPathAbs = path.resolve(req.file.path);
      fs.unlink(archivoPathAbs, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        } else {
          console.log('Archivo eliminado debido a un error en la base de datos.');
        }
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
      where: { avance_id: parsedId }
    })

    if (!avance) {
      return res.status(500).json({
        message:"No se pudo eliminar el reporte de avance porque ya no existe",
      })
    }

    //Eliminar archivo asociado a avance
    if (avance.archivo){
      //Eliminar de la ruta absoluta
      fs.unlink(avance.archivo, (err) => {
        if (err) {
          throw new Error('Error al eliminar el archivo', err);
        }
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