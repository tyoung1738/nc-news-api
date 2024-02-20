const db = require('../../db/connection')

exports.selectArticleByID = (articleID)=>{
    const queryStr = `SELECT * FROM articles WHERE article_id = $1`
    return db.query(queryStr, [articleID])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Not found"
            })
        } else{
            return rows
        }
    })
}

