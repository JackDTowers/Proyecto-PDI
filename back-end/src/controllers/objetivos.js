import { prisma } from '../config/db.js';

//Obtener todos los objetivos
export const getObjetivos = async (req,res) => {
  try {
    const objetivos = await prisma.oBJETIVOESTRATEGICO.findMany()

    res.json(objetivos)
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
      res.sendStatus(418)
    }

    const objetivo = await prisma.oBJETIVOESTRATEGICO.findUnique({
      where: { objetivo_id: parseInt(id) }
    })

    if (!objetivo) {
      res.status(418).json({
        mesagge: "El objetivo no existe"
      })
    }
    else{
      res.json(objetivo)
    }
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}