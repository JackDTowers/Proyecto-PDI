import { prisma } from '../config/db.js';
import { compare } from 'bcrypt';
import pkg from 'jsonwebtoken';

//Función de autenticación
async function verifyUser(correo, contrasena) {
  const user = await prisma.uSUARIO.findUnique({ 
    where: { correo: correo }
  });
  if (!user) {
    return null;
  }
  const passwordIsValid = await compare(contrasena, user.contrasena)
  return passwordIsValid ? user : null;
}

//Función crea token
function createToken(user, secret){
  const payload = {
    id_cuenta: user.id_cuenta,
    nombre: user.nombre,
    correo: user.correo,
    is_admin: user.is_admin
  };
  return pkg.sign(payload, secret, { expiresIn: "1h" });
}

//Middleware comprueba si hay token de usuario logeado para hacer uso de la API
export const checkToken = async (req, res, next) => {
  if (!req.headers['authorization']){
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  const token = req.headers['authorization'];

  try {
    // Verificación del token de forma asíncrona
    const decoded = await new Promise((resolve, reject) => {
      pkg.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new Error('Token inválido o expirado'));
        } else {
          resolve(decoded);
        }
      });
    });

    // Almacenar la carga útil decodificada en el objeto `req` para usarla en los siguientes middlewares
    req.payloadDecoded = decoded;

    // Continuar al siguiente middleware
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}

// Middleware para verificar si el usuario es administrador
export function isAdmin(req, res, next) {
  if (req.payloadDecoded.is_admin === 1) {
    next();  // El usuario es admin, permite la operación
  } else {
    res.status(403).send('Acceso denegado');
  }
}

// Middle verifica quién es el usuario. (usado para planes por usuario)
export function whosUser(req, res, next){
  req.userId = req.payloadDecoded.id_cuenta;
  next();
}

//Función login, autentica, crea y almacena token
export const login = async (req, res) => {
  try {
    const { correo, contrasena } = await req.body;

    //Validación de los datos
    if (!correo || !contrasena) {
      throw new Error('Todos los campos son requeridos');
    }

    const user = await verifyUser(correo, contrasena);
    if (!user){
      return res.status(401).json({
        message: "Credenciales incorrectas"
      })
    }
    const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey';
    const token = createToken(user, jwtSecret);

    return res.json({ 
      success: 'Login correcto',
      token: token 
    })
  } catch (error) {
    return res.status(500).json({
      message: "Something goes wrong",
      error: error.message
    });
  }
}