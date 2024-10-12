const express = require('express')
const router = express.Router()
const PaymentController = require('../controllers/paymentController')


router.post('/callback',PaymentController.callback)
router.post('/status',PaymentController.status)
router.post('/',PaymentController.payment)

module.exports = router;