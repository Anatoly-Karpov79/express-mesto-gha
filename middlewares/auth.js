const jwt = require('jsonwebtoken');

const AuthError = require('../errors/autherror');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new AuthError('Необходимо авторизоваться');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new AuthError('Необходимо авторизоваться');
  }

  req.user = payload;
  next();
};
