const {selectUsers} = require('../models/users-model')

exports.getUsers = (req, res, next)=>{
    selectUsers()
    .then(({rows})=>{
        res.status(200).send({users: rows})
    })
    .catch((err)=>{
        next(err)
    })
}