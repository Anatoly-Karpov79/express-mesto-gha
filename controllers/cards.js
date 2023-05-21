/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const BadRequestError = require('../errors/badrequesterror');
const NotFoundError = require('../errors/notfounderror');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    // если данные не записались, вернём ошибку
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
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
      if (!card) { res.status(404).send({ message: 'Неверный Id' }); }
    })
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })

    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res ) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) { res.status(400).send({ message: 'Неверный Id' });
      }
      res.send({ data: card });
    })
    .catch(() => res.status(400).send({ message: 'Карточка не найдена' }));
};

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный Id'));
      return;
    }
    next(err);
  });
