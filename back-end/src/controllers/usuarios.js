import { prisma } from '../config/db.js';
import { hash } from 'bcrypt';

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

//Crear Usuario
export const crearUsuario = async (req, res) => {
  try {
    const { correo, contrasena, nombre, cargo, isAdmin } = await req.body;

    // Validación de los datos
    if (!correo || !contrasena || !nombre || !cargo) {
      throw new Error('Todos los campos son requeridos');
    }

    // Aquí podrías agregar más validaciones, como formato de email, longitud de contraseña, etc.

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
      if (e.code === 'P2002') {
        // Verificar si 'meta' y 'meta.target' existen y son del tipo esperado
        if (e.meta && typeof e.meta === 'object' && Array.isArray(e.meta.target)) {
          let conflictingField = e.meta.target.join(', ');
          if (conflictingField === 'correo') {
            let errorMessage = `El Correo Electrónico ya esta en uso`;
            return res.status(400).json({
              message: errorMessage
            });
          }
        }
      }
    }
    console.log(e)
    return res.status(500).json({
      message: "Something goes wrong",
      error: e.message
    });
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
    return res.status(500).json({
      message:"No se pudo eliminar el usuario",
      error: error.message
    })
  }
}