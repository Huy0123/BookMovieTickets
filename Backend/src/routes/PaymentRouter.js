const express = require('express')
const router = express.Router()
const PaymentController = require('../controllers/paymentController')

router.get('/getPaymentById/:id',PaymentController.getPaymentById)
router.get('/getPayment',PaymentController.getPayment)
router.post('/createrVnpay',PaymentController.createrVnpay)
router.get('/vnpay-return/:query',PaymentController.returnVnpay)
router.post('/callback',PaymentController.callback)
router.post('/status',PaymentController.status)
router.post('/',PaymentController.payment)
router.get('/getPaymentByCinemaId/:id',PaymentController.getPaymentByCinemaId)
module.exports = router;