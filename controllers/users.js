const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFoundError, BadRrequestError, ConflictError, UnauthorizedError,
} = require('../errors/errors');

const { JWT_SECRET = 'dev-key' } = process.env;

function getMe(request, response, next) {
  User.findById(request.user._id)
    .then((userData) => {
      if (userData) {
        response.send({ data: userData });
      } else {
        throw new NotFoundError();
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRrequestError());
        return;
      }
      next(error);
    });
}

function signup(request, response, next) { // eslint-disable-line consistent-return
  const { email, password, name } = request.body;
  bcrypt.hash(password, 10)
    .then((passwordHash) => User.create({ email, password: passwordHash, name })
      .then((newUserData) => {
        newUserData.password = undefined; // eslint-disable-line no-param-reassign
        response.send({ data: newUserData });
      })
      .catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
          next(new ConflictError('Почта уже зарегестрирована'));
          return;
        } if (error.name === 'ValidationError') {
          next(new BadRrequestError());
          return;
        }
        next(error);
      }));
}

function signin(request, response, next) {
  const { email, password } = request.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      response.status(200).send({ token });
    })
    .catch((error) => next(new UnauthorizedError(error.message)));
}

module.exports = {
  getMe,
  signup,
  signin,
};
