const express = require("express");
const app = express();

app.use('/api', require('./routes/apipdi'))

app.listen(4000);
console.log('El servidor está corriendo en http://localhost:4000')