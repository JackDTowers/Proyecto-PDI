import { prisma } from '../config/db.js';

//Obtener todos los objetivos
export const getObjetivos = async (req,res) => {
  try {
    const objetivos = await prisma.oBJETIVOESTRATEGICO.findMany()

    return res.json(objetivos)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Obtener un objetivo
export const getObjetivo = async (req,res) => {
  try {
    const id = req.params.id

    if (!id) {
      return res.sendStatus(418)
    }

    // Convertir el ID a un número y validar
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return res.status(400).json({
        message: "ID inválido"
      })
    }

    const objetivo = await prisma.oBJETIVOESTRATEGICO.findUnique({
      where: { obj_id: parsedId },
      include: { 
        planes: {
          include: {
            responsable: {
              select: { nombre: true }
            }
          }
        },
        indica_objetivo: true
      }
    })

    if (!objetivo) {
      return res.status(418).json({
        mesagge: "El objetivo no existe"
      })
    }
    else{
      return res.json(objetivo)
    }
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Crear Objetivo
export const crearObjetivo = async (req,res) => {
  try {
    const { eje_id, cod_obj, nombre_obj } = await req.body;

    // Validación de los datos
    if (!eje_id || !cod_obj || !nombre_obj) {
      throw new Error('Todos los campos son requeridos');
    }

    await prisma.oBJETIVOESTRATEGICO.create({
      data: {
        eje_id: eje_id,
        cod_obj: cod_obj.toUpperCase(),
        nombre_obj: nombre_obj,
      }
    });

    return res.status(200).json({
      message: "Objetivo creado!"
    });
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong",
      error: error.message
    })
  }
}