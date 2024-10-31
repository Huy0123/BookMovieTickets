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
        const showtime = await showtimes.findById(id).lean();
    if (!showtime) {
        throw new Error('Showtime not found');
    }
    // Lấy tất cả ghế trong phòng tương ứng với suất chiếu
    const seatsInRoom = await seats.find({ room_id: showtime.room_id }).populate('room_id').lean();
    // Lấy tất cả thời gian ghế cho suất chiếu
    const seatTimes = await seatTime.find({ showtime_id: id }).populate('seat_id').lean();
    // Tạo bản đồ cho thời gian ghế để dễ dàng tra cứu
    const seatMap = seatTimes.reduce((acc, seatTime) => {
        acc[seatTime.seat_id] = seatTime; // seat_id là khóa
        return acc;
    }, {});
    // Kết hợp thông tin ghế với thời gian ghế
    const seatsWithStatus = seatsInRoom.map(seat => {
        return {
            seat_id: seat._id,
            seat_number: seat.seat_number,
            seat_type: seat.seat_type,
            status: seatMap[seat._id] ? seatMap[seat._id].seat_status : false, // Trạng thái ghế
            seat_time_id: seatMap[seat._id] ? seatMap[seat._id]._id : null, // ID của seatTime
            // Thêm các thông tin khác từ seatTime nếu cần
        };
    });
    return {
        // showtime: showtime,
        // seats: seatsWithStatus, // Trả về ghế cùng với trạng thái
        seatTimes: seatTimes // Trả về thời gian ghế tương ứng
    };
};
}

module.exports = new SeatTimeService()