const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
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
}

app.get('/', (req, res) => {
  res.json(database.users)
})

app.get('/users/:id', (req, res) => {
  const u = database.users.filter((user) => user.id === req.params.id)[0]
  u ? res.json(u) : res.status(404).json("Record not found")
})

app.post('/users/:id/image', (req, res) => {
  const u = database.users.filter((user) => user.id === req.params.id)[0]
  if(u) {
    u.entries++
    res.json(u)
  } else {
    res.status(404).json("Record not found")
  }
})

app.post('/signin', (req, res) => {
  const {email, password} = req.body;
  const u = database.users.filter((user) => user.email === email)[0]

  if (u) {
    bcrypt.compare(password, u.password, function(err, result) {
      result ? res.json(u) : res.status(401).json('Email or Password invalid')
    });
  } else {
    res.status(401).json('Email or Password invalid')
  }
})

app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    database.users.push({
      id: '125',
      name: name,
      email: email,
      password: hash,
      entries: 0,
      joined: new Date(),
    })

    const u = database.users.filter((user) => user.email === email)[0]
    res.json(u);
  });


})

app.listen(3003, () => {
  console.log("App is running: http://127.0.0.1:3003")
});
