const express = require('express')
const router = express.Router()
const autUser = require('../middleware/autUser.js')

const pointController = require('../controllers/PointController')

router.post('/createPoint', pointController.createPoint)
router.get('/getPoints', pointController.getPoints)
router.get('/getPointByID/:id', pointController.getPointByID)
router.put('/updatePoint/:id', pointController.updatePoint)
router.delete('/deletePoint/:id', pointController.deletePoint)
router.post('/exchange', pointController.exchange); 
module.exports = router