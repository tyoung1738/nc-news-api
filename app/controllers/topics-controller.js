const {selectTopics} = require('../models/topics-model')

exports.getTopics = (req, res, next) =>{
    selectTopics().then((response) =>{
        res.status(200).send({topics: response})
    })
    .catch((err)=>{
        next(err)
    })
}