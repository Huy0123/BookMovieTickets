const express = require('express')
const router = express.Router()
const BookingController = require('../controllers/BookingController.js')

router.post('/',BookingController.createBooking)

module.exports = router

