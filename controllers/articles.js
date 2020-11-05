const Article = require('../models/article');
const { BadRrequestError, NotFoundError, ForbiddenError } = require('../errors/errors');

function getArticles(request, response, next) {
  Article.find({ owner: request.user._id })
    .then((articlesData) => {
      if (!articlesData) {
        throw new NotFoundError();
      } else {
        response.send({ data: articlesData });
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

function postArticle(request, response, next) {
  const {
    keyword, title, text, date, source, link, image,
  } = request.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: request.user._id,
  })
    .then((articleData) => response.send({ data: articleData }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRrequestError());
        return;
      }
      next(error);
    });
}

function deleteArticle(request, response, next) {
  Article.findById(request.params.articleId).select('+owner')
    .then((articleData) => {
      if (articleData) {
        if (String(request.user._id) === String(articleData.owner)) {
          Article.findByIdAndRemove(request.params.articleId)
            .then((removedArticleData) => response.send({ data: removedArticleData }))
            .catch(next);
        } else {
          throw new ForbiddenError();
        }
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

module.exports = {
  getArticles,
  postArticle,
  deleteArticle,
};
