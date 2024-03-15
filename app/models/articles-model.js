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
    let {sort_by, order, limit, p} = query
    const queryArr = []
    const keys = Object.keys(query)

    const validColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']

    let sort_byCount = 0
    let orderCount = 0
    let limitCount = 0
    let pCount = 0
    let columnName = ''
    const showFrom = 1

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

    if(limit){
        limitCount = 1
    } else {
        limit = '10'
    }

    if(p){
        pCount = 1
        //calc p - how will you ensure the responses are organised in pages with number of elements equal to limit specified 
    } else {

    }

    if(keys.length - sort_byCount - orderCount - limitCount - pCount > 0){
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

        queryStr += ` WHERE articles.topic = $1`
        //modify this to allow for filtering by any column 
        queryArr.push(filterValue) 
    }

        queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by==='comment_count' ? 'comment_count' : 'articles.'+sort_by} ${order} LIMIT ${limit};`
        //this doesn't allow you to order by comment_count as it is not on articles
        //if(sort_by==='comment_count')
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

exports.addArticle = (newArticle)=>{
    const {author, title, body, topic, article_img_url} = newArticle
    const inputs = [author, title, body, topic, article_img_url]
    let queryStr = `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`

    queryStr += `, (SELECT COUNT(*) FROM comments WHERE article_id = articles.article_id) AS comment_count;`
    return db.query(queryStr, inputs)
}

