const format = require('pg-format')
const db = require('../../../db/connection')

exports.checkExists = (table, column, value)=>{
    //throws err if resource does NOT exist
    const queryStr = format(`SELECT * FROM %I WHERE %I = $1`, table, column)
    return db.query(queryStr, [value])
    .then(({rows})=>{
        if(rows.length === 0){
            //resource does not exist in DB
            return Promise.reject({status: 404, msg: "Resource not found"})
          }
    })
  }