const db = require('../../db/connection')
const { checkExists } = require('./utils/utils')

exports.selectUsers = ()=>{
    const queryStr = `SELECT * FROM users;`
    return db.query(queryStr)
}

exports.selectUserByUsername = (username)=>{
    const queryStr = `SELECT * FROM users
    WHERE username = $1`
    const query = db.query(queryStr, [username])
    return Promise.all([checkExists('users', 'username', username), query])
    .then(([checkExists, queryResult])=>{
        const [user] = queryResult.rows
        return user
    })
}