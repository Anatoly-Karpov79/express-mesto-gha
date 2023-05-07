const express = require('express');
const mongoose = require('mongoose');

// Слушаем 3000 порт
const { PORT = 5000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// подключаем мидлвары, роуты и всё остальное...
app.listen(PORT, () => {
// Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// подключаемся к серверу mongo
