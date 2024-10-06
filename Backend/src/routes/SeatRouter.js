const express = require('express')
const router = express.Router()
const seatController = require('../controllers/SeatController')

router.post('/createSeat', seatController.createSeat)
router.get('/getSeats', seatController.getSeats)
router.get('/getSeatByID/:id', seatController.getSeatByID)
router.put('/updateSeat/:id', seatController.updateSeat)
router.delete('/deleteSeat/:id', seatController.deleteSeat)
router.get('/getSeatByRoomID/:id', seatController.getSeatByRoomID)
module.exports = router