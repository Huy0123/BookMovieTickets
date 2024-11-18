const express = require('express')
const router = express.Router()
const showtimeController = require('../controllers/ShowtimeController')

router.post('/createShowtime', showtimeController.createShowtime)
router.get('/getShowtimes', showtimeController.getShowtimes)
router.get('/getShowtimeByID/:id', showtimeController.getShowtimeByID)
router.put('/updateShowtime/:id', showtimeController.updateShowtime)
router.delete('/deleteShowtime/:id', showtimeController.deleteShowtime)
router.get('/getShowtimeByMovieID/:id', showtimeController.getShowtimeByMovieID)
router.get('/getShowtimeByCinemaID/:id', showtimeController.getShowtimeByCinemaID)
router.get('/getShowtimeByMovieIDAndCinemaIDAndDate/:movieID/:cinemaID/:date', showtimeController.getShowtimeByMovieIDAndCinemaIDAndDate)
router.get('/getShowtimeByMovieIDAndCinemaID/:movieID/:cinemaID', showtimeController.getShowtimeByMovieIDAndCinemaID)
router.get('/getRoomAvailability', showtimeController.getRoomAvailabilityByCinemaIDAndDate)
router.get('/getShowtimeByMovieFromCinemaId/:movieID/:cinemaID', showtimeController.getShowtimeByMovieFromCinemaId)

module.exports = router