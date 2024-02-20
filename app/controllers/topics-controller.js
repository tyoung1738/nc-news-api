const {selectTopics} = require('../models/topics-model')

exports.getTopics = (req, res, next) =>{
    selectTopics().then(({rows}) =>{
        res.status(200).send({topics: rows})
    })
    .catch((err)=>{
        next(err)
    })
}