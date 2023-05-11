const routerCards = require('express').Router();

const { createCard } = require('../controllers/cards');

routerCards.post('/cards', createCard);

// routerCards.get('/users', getAllUsers);

// routerCards.get('/users/:userId', getUserById);

module.exports = routerCards;
