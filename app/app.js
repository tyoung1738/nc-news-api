const express = require('express')
const app = express()
const { getTopics, getAllEndpoints, getArticleByID, getArticles, getCommentsByArticleID, postComment, patchArticle } = require('./controllers/index')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleByID)

app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

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