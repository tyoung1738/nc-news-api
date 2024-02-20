const {selectCommentsByArticleID} = require('../models/comments-model')

exports.getCommentsByArticleID = (req, res, next)=>{
    const articleID = req.params.article_id

    selectCommentsByArticleID(articleID)
    .then((rows)=>{
        res.status(200).send({comments: rows})
    })
    .catch((err)=>{
        next(err)
    })
}