const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');

const app = express();
require('dotenv').config();

const { PORT = 3000 } = process.env;

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const { requestLogger, errorLogger } = require('./middlewares/logger');

const appRouter = require('./routes/index');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const rateLimit = require('./middlewares/rateLimit');
const allowCors = require('./middlewares/allowCors');

const { signin, signup } = require('./controllers/users');
const { NotFoundError } = require('./errors/errors');

const { DB_LINK = 'mongodb://localhost:27017/diplomadb' } = process.env;

mongoose.connect(DB_LINK, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(allowCors);

app.use(requestLogger);

app.post('/api/signin', rateLimit, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), signin);

app.post('/api/signup', rateLimit, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().trim().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), signup);

app.use('/api', rateLimit, auth, appRouter);
app.use((request, response, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
console.log(`Listening port: ${PORT}`);
