const db = require('../../db/connection')

exports.selectCommentsByArticleID = (articleID)=>{
    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
    return db.query(queryStr, [articleID])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Not found"
            })
        } else {
            return rows
        }
    })
}