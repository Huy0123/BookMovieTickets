const express = require('express')
const router = express.Router()
const seatTimeController = require('../controllers/SeatTimeController.js')

router.post('/createSeatTime', seatTimeController.createSeatTime)
router.get('/getSeatTimes', seatTimeController.getSeatTimes)
router.get('/getSeatTimeByID/:id', seatTimeController.getSeatTimeByID)
router.put('/updateSeatTime/:id', seatTimeController.updateSeatTime)
router.delete('/deleteSeatTime/:id', seatTimeController.deleteSeatTime)
router.get('/getSeatTimeByShowtimeID/:id', seatTimeController.getSeatTimeByShowtimeID)

module.exports = router 
