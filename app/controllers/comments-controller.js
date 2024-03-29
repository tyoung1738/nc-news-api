const {selectCommentsByArticleID, addComment, removeComment, updateComment} = require('../models/comments-model')

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

exports.deleteComment = (req, res, next)=>{
    const commentID = req.params.comment_id    
    removeComment(commentID)
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
}

exports.patchComment = (req, res, next)=>{
    const commentID = req.params.comment_id
    const voteIncrement = req.body.inc_votes || 0

    updateComment(voteIncrement, commentID)
    .then((comment)=>{
        res.status(200).send({comment})
    })
    .catch((err)=>{
        next(err)
    })

}