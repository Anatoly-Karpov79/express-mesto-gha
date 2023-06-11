/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const BadRequestError = require('../errors/badrequesterror');
const NotFoundError = require('../errors/notfounderror');
const ForbiddenError = require('../errors/forbiddenerror');

const {
  STATUS_OK,
} = require('../utils/constants');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.status(STATUS_OK).send(cards))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      next(new NotFoundError('Карточка не найдена.'));
    })

    .then((card) => {
      const owner = card.owner.toString();

      if (owner === req.user._id) {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        next(new ForbiddenError('Вы не можете удалить эту карточку.')); // запрет на удаление чужой карточки
      }
    })

    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена.'));
        return;
      }
      res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Корточка не найдена.'));
        return;
      }
      res.status(STATUS_OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};
