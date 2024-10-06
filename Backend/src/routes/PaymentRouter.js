const express = require('express')
const router = express.Router()
const PaymentController = require('../controllers/paymentController.js')

router.post('/payment',PaymentController.payment)
router.post('/callback',PaymentController.callback)
router.post('/status',PaymentController.status)

module.exports = router;