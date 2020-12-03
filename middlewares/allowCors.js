module.exports = (request, response, nex) => {
  const allowedCors = ['localhost:8080']
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
}