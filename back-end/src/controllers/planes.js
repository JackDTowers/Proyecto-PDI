import { prisma } from '../config/db';

//Obtener todos los planes
export const getPlanes = async (req,res) => {
  try {
    const planes = await prisma.pLANDEACCION.findMany()
    res.json(planes)
  } catch (error) {
    //console.log(error)
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}