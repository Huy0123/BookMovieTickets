const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController.js')
const aut = require('../middleware/aut.js')

router.post('/signup', UserController.createUser)
router.post('/login',UserController.login)
router.get('/getUsers',aut,UserController.getUsers)
router.post('/refresh_token',UserController.refreshToken)

module.exports = router