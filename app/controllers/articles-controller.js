const { selectArticleByID, selectAllArticles, updateArticle, addArticle } = require('../models/articles-model')

exports.getArticles = (req, res, next)=>{
    const {query} = req
    
    selectAllArticles(query).then(({rows})=>{
        res.status(200).send({articles : rows})
    })
    .catch((err)=>{
        next(err)
    })
}

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

exports.patchArticle = (req, res, next)=>{
    const articleID = req.params.article_id

    let voteIncrement = req.body.inc_votes || 0
    //default to 0 if not provided 
    
    updateArticle(articleID, voteIncrement).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postArticle = (req, res, next)=>{
    const newArticle = req.body
    addArticle(newArticle)
        .then(({rows})=>{
            const [article] = rows
            res.status(201).send({article})
        })
        .catch((err)=>{
            next(err)
        })
}