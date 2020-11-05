const appRouter = require('express').Router();

const articlesRouter = require('./articles');
const usersRouter = require('./users');

appRouter.use(articlesRouter);
appRouter.use(usersRouter);

module.exports = appRouter;
