import { prisma } from '../config/db.js';
import { hash } from 'bcrypt';

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
        // profiles: {
        //   connect: [{ id: 2 }], // Conectar el perfil de cliente
        // },
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
          } else {
            let errorMessage = `El Nombre de Usuario ya esta en uso`;
            return res.status(200).json({
              message: errorMessage
            });
          }
        }
      }
    }
    console.log(e)
    return res.status(500).json({
      message: "Something goes wrong",
      error: e
    });
  }
}