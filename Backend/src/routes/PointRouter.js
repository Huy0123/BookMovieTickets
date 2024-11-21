const multer = require('multer')
const express = require('express')
const router = express.Router()
const autUser = require('../middleware/autUser.js')

const pointController = require('../controllers/PointController.js')

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/createPoint', upload.single('image'), pointController.createPoint)
router.get('/getPoints',  pointController.getPoints)
router.get('/getPointByID/:id', pointController.getPointByID)

router.put('/updatePoint/:id', upload.single('image'), pointController.updatePoint)

router.delete('/deletePoint/:id', pointController.deletePoint)
router.post('/exchange', pointController.exchange); 
module.exports = router