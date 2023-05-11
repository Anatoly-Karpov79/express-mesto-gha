const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
//  useCreateIndex: true,
// useFindAndModify: false
});

app.use(routerUsers);

app.use((req, res, next) => {
  req.user = {
    _id: '645c83ae63a7799623e8df48' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});
