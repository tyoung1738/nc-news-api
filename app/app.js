const express = require('express')
const app = express()
const { getTopics } = require('./controllers/topics-controller')

app.use(express.json())

app.get('/api/topics', getTopics)

//ERROR HANDLING
app.use((err, req, res, next) =>{
    //psql errors
    const psqlErrCodes = {}

    if(Object.keys(psqlErrCodes).includes(err.code)){
        response.status(400).send({msg: "Bad request"})
    }
})

app.listen(9090, ()=>{
    console.log('listening on 9090')
})

module.exports = app