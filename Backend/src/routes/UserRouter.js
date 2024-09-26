const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController.js')

router.post('/signup', UserController.createUser)
router.post('/login',UserController.login)
router.get('/getUsers',UserController.getUsers)

module.exports = router