const db = require('../../db/connection')
const {checkExists} = require('../models/utils/utils')

exports.selectArticleByID = (articleID)=>{
    const queryStr = `SELECT * FROM articles WHERE article_id = $1`
    const query = db.query(queryStr, [articleID])
    return Promise.all([query, checkExists('articles', 'article_id', articleID)])
    .then(([queryResult])=>{
        const [articleObj] = queryResult.rows
        return articleObj
    })
}

exports.selectAllArticles = ()=>{
    const queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    return db.query(queryStr)
}

exports.updateArticle = (articleID, voteIncrement)=>{
    const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`
    const query = db.query(queryStr, [voteIncrement, articleID])
    return Promise.all([checkExists('articles', 'article_id', articleID),query]) 
    .then(([checkExists, queryResult])=>{
        const [updatedArticle] = queryResult.rows
        return updatedArticle
    })
}

