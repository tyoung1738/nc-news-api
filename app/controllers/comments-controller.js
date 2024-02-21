const { query } = require('../../db/connection')
const {selectCommentsByArticleID, addComment} = require('../models/comments-model')

exports.getCommentsByArticleID = (req, res, next)=>{
    const articleID = req.params.article_id

    selectCommentsByArticleID(articleID)
    .then((comments)=>{
        res.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postComment = (req, res, next)=>{
    const articleID = req.params.article_id
    const commentInput = req.body

    addComment(commentInput, articleID)
    .then(([checkExists, queryResult])=>{
        [commentOutput] = queryResult.rows
        res.status(201).send({comment: commentOutput})
    })
    .catch((err)=>{
        next(err)
    })
}