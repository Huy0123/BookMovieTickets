<<<<<<< HEAD
const express = require('express')
const router = express.Router()
const BookingController = require('../controllers/BookingController.js')

router.post('/',BookingController.createBooking)

module.exports = router

=======
// const express = require('express')
// const router = express.Router()
// const bookingController = require('../controllers/BookingController')

// router.post('/createBooking', bookingController.createBooking)
// router.get('/getBookings', bookingController.getBookings)
// router.get('/getBookingByID/:id', bookingController.getBookingByID)
// router.put('/updateBooking/:id', bookingController.updateBooking)
// router.delete('/deleteBooking/:id', bookingController.deleteBooking)

// module.exports = router
>>>>>>> 013d85ec86bebbb85163bf916e8516a4a3b91ebe
