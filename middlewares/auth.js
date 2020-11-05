const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

module.exports = (request, response, next) => { // eslint-disable-line consistent-return
  const { JWT_SECRET = 'dev-key' } = process.env;

  const { authorization } = request.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let userId;

  try {
    userId = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
    return;
  }

  request.user = userId;
  next();
};
