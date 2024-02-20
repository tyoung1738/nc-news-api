const express = require('express')
const app = express()
const { getTopics, getAllEndpoints } = require('./controllers/index')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getAllEndpoints)

//ERROR HANDLING
app.use((err, req, res, next)=>{
    //custom errors 
    if(err.status && err.msg){
        response.status(err.status).send({msg: err.msg})
    } else next(err)

})

app.use((err, req, res, next) =>{
    //psql errors
    const psqlErrCodes = {}

    if(Object.keys(psqlErrCodes).includes(err.code)){
        response.status(400).send({msg: "Bad request"})
    }
})

module.exports = app