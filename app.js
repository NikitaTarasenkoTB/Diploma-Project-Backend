const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');

const app = express();
require('dotenv').config();

const { PORT = 3000 } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { requestLogger, errorLogger } = require('./middlewares/logger');

const appRouter = require('./routes/index');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

const { signin, signup } = require('./controllers/users');
const { NotFoundError } = require('./errors/errors');

mongoose.connect('mongodb://localhost:27017/diplomadb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signin);

app.post('/api/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().trim().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), signup);

app.use('/api', auth, appRouter);
app.use((request, response, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
console.log(`Listening port: ${PORT}`);
