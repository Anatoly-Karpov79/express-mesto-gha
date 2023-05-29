/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ExistError = require('../errors/existerror');
const BadRequestError = require('../errors/badrequesterror');
const NotFoundError = require('../errors/notfounderror');

const {
  STATUS_OK,
  STATUS_BAD_REQUEST,
  // STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => {
      const userPasswordLess = user.toObject();
      delete userPasswordLess.password;

      res.status(STATUS_OK).send(userPasswordLess);
    })
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные.');
      }
      if (err.code === 11000) {
        next(new ExistError(`Пользователь с Email ${email} уже зарегистрирован`));
      }
      next(err);
    });
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
        next(new NotFoundError('Неверный Id'));
        return;
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
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
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      console.log(token);
      res.status(STATUS_OK).cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.find({ _id })
    .then((user) => res.status(STATUS_OK).send({ data: user[0] }))
    .catch(next);
};
