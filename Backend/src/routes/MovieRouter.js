const express = require('express')
const router = express.Router()
const movieController = require('../controllers/MovieController')
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/createMovie', upload.fields([{ name: 'poster' }, { name: 'trailer' }]), movieController.createMovie);


router.get('/getMovies', movieController.getMovies);

router.get('/getMovieByID/:id', movieController.getMovieByID);

router.put('/updateMovie/:id', upload.fields([{ name: 'poster'}, { name: 'trailer'}]), movieController.updateMovie);

router.delete('/deleteMovie/:id', movieController.deleteMovie);

module.exports = router