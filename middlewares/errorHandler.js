const { ServerError } = require('../errors/errors');

module.exports = (myError, request, response, next) => { // eslint-disable-line no-unused-vars
  if (!myError.status) { myError = new ServerError(); } // eslint-disable-line no-param-reassign
  response.status(myError.status).send({ message: myError.message });
};
