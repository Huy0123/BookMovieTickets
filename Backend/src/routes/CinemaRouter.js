const express = require('express')
const router = express.Router()
const cinemaController = require('../controllers/CinemaController')

router.post('/createCinema', cinemaController.createCinema)
router.get('/getCinemas', cinemaController.getCinemas)
router.get('/getCinemaByID/:id', cinemaController.getCinemaByID)
router.put('/updateCinema/:id', cinemaController.updateCinema)
router.delete('/deleteCinema/:id', cinemaController.deleteCinema)
router.get('/getCinemasByMovieID/:id', cinemaController.getCinemasByMovieID)
router.get('/getCinemasByCity/:city', cinemaController.getCinemasByCity)
router.get('/getCinemasByMovieIDAndCity/:id/:city', cinemaController.getCinemasByMovieIDAndCity)
module.exports = router