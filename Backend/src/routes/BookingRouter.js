const express = require('express')
const router = express.Router()
const BookingController = require('../controllers/BookingController.js')


router.get('/getBooking',BookingController.GetBooking)
//get danh sanh ve cua user
router.get('/getUserBooking/:id',BookingController.GetUserBookingById)
//get in4 booking vs user oder booking this
router.get('/getBooking/:id',BookingController.GetBookingById)
router.get('/getCinemaBooking/:id',BookingController.getCinemaBookingById)
router.delete('/deleteBooking/:id',BookingController.DeleteBooking)

router.post('/',BookingController.createBooking)
module.exports = router


 