const express = require('express')
const router = express.Router()
const roomController = require('../controllers/RoomController.js')

router.post('/createRoom', roomController.createRoom)
router.get('/getRooms', roomController.getRooms)
router.get('/getRoomByID/:id', roomController.getRoomByID)
router.put('/updateRoom/:id', roomController.updateRoom)
router.delete('/deleteRoom/:id', roomController.deleteRoom)
router.get('/getRoomByCinemaID/:id', roomController.getRoomByCinemaID)
module.exports = router