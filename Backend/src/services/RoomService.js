const room = require('../models/Room')

class RoomService {
    createRoom = async (data) => {
        return await room.create(data)
    }

    getRoomByCinemaID = async (id) => {
        return await room.find({ cinema_id: id })
    }

    getRooms = async () => {
        return await room.find()
    }

    getRoomByID = async (id) => {
        return await room.findById(id)
    }

    updateRoom = async (id, data) => {
        await room.findByIdAndUpdate(id, data)
        return await room.findById(id)
    }

    deleteRoom = async (id) => {
        await room.findByIdAndDelete(id)
    }
}

module.exports = new RoomService;