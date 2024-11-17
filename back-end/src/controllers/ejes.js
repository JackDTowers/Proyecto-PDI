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