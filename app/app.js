const express = require('express')
const app = express()
const { getTopics, getAllEndpoints, getArticleByID } = require('./controllers/index')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleByID)

// app.all()

//ERROR HANDLING

app.use((err, req, res, next) =>{
    //psql errors
    if(err.code === '22P02'){
        res.status(400).send({msg: "Bad request"})
    }

    next(err)
})

app.use((err, req, res, next)=>{
    //custom errors 
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }

    //catch all
    res.status(500).send({msg: "Internal server error"})

})

module.exports = app