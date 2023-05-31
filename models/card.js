const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  link: {
    type: String, // описание — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    validate: {
      validator(value) {
        return /https?:\/\/(\w{3}\.)?[1-9a-z\-.]{1,}\w\w(\/[1-90a-z.,_@%&?+=~/-]{1,}\/?)?#?/i.test(value);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // тип — String
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false, // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('card', cardSchema);
