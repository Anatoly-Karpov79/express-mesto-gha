const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routerCards = require('./routes/cards');
const routerUsers = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(routerUsers);
app.use(routerCards);
// app.post(login);
// app.post(createUser);
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Неправильный путь' });
});

app.use(errors());
// app.use((err, req, res) => {
//  res.status(500).send({ message: 'На сервере произошла ошибка' });
// });

app.listen(PORT);
