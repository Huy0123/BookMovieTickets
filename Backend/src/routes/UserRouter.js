const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController.js')
const autAdmin = require('../middleware/autAdmin.js')
const autUser = require('../middleware/autUser.js')

router.post('/signup', UserController.createUser)
router.post('/login',UserController.login)
router.get('/getUsers',autAdmin,UserController.getUsers)
router.get('/getUserByID/:id',autUser, UserController.getUserByID);
router.post('/refresh_token',autAdmin,UserController.refreshToken);
router.put('/updateUser/:id',autUser, UserController.updateUser);
router.delete('/deleteUser/:id',autUser, UserController.deleteUser);
module.exports = router 