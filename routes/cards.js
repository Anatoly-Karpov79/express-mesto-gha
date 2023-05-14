const routerCards = require('express').Router();

const {
  createCard,
  getAllCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCards.post('/cards', createCard);

routerCards.get('/cards', getAllCards);

routerCards.delete('/cards/:cardId', deleteCardById);

routerCards.put('/cards/:cardId/likes', likeCard);

routerCards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = routerCards;
