import { prisma } from '../config/db.js';

//Obtener todos los planes
export const getPlanes = async (req,res) => {
  try {
    const planes = await prisma.pLANDEACCION.findMany()
    return res.json(planes)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

export const getPlanesxUsuario = async (req,res) => {
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

    //Validación de lo que le manda middle whosUser en APIPDI y de lo que se manda de front, debe coincidir.
    if (parsedId != req.userId){
      return res.status(401).json({
        message: "ID inválido"
      })
    }

    const planes = await prisma.oBJETIVOESTRATEGICO.findMany({
      include: {
        planes: {
          where: {
            user_id: parsedId,
          },
        },
      },
      where: {
        planes: {
          some: {
            user_id: parsedId,
          },
        },
      },
    });
    return res.json(planes)
  } catch (error) {
    return res.status(500).json({
      message:"Ocurrió un error al obtener los planes por usuario.",
      error: error.message
    })
  }
}

//Obtener un plan de accion
export const getPlan = async (req,res) => {
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

    const plan = await prisma.pLANDEACCION.findUnique({
      where: { plan_id: parsedId },
      include: { 
        indica_plan: true,
        actividades: true,
        responsable: {
          select: {
            id_cuenta: true,
            nombre: true,
            cargo: true
          }
        },
        objetivo: true
      }
    })

    if (!plan) {
      return res.status(418).json({
        message: "El plan de acción no existe"
      })
    }
    else{
      return res.json(plan)
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
    const { nombre_plan, user_id, obj_id, indica_plan, actividades, observaciones } = await req.body;

    // Validación de los datos
    if (!nombre_plan || !user_id || !obj_id || !indica_plan || !actividades) {
      throw new Error('Todos los campos son requeridos');
    }
    await prisma.pLANDEACCION.create({
      data: {
        nombre_plan: nombre_plan,
        user_id: user_id,
        // ...user_id && {
        //   user_id: user_id
        // },
        obj_id: obj_id,
        indica_plan: {
          create: indica_plan.map((indicador) => ({
            desc_indicaplan: indicador.desc_indicaplan,
            form_calculo: indicador.form_calculo,
            meta_plazo: indicador.meta_plazo,
            fecha_inicio: indicador.fecha_inicio,
            fecha_fin: indicador.fecha_fin,
          })),
        },
        actividades: {
          create: actividades.map((actividad) => ({
            desc_act: actividad.desc_act,
            responsable: actividad.responsable,
            plazo: actividad.plazo,
            fecha_inicio: actividad.fecha_inicio,
            fecha_fin: actividad.fecha_fin,
          })),
        },
        fecha_creacion: new Date(),
        observaciones: observaciones,
      }
    });
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

//Editar las observaciones de un plan de acción
export const editarObservaciones = async (req,res) => {
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

    const { observaciones } = await req.body;

    const plan = await prisma.pLANDEACCION.findUnique({
      where: { plan_id: parsedId },
    });

    if (!plan) {
      return res.status(418).json({
        message: "El plan de acción no existe"
      })
    }

    //Realizar validación de que el usuario sea el dueño del plan o que pueda editar solo admin si es que se requiere

    await prisma.pLANDEACCION.update({
      where: { plan_id: parsedId },
      data: {
        observaciones: observaciones,
      }
    });
    return res.status(200).json({
      message: "Observaciones actualizadas!"
    });
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong",
      error: error.message
    })
  }
}

export const eliminarPlan = async (req,res) => {
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

    await prisma.pLANDEACCION.delete({
      where: { plan_id: parsedId }
    });

    return res.status(200).json({
      message: "Plan de Acción eliminado"
    });
  }
  catch (error){
    return res.status(500).json({
      message:"No se pudo eliminar el plan",
      error: error.message
    })
  }
}