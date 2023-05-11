const routerUsers = require('express').Router();

const { createUser, getAllUsers, getUserById } = require('../controllers/users');

routerUsers.post('/users', createUser);

routerUsers.get('/users', getAllUsers);

routerUsers.get('/users/:userId', getUserById);

module.exports = routerUsers;
