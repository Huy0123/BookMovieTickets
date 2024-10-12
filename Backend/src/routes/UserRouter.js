const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController.js')
const autAdmin = require('../middleware/autAdmin.js')
const autUser = require('../middleware/autUser.js')

router.post('/signup', UserController.createUser)
router.post('/login',UserController.login)
router.post('/logout',UserController.logout)
router.post('/forgotpassword',UserController.forgotpassword)
router.put('/reset-password',UserController.resetpassword)
router.get('/getUsers',autUser,UserController.getUsers)
router.get('/getUserByID/:id',autUser, UserController.getUserByID);
router.post('/refresh_token',autUser,UserController.refreshToken);
router.put('/updateUser/:id',autUser, UserController.updateUser);
router.delete('/deleteUser/:id',autUser, UserController.deleteUser);
module.exports = router 