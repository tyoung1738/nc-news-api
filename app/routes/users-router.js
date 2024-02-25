const usersRouter = require('express').Router()
const {getUsers} = require('../controllers/users-controller')

usersRouter
    .route('/') // /api/users
    .get(getUsers)

module.exports = usersRouter