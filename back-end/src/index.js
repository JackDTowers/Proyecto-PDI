import express from 'express'
import cors from 'cors'
import router from './routes/apipdi.js';

const app = express();

app.use(cors())
app.use(express.json())

app.use('/api', router)

app.listen(4000);
console.log('El servidor está corriendo en http://localhost:4000')