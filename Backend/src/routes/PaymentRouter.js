const express = require('express')
const router = express.Router()
const autUser = require('../middleware/autUser.js')
const PaymentController = require('../controllers/paymentController.js')

router.get('/getPaymentById/:id',PaymentController.getPaymentById)
router.get('/getPaymentByUserId/:id',PaymentController.getPaymentByUserId)
router.get('/getPayment',PaymentController.getPayment)
router.post('/createrZalopay',autUser,PaymentController.createrZalopay)
router.post('/callbackZalopay',PaymentController.callbackZalopay)
router.post('/createrVnpay',autUser,PaymentController.createrVnpay)
router.get('/vnpay-return/:query',PaymentController.returnVnpay)
router.post('/callback',PaymentController.callback)
router.post('/status',autUser,PaymentController.status)
router.post('/',autUser,PaymentController.payment)
router.get('/getPaymentByCinemaId/:id',PaymentController.getPaymentByCinemaId)
router.get('/getPaymentByMovie',PaymentController.getPaymentByMovie)
module.exports = router;