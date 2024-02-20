const db = require('../../db/connection')

exports.selectTopics = ()=>{
    const queryStr = `SELECT * FROM topics;`
    return db.query(queryStr)
        .then(({rows})=>{
            if(rows.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: "Not found"
                })
            }
            return rows
        })


}