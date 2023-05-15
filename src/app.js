// importamos express
const express = require('express');
const db = require('./utils/database');
const Users = require('./models/users.model');
require('dotenv').config();

//creamos una instancia de express llamada app.

const PORT = process.env.PORT || 8000;

db.authenticate() // es una función asincrona
    .then(() => console.log('Base de datos conectada'))
    .catch((err) => console.log(err));

db.sync()
    .then(() => console.log('Base de datos sincronizada'))
    .catch(error => console.log(error));

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando')
});

app.post('/users', async (req, res) => {
    try {
      //extramemos el cuerpo de la peticion
      const newUser = req.body;
      //INSERT INTO users (firstname, lastname, email. password) VALUES ()
      await Users.create(newUser);
      res.status(201).send(); 
    } catch (error) {
        res.status(400).json(error);
    }
});

// obtener a todos los usuarios de la base de datos
//SELECT * FROM users;
// attributes: ['firstname', 'lastname', 'email'] 

app.get('/users', async (req, res) => {
    try {
      const users = await Users.findAll({
        attributes: {
            exclude: ["password"],
        },
      });
      res.json(users);
    } catch (error) {
      res.status(400).json(error)
    }
});

//get user by id, encontrar usuarios por id
app.get('/users/id/:id', async (req, res) => {
    try {
      // para recuperar el parametro de ruta --- req.params: es un objeto 
      const { id } = req.params;
      console.log(req.params);
      
      const user = await Users.findByPk(id, {
        attributes: {
            exclude: ["password"],
        },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json(error)
    }
});


// si quiero encontrar por otro campo, ejemplo: correo

app.get('/users/email/:email' , async (req, res) => {
    try {
        const {email} = req.params;
        const user = await Users.findOne({
            where: {email}  // {email: email}  
        });
        res.json(user);
    } catch (error) {
        res.status(400).json(error);
    }
});


//eliminar un usuario
// DELETE FROM users WHERE id = 3; eliminar al usuario con id = 3

app.delete('/users/:id', async (req, res) => {
  try {
    const {id} = req.params;
    await Users.destroy({
      where: {id} // where : {id:id}
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
} );

//Actualizar informacion del usuario
//UPDATE users SET firstname = 'dasdsa', lastname='dadsa' WHERE id='1234'

app.put('/users/:id', async (req, res) => {
  try {
    const {id} = req.params
    const { firstname, lastname } = req.body;
    await Users.update({firstname, lastname}, {
      where: {id}
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
});


// dejar escuchando nuestro servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});

console.log(process.env);