const articlesRouter = require('express').Router()
const {getArticles, getArticleByID, patchArticle, postArticle} = require('../controllers/articles-controller')
const {getCommentsByArticleID, postComment} = require('../controllers/comments-controller') 

articlesRouter
    .route('/') // /api/articles
    .get(getArticles)
    .post(postArticle)

articlesRouter
    .route('/:article_id') // /api/articles/article_id
    .get(getArticleByID)
    .patch(patchArticle)

articlesRouter
    .route('/:article_id/comments') // /api/articles/article_id/comments ? 
    .get(getCommentsByArticleID)
    .post(postComment)

module.exports = articlesRouter