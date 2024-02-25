const commentsRouter = require('express').Router()
const {deleteComment, patchComment} = require('../controllers/comments-controller')

commentsRouter
    .route('/:comment_id') // /api/comments/:comment_id
    .delete(deleteComment)
    .patch(patchComment)

module.exports = commentsRouter

