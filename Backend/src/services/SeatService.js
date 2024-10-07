const seat = require('../models/Seat')

class SeatService {
    createSeat = async (data) => {
        return await seat.create(data)
    }

    getSeats = async () => {
        return await seat.find()
    }

    getSeatByID = async (id) => {
        return await seat.findById(id)
    }

    updateSeat = async (id, data) => {
        return await seat.findByIdAndUpdate(id, data, { new: true })
    }

    deleteSeat = async (id) => {
        return await seat.findByIdAndDelete(id)
    }

    getSeatByRoomID = async (id) => {
        return await seat.find({ room_id: id })
    }
}

module.exports = new SeatService;