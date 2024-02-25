const usersRouter = require('express').Router()
const {getUsers, getUserByUsername} = require('../controllers/users-controller')

usersRouter
    .route('/') // /api/users
    .get(getUsers)
    
usersRouter
    .route('/:username') // /api/users/:username
    .get(getUserByUsername)

module.exports = usersRouter