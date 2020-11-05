const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const linkRegExp = require('../regexp');

const { getArticles, postArticle, deleteArticle } = require('../controllers/articles');

articlesRouter.get('/articles', getArticles);
articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(linkRegExp),
    image: Joi.string().required().regex(linkRegExp),
  }),
}), postArticle);
articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = articlesRouter;
