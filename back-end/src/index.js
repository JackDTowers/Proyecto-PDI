import express from 'express'
import cors from 'cors'
import router from './routes/apipdi.js';

const app = express();

app.use(express.json())

app.use('/api', router)

app.listen(3000, () => {
  console.log('El servidor está corriendo en el puerto 3000');
});