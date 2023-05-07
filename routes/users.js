const routerUsers = require('express').Router();

const {
  createUser,
} = require('../controllers/users');

routerUsers.post('/', createUser);

routerUsers.get('/users');

routerUsers.get('/users/me');
