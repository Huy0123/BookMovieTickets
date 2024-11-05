const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController.js')
const SendEmailController = require('../controllers/SendEmailController')
const autAdmin = require('../middleware/autAdmin.js')
const autUser = require('../middleware/autUser.js')

router.post('/signup', UserController.createUser)
router.post('/login',UserController.login)
router.post('/logout',UserController.logout)
router.post('/forgotpassword',SendEmailController.SendEmailforgotpassword)
router.put('/reset-password',UserController.resetpassword)
router.get('/getUsers',autAdmin,UserController.getUsers)
router.get('/getUserByID/:id',autAdmin, UserController.getUserByID) //query
router.get('/getUserbyid',autUser,UserController.getUserbyid)//user
router.post('/refresh_token',autUser,UserController.refreshToken);
router.put('/updateUser/:id',autUser, UserController.updateUser);
router.delete('/deleteUser/:id',autUser, UserController.deleteUser);
module.exports = router 