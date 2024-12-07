import { prisma } from '../config/db.js';

//Obtener todos los ejes
export const getEjes = async (req,res) => {
  try {
    const ejes = await prisma.eJEESTRATEGICO.findMany()

    res.json(ejes)
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
      res.sendStatus(418)
    }

    const eje = await prisma.eJEESTRATEGICO.findUnique({
      where: { eje_id: parseInt(id) }
    })

    if (!eje) {
      res.status(418).json({
        mesagge: "El eje no existe"
      })
    }
    else{
      res.json(eje)
    }
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

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