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

exports.selectAllArticles = async (query)=>{
    //{ sort_by: 'author', order: 'desc', colName: 'cats' }
    
    //DEFINING QUERY PARAMETERS
    let {sort_by, order} = query
    const queryArr = []
    const keys = Object.keys(query)

    const validColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']

    let sort_byCount = 0
    let orderCount = 0
    let columnName = ''

    if(sort_by){
        sort_byCount = 1
        if(!validColumns.includes(sort_by)){
            //provided but invalid value
            sort_by = 'created_at'
        }
    } else{
        sort_by = 'created_at'
    }

    if(order){
        orderCount = 1
        if(order.toUpperCase() !== 'DESC' && order.toUpperCase() !== 'ASC'){
            //provided but invalid value
            order = 'DESC'
        }
    } else{
        order = 'DESC'
    }

    if(keys.length - sort_byCount - orderCount > 0){
        //has colName attempt
        [columnName] = keys.filter((element)=>((element !== 'sort_by') && (element !== 'order')))
        //but it's invalid
        if(!validColumns.includes(columnName)){
            return Promise.reject({status: 404, msg: "Resource not found"})
        }
    }

    const filterValue = query[columnName]

    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    //VALIDATION -> ERRORS 

    if(filterValue){
        await checkExists('topics', 'slug', filterValue) 
        //ANS - NO? does this need .catch() to pass the err to middleware?
        queryStr += ` WHERE articles.topic = $1`
        //modify this to allow for filtering by any column 
        queryArr.push(filterValue) 
    }

        queryStr += ` GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order};`
        //this doesn't allow you to order by comment_count as it is not on articles
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

