const articlesRouter = require('express').Router()
const {getArticles, getArticleByID, patchArticle} = require('../controllers/articles-controller')
const {getCommentsByArticleID, postComment} = require('../controllers/comments-controller') 

articlesRouter
    .route('/') // /api/articles
    .get(getArticles)

articlesRouter
    .route('/:article_id') // /api/articles/article_id
    .get(getArticleByID)
    .patch(patchArticle)

articlesRouter
    .route('/:article_id/comments') // /api/articles/article_id/comments ? 
    .get(getCommentsByArticleID)
    .post(postComment)

module.exports = articlesRouter