const { selectArticleByID, selectAllArticles, updateArticle } = require('../models/articles-model')

exports.getArticleByID = (req, res, next)=>{
    const articleID = req.params.article_id

    selectArticleByID(articleID)
    .then((rows)=>{
        res.status(200).send({article: rows})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getArticles = (req, res, next)=>{
    selectAllArticles().then(({rows})=>{
        res.status(200).send({articles : rows})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.patchArticle = (req, res, next)=>{
    const articleID = req.params.article_id
    const voteIncrement = req.body.inc_votes
    updateArticle(articleID, voteIncrement).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}
