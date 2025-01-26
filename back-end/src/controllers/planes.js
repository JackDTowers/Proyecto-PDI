import { prisma } from '../config/db.js';
import path from 'path';
import fs from 'fs';

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
            estado: '0'
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
    //Validación de permisos para editar observaciones
    if (plan.user_id != req.payloadDecoded.id_cuenta && req.payloadDecoded.is_admin != 1) {
      return res.status(403).json({
        message: "No tienes permisos para editar las observaciones en este plan de acción."
      })
    }

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

export const editarPlan = async (req, res) => {
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

    const { plan, indicadoresEliminados, actividadesEliminadas } = await req.body;

    // Validación de los datos
    if (!plan || !indicadoresEliminados || !actividadesEliminadas) {
      throw new Error('Todos los campos son requeridos');
    }

    const plane = await prisma.pLANDEACCION.findUnique({
      where: { plan_id: parsedId },
    });

    if (!plane) {
      return res.status(418).json({
        message: "El plan de acción no existe"
      })
    }

    let indicadoresCreated = []
    let actividadesCreated = []
    let indicadoresUpdated = []
    let actividadesUpdated = []
    let archivosBorrados = []

    //Separar indicadores creados y actualizados
    plan.indica_plan.map((indicador) => {
      if (indicador.ind_plan_id == -1){
        indicadoresCreated.push(indicador);
      }
      else{
        indicadoresUpdated.push(indicador);
      }
    })

    //Separar actividades creadas y actualizadas
    plan.actividades.map((actividad) => {
      if (actividad.act_id == -1){
        actividadesCreated.push(actividad);
      }
      else{
        actividadesUpdated.push(actividad);
      }
    })

    //Creación de lista de archivos a borrar, asociados a actividades eliminadas
    if (actividadesEliminadas.length > 0){
      //Encontrar avances pertenecientes a las actividades borradas
      const avancesDeleted = await prisma.rEPORTEAVANCE.findMany({
        where: { 
          act_id: { in: actividadesEliminadas }
        },
        include: { archivos: true }
      })
      //Crear lista de archivos a borrar
      archivosBorrados = avancesDeleted.flatMap(avance => 
        avance.archivos
      );
    }

    //Actualización Plan de Acción en base de datos.
    await prisma.$transaction(async (prisma) => {
      //Actualizar datos generales del plan de acción
      await prisma.pLANDEACCION.update({
        where: { plan_id: parsedId },
        data: {
          nombre_plan: plan.nombre_plan,
          user_id: plan.user_id,
          obj_id: plan.obj_id,
          observaciones: plan.observaciones,
        }
      });

      //Actualizar Indicadores
      if (indicadoresUpdated.length > 0){
        await prisma.pLANDEACCION.update({
          where: { plan_id: parsedId },
          data: {
            indica_plan: {
              update: indicadoresUpdated.map((indicador) => ({
                where: { ind_plan_id: indicador.ind_plan_id },
                data: {
                  desc_indicaplan: indicador.desc_indicaplan,
                  form_calculo: indicador.form_calculo,
                  meta_plazo: indicador.meta_plazo,
                  fecha_inicio: indicador.fecha_inicio,
                  fecha_fin: indicador.fecha_fin,
                }
              })),
            },
          }
        });
      }

      //Actualizar Actividades
      if (actividadesUpdated.length > 0){
        await prisma.pLANDEACCION.update({
          where: { plan_id: parsedId },
          data: {
            actividades: {
              update: actividadesUpdated.map((actividad) => ({
                where: { act_id: actividad.act_id },
                data: {
                  desc_act: actividad.desc_act,
                  responsable: actividad.responsable,
                  plazo: actividad.plazo,
                  fecha_inicio: actividad.fecha_inicio,
                  fecha_fin: actividad.fecha_fin,
                }
              })),
            },
          }
        });
      }

      //Crear Indicadores
      if (indicadoresCreated.length > 0){
        await prisma.pLANDEACCION.update({
          where: { plan_id: parsedId },
          data: {
            indica_plan: {
              create: indicadoresCreated.map((indicador) => ({
                desc_indicaplan: indicador.desc_indicaplan,
                form_calculo: indicador.form_calculo,
                meta_plazo: indicador.meta_plazo,
                fecha_inicio: indicador.fecha_inicio,
                fecha_fin: indicador.fecha_fin,
              })),
            },
          }
        });
      }

      //Crear Actividades
      if (actividadesCreated.length > 0){
        await prisma.pLANDEACCION.update({
          where: { plan_id: parsedId },
          data: {
            actividades: {
              create: actividadesCreated.map((actividad) => ({
                desc_act: actividad.desc_act,
                responsable: actividad.responsable,
                plazo: actividad.plazo,
                fecha_inicio: actividad.fecha_inicio,
                fecha_fin: actividad.fecha_fin,
                estado: '0'
              })),
            },
          }
        });
      }

      //Eliminar Indicadores
      if (indicadoresEliminados.length > 0){
        await prisma.iNDICADORPLAN.deleteMany({
          where: {
            ind_plan_id: { in: indicadoresEliminados }
          }
        })
      }

      //Eliminar Actividades
      if (actividadesEliminadas.length > 0){
        await prisma.aCTIVIDAD.deleteMany({
          where: {
            act_id: { in: actividadesEliminadas }
          }
        })
      }
    })

    //Borrar archivos de actividades borradas
    if (archivosBorrados.length > 0){
      archivosBorrados.forEach((archivo) => {
        const archivoPathAbs = path.resolve(archivo.ruta);
        fs.unlink(archivoPathAbs, (err) => {
          if (err) {
            console.error('Error al eliminar los archivos asociados al plan:', err);
          }
        });
      })
    }

    return res.status(200).json({
      message: "Plan de Acción actualizado!"
    });
  } catch (error) {
    console.log(error)
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

    const plan = await prisma.pLANDEACCION.findUnique({
      where: { plan_id: parsedId },
      include: {
        actividades: {
          include: {
            avances: { include: { archivos: true } }
          }
        }
      }
    })

    if (!plan){
      return res.status(400).json({
        message: "ID inválido, no existe el plan"
      })
    }

    const archivos = plan.actividades.flatMap(actividad => 
      actividad.avances.flatMap(avance => avance.archivos)
    );

    await prisma.pLANDEACCION.delete({
      where: { plan_id: parsedId }
    });

    if (archivos && archivos.length > 0){
      archivos.forEach((archivo) => {
        const archivoPathAbs = path.resolve(archivo.ruta);
        fs.unlink(archivoPathAbs, (err) => {
          if (err) {
            console.error('Error al eliminar los archivos asociados al plan:', err);
          }
        });
      })
    }

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