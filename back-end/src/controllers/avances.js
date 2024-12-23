import { prisma } from '../config/db.js';

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
    const avances = await prisma.aCTIVIDAD.findMany({
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
      where: { act_id: parsedId }
    })
    return res.json(avance)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Obtener un avance
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

    const { asunto, descripcion, archivo } = await req.body;

    // Validación de los datos
    if (!asunto || !descripcion) {
      throw new Error('Todos los campos son requeridos (asunto, descripcion)');
    }

    await prisma.rEPORTEAVANCE.create({
      data: {
        act_id: parsedId,
        asunto: asunto,
        descripcion: descripcion,
        ...archivo && {
          archivo: archivo
        }
      }
    })

    return res.status(200).json({
      message: "Avance creado!"
    });
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}