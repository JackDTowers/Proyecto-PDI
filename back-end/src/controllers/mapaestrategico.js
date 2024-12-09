import { prisma } from '../config/db.js';

//API para conseguir el mapa estrategico
export const getMapaEstrategico = async (req,res) => {
  try {
    const ejes = await prisma.eJEESTRATEGICO.findMany({
      include: {
        objetivos: true
      }
    })

    return res.json(ejes)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}