const { selectArticleByID } = require('../models/articles-model')

exports.getArticleByID = (req, res, next)=>{
    const articleID = req.params.article_id

    selectArticleByID(articleID)
    .then((rows)=>{
        res.status(200).send({articles: rows})
    })
    .catch((err)=>{
        next(err)
    })
}