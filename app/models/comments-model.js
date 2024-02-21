const db = require('../../db/connection')
const {checkExists} = require('../models/utils/utils')

exports.selectCommentsByArticleID = (articleID)=>{
    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`

    const query = db.query(queryStr, [articleID])
    return Promise.all([query, checkExists('articles', 'article_id', articleID)])
    .then(([queryResult, checkExists])=>{
        //if checkExists resolves, return rows
        return queryResult.rows
    })
}

exports.addComment = (comment, articleID)=>{
    const {username, body} = comment
    const inputs = [body, username, Number(articleID)]

    const queryStr = `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`
    const query = db.query(queryStr, inputs)
    return Promise.all([checkExists('articles', 'article_id', articleID), query])
}