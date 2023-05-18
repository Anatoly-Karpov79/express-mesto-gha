/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const NotFoundError = require('../errors/notfounderror');
const BadRequestError = require('../errors/badrequesterror');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    // если данные не записались, вернём ошибку
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch();
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невевный ID'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(404).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};
