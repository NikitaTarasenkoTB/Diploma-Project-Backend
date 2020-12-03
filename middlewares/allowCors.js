module.exports = (request, response, next) => {
  const allowedCors = ['localhost:8080']
  const { origin } = request.headers;
  if (allowedCors.includes(origin)) {
    response.header('Access-Control-Allow-Origin', origin);
  }
  next();
}