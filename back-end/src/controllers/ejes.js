import { prisma } from '../config/db.js';

//Obtener todos los ejes
export const getEjes = async (req,res) => {
  try {
    const ejes = await prisma.eJEESTRATEGICO.findMany()

    return res.json(ejes)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Obtener un Eje
export const getEje = async (req,res) => {
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

    const eje = await prisma.eJEESTRATEGICO.findUnique({
      where: { eje_id: parsedId }
    })

    if (!eje) {
      return res.status(418).json({
        mesagge: "El eje no existe"
      })
    }
    else{
      return res.json(eje)
    }
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Crar Eje
export const crearEje = async (req,res) => {
  try {
    const { numero_eje, nombre_eje } = await req.body;

    // Validación de los datos
    if (!numero_eje || !nombre_eje) {
      throw new Error('Todos los campos son requeridos');
    }

    await prisma.eJEESTRATEGICO.create({
      data: {
        numero_eje: numero_eje,
        nombre_eje: nombre_eje.toUpperCase()
      }
    });

    return res.status(200).json({
      message: "Eje creado!"
    });
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong",
      error: error.message
    })
  }
}