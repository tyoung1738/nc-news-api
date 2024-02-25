const topicsRouter = require('express').Router()

const {getTopics} = require('../controllers/topics-controller')

topicsRouter
    .route('/') // /api/topics
    .get(getTopics)

module.exports = topicsRouter