const express = require('express')
const app = express()
const { getTopics, getAllEndpoints, getArticleByID, getArticles, getCommentsByArticleID, postComment, patchArticle, deleteComment, getUsers } = require('./controllers/index')
const apiRouter = require('./routes/api-router.js')
const cors = require('cors');

app.use(cors())
app.use(express.json())
app.use('/api', apiRouter)

app.get('/api', getAllEndpoints)

//ERROR HANDLING
app.all('/*', (req, res, next)=>{
    const err = new Error("Not found")
    err.statusCode = 404
    res.status(404).send({msg: "Not found"})
    next(err)
})

app.use((err, req, res, next) =>{
    //psql errors
    
    if(err.code === '22P02' || err.code === '23502'){
        res.status(400).send({msg: "Bad request"})
    }
    if(err.code === '23503'){
        res.status(404).send({msg: "Not found"})
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