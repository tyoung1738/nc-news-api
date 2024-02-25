const commentsRouter = require('express').Router()
const {getCommentsByArticleID, postComment, deleteComment} = require('../controllers/comments-controller')

commentsRouter
    .route('/:comment_id') // /api/comments/:comment_id
    .delete(deleteComment)

module.exports = commentsRouter

