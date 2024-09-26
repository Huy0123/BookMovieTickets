const express = require('express')
const router = express.Router()
const signup = require('../controllers/UserController.js')

router.post('/signup', signup.createUser)
router.post('/login',signup.login)

module.exports = router