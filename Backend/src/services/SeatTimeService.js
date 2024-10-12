const seatTime = require('../models/SeatTime')
const showtimes = require('../models/Showtime')
const seats = require('../models/Seat')
class SeatTimeService {

    createSeatTime = async (data) => {
        return await seatTime.create(data)
    }

    getSeatTimes = async () => {
        return await seatTime.find()
    }

    getSeatTimeByID = async (id) => {
        return await seatTime.findById(id)
    }

    updateSeatTime = async (id, data) => {
        return await seatTime.findByIdAndUpdate(id, data, { new: true })
    }

    deleteSeatTime = async (id) => {
        return await seatTime.findByIdAndDelete(id)
    }

    getSeatTimeByShowtimeID = async (id) => {
        const showtime = await showtimes.findById(id).lean()
        if (!showtime) {
            throw new Error('Showtime not found')
        }
        const seatsInRoom = await seats.find({ room_id: showtime.room_id }).lean()
        const seatTimes = await seatTime.find({ showtime_id: id }).populate('seat_id').lean()
        const seatMap =  seatTimes.reduce((acc, seatTime) => {
            acc[seatTime.seat_id] = seatTime
            return acc
        }, {})

        const seatsWithStatus = seatsInRoom.map(seat => {
            return {
                ...seat,
                status: seatMap[seat._id] ? seatMap[seat._id].seat_status : false
            }
        })
        return seatsWithStatus;
    }
}

module.exports = new SeatTimeService()