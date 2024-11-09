const FoodController = require('../controllers/FoodController.js')
const express = require('express')
const router = express.Router()
const multer = require('multer')

const upload = multer({
    storage: multer.memoryStorage(),
})


router.get('/getFood',FoodController.getFood)
router.get('/getFoodById/:id',FoodController.getFoodById)
router.post('/createrFood',upload.fields([{name:'Image'}]),FoodController.createrFood)
router.put('/editFood/:id',upload.fields([{name:'Image'}]),FoodController.editFood)

module.exports = router