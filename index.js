const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
app.post('/register', async(req, res, next) => {
  try{
    username = req.body.username
    password  = req.body.password
    const hashedPassword  = await bcrypt.hash(password, 10)
    await User.create({username: username, password: hashedPassword})
    res.send(`successfully created user ${username}`)
  }
  catch(error){
    console.log(error)
  }
})
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

// POST /login
app.post('/login', async(req, res, next) => {
  username = req.body.username
  password  = req.body.password
  let results = await User.findAll({
    where: {
      username : username ,
    },
    raw:true
  })
  results = results[0]
  const isMatch = await bcrypt.compare(password, results['password']);

  if (isMatch === true) {
      res.send(`successfully logged in user ${username}`);
  } else {
      res.send(401, 'incorrect username or password');
  }
})

// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB

// we export the app, not listening in here, so that we can run tests
module.exports = app;
