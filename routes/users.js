const routerUsers = require('express').Router();

const { createUser, getAllUsers, getUserById, updateUser, updateUserAvatar } = require('../controllers/users');

routerUsers.post('/users', createUser);

routerUsers.get('/users', getAllUsers);

routerUsers.get('/users/:userId', getUserById);

routerUsers.patch('/users/me', updateUser);

routerUsers.patch('/users/me/avatar', updateUserAvatar);

module.exports = routerUsers;
