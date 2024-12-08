import { prisma } from '../config/db.js';

//Obtener todos los planes
export const getPlanes = async (req,res) => {
  try {
    const planes = await prisma.pLANDEACCION.findMany()
    res.json(planes)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Obtener un plan de accion
export const getPlan = async (req,res) => {
  try {
    const id = req.params.id

    if (!id) {
      res.sendStatus(418)
    }

    const plan = await prisma.pLANDEACCION.findUnique({
      where: { plan_id: parseInt(id) },
      include: { 
        indica_plan: true,
        actividades: true,
      }
    })

    if (!plan) {
      res.status(418).json({
        message: "El plan de acción no existe"
      })
    }
    else{
      res.json(plan)
    }
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong",
      error: error.message
    })
  }
}

//Crear Plan de Acción
export const crearPlan = async (req,res) => {
  try {
    const { nombre_plan, user_id, obj_id, indicadores, actividades } = await req.body;

    // Validación de los datos
    if (!nombre_plan || !obj_id || !indicadores || !actividades) {
      throw new Error('Todos los campos son requeridos');
    }

    // await prisma.oBJETIVOESTRATEGICO.create({
    //   data: {
    //     nombre_plan: nombre_plan,
    //     //user_id: user_id,
    //     // ...user_id && {
    //     //   user_id: user_id
    //     // },
    //     obj_id: obj_id,
    //   }
    // });
    console.log(req.body)

    return res.status(200).json({
      message: "Plan de Acción creado!"
    });
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong",
      error: error.message
    })
  }
}