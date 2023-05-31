const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  createCard,
  getAllCards,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCards.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), createCard);

routerCards.get('/cards', auth, getAllCards);

routerCards.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCardById);

routerCards.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

routerCards.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = routerCards;
