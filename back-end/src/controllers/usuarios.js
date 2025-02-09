import { prisma } from '../config/db.js';
import { hash, compare } from 'bcrypt';
import { Prisma } from '@prisma/client';

//Obtener todos los usuarios
export const getUsers = async (req,res) => {
  try {
    const users = await prisma.uSUARIO.findMany({
      select: {
        id_cuenta: true,
        correo: true,
        nombre: true,
        cargo: true,
        is_admin: true,
      }
    })

    return res.json(users)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Obtener Usuario
export const getUser = async (req,res) => {
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

    const users = await prisma.uSUARIO.findUnique({
      where: { id_cuenta : parsedId },
      select: {
        id_cuenta: true,
        correo: true,
        nombre: true,
        cargo: true,
        is_admin: true,
      }
    })

    return res.json(users)
  } catch (error) {
    return res.status(500).json({
      message:"Something goes wrong"
    })
  }
}

//Crear Usuario
export const crearUsuario = async (req, res) => {
  try {
    const { correo, contrasena, nombre, cargo, isAdmin } = await req.body;

    // Validación de los datos
    if (!correo || !contrasena || !nombre || !cargo) {
      throw new Error('Todos los campos son requeridos');
    }

    // Aquí podrías agregar más validaciones, como formato de email, longitud de contraseña, etc.
    if (contrasena.length < 8){
      throw new Error('La contraseña debe contener como mínimo 8 caracteres');
    }

    await prisma.uSUARIO.create({
      data: {
        correo: correo,
        contrasena: await hash(contrasena, 10),
        nombre: nombre,
        cargo: cargo,
        is_admin: isAdmin,
      },
    });
    return res.status(200).json({
      message: "Usuario Registrado!"
    });
  } catch (e) {
    if (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          // Verificar si 'meta' existe y es del tipo esperado
          if (e.meta && typeof e.meta === 'object') {
            if (e.meta.target === 'USUARIO_correo_key') {
              let errorMessage = `El Correo Electrónico ya esta en uso`;
              return res.status(400).json({
                message: errorMessage
              });
            }
          }
        }
      }
    }
    return res.status(500).json({
      message: "Something goes wrong",
      error: e.message
    });
  }
}

//Editar Usuario
export const editarUsuario = async (req, res) => {
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

    const { contrasena, nombre, cargo, isAdmin } = await req.body;

    // Validación de los datos
    if (!nombre || !cargo) {
      throw new Error('Todos los campos son requeridos');
    }

    // Aquí podrías agregar más validaciones, como formato de email, longitud de contraseña, etc.
    if (contrasena && contrasena != '' && contrasena.length < 8){
      throw new Error('La contraseña debe contener como mínimo 8 caracteres');
    }

    await prisma.uSUARIO.update({
      where: { id_cuenta: parsedId },
      data: {
        nombre: nombre,
        cargo: cargo,
        is_admin: isAdmin,
        ...(contrasena && contrasena != '' ) && {
          contrasena: await hash(contrasena, 10)
        }
      }
    });

    return res.status(200).json({
      message: "Usuario actualizado con éxito"
    });
  }
  catch (error){
    return res.status(500).json({
      message:"No se pudo actualizar los datos del usuario",
      error: error.message
    })
  }
}

//Cambiar contraseña
export const cambiarClave = async (req, res) => {
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

    const { claveAntigua, claveNueva, claveRepetida } = await req.body;

    //Realizar validación de que el usuario sea el dueño de la cuenta (está logueado)
    if (parsedId != req.payloadDecoded.id_cuenta) {
      return res.status(403).json({
        message: "No tienes permisos para editar la clave de esta cuenta!"
      })
    }

    // Validación de los datos
    if (!claveAntigua || !claveNueva || !claveRepetida) {
      throw new Error('Todos los campos son requeridos');
    }

    if (claveNueva.length < 8){
      throw new Error('La contraseña debe contener 8 carácteres como mínimo');
    }

    if (claveNueva != claveRepetida){
      throw new Error('La nueva contraseña no coincide con su confirmación');
    }

    const user = await prisma.uSUARIO.findUnique({
      where: { id_cuenta: parsedId }
    })

    const passwordIsValid = await compare(claveAntigua, user.contrasena)

    if(!passwordIsValid){
      return res.status(400).json({
        message: "La clave antigua proporcionada no es correcta."
      })
    }

    await prisma.uSUARIO.update({
      where: { id_cuenta: parsedId },
      data: {
        contrasena: await hash(claveNueva, 10)
      }
    });

    return res.status(200).json({
      message: "Contraseña actualizada con éxito"
    });
  }
  catch (error){
    return res.status(500).json({
      message:"No se pudo cambiar la contraseña",
      error: error.message
    })
  }
}

//Eliminar Usuario
export const eliminarUsuario = async (req,res) => {
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

    await prisma.uSUARIO.delete({
      where: { id_cuenta: parsedId }
    });

    return res.status(200).json({
      message: "Usuario eliminado"
    });
  }
  catch (error){
    if (error.code === 'P2003' && error.meta.field_name === 'user_id') {
      return res.status(409).json({
        message: "El usuario cuenta con plan(es) de acción asociado(s), no se puede eliminar",
        error: error.message
      })
    }
    return res.status(500).json({
      message:"No se pudo eliminar el usuario",
      error: error.message
    })
  }
}