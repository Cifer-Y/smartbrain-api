const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'Cifer',
        password : '',
        database : 'smartbrain'
    }
});

const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: '$2a$10$AIO.c9O.cu.wp1fFVEGbge7EQ7VB7dFEqzsW1uLH8wqySn6SEzoe6', // cookies
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: '$2a$10$pOYoQ6MMiCMCLsO9HqEF/ukPFM09tA57jQum/HKR2nb1GwJVZFNaq', // bananas
      entries: 0,
      joined: new Date(),
    },
  ]
};

app.get('/', (req, res) => {
  knex.select('*').from('users').then(users => res.json(users))
});

app.get('/users/:id', (req, res) => {
  knex('users').where('id', req.params.id).then(user => {
    res.json(user[0])
  }).catch(err => {
    res.status(404).json("Record not found")
  })
});

app.post('/users/:id/image', (req, res) => {
  knex('users').where('id', req.params.id).returning('*').increment('entries', 1).then((user) => {
    res.json(user[0])
  }).catch(err => {
    res.status(400).json("Update Error")
  })
});

app.post('/signin', (req, res) => {
  const {email, password} = req.body;
  knex('users').where('email', email).then(user => {
    res.json(user[0])
  }).catch(() => {
    res.status(400).json('email or password invalid')
  })
});

app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  knex('users').returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date()
    })
    .then(user => res.json(user[0]))
    .catch(err => {
      res.status(400).json('error for register');
    })
  // bcrypt.hash(password, null, null, function(err, hash) {});
});

app.listen(3003, () => {
  console.log("App is running: http://127.0.0.1:3003")
});
