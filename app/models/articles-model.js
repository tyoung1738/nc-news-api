const db = require('../../db/connection')
const {checkExists} = require('../models/utils/utils')

exports.selectArticleByID = (articleID)=>{
    const queryStr = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url;`
    const query = db.query(queryStr, [articleID])
    return Promise.all([query, checkExists('articles', 'article_id', articleID)])
    .then(([queryResult])=>{
        const [articleObj] = queryResult.rows
        return articleObj
    })
}

exports.selectAllArticles = (query)=>{
    const [columnName] = Object.keys(query)
    const [filterValue] = Object.values(query)
    const queryArr = []

    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    if(columnName){
        //has query
        //check it is a valid query
        const validColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']

        if(!validColumns.find((col)=>col === columnName)){
            return Promise.reject({status: 404, msg: "Resource not found"})
        }
        //check it is a valid filter value in topics data 
        return checkExists('topics', 'slug', filterValue)
        .then(()=>{
            //if so execute full query
            queryStr += ` WHERE articles.topic = $1`
            queryArr.push(filterValue)

            queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
            return db.query(queryStr, queryArr)
        })
    }

    queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    return db.query(queryStr, queryArr)
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

