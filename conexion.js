const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3000;

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

// Configurar Express.js para servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Middleware para procesar datos enviados en formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'EthaN2505',
  database: 'laboratorio15'
});

// Conexión a la base de datos
connection.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL: ', error);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

// Ruta principal - Mostrar todos los datos
app.get('/', (req, res) => {
  connection.query('SELECT * FROM alumnos', (error, resultados) => {
    if (error) {
      console.error('Error al obtener los datos: ', error);
      return;
    }
    res.render('index', { datos: resultados });
  });
});

// Manejar la solicitud POST para agregar datos
app.post('/', (req, res) => {
  const nuevoDato = req.body.nuevoDato;
  if (!nuevoDato) {
    res.send('Por favor, ingrese un dato válido.');
    return;
  }
  const consulta = 'INSERT INTO alumnos (columna1) VALUES (?)';
  connection.query(consulta, [nuevoDato], (error, results) => {
    if (error) {
      console.error('Error al insertar datos: ', error);
      res.send('Error al insertar datos');
      return;
    }
    console.log('Dato insertado exitosamente');
    res.redirect('/');
  });
});

// Ruta para actualizar un dato
app.post('/update', (req, res) => {
  const id = req.body.id;
  const nuevoValor = req.body.nuevoValor;
  if (!nuevoValor || !id) {
    res.send('Por favor, ingrese un valor válido y un ID.');
    return;
  }
  const consulta = 'UPDATE alumnos SET columna1 = ? WHERE id = ?';
  connection.query(consulta, [nuevoValor, id], (error, results) => {
    if (error) {
      console.error('Error al actualizar datos: ', error);
      res.send('Error al actualizar datos');
      return;
    }
    console.log('Dato actualizado exitosamente');
    res.redirect('/');
  });
});

// Ruta para eliminar un dato
app.post('/delete', (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.send('Por favor, ingrese un ID válido.');
    return;
  }
  const consulta = 'DELETE FROM alumnos WHERE id = ?';
  connection.query(consulta, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar datos: ', error);
      res.send('Error al eliminar datos');
      return;
    }
    console.log('Dato eliminado exitosamente');
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
