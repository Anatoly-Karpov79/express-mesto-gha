/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  } = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cards) => res.status(STATUS_OK).send({ data: cards }))
    // если данные не записались, вернём ошибку
    .catch(() => res.status(STATUS_BAD_REQUEST).send({ message: 'Произошла ошибка' }));
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch();
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(STATUS_NOT_FOUND).send({ message: 'Неверный Id' });
        return;
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch(() => {
      res.status(STATUS_BAD_REQUEST).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Неверный Id' });
      }
      res.send({ data: card });
    })
    .catch(() => res.status(STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(STATUS_NOT_FOUND).send({ message: 'Неверный Id' });
      }
      res.send({ data: card });
    })
    .catch(() => res.status(STATUS_BAD_REQUEST).send({ message: 'Карточка не найдена' }));
};
