const showtime = require('../models/Showtime')
const rooms = require('../models/Room')
const seats = require('../models/Seat')
const seatTime = require('../models/SeatTime')
class ShowtimeService {

    createShowtime =    async (data) => {
        const newShowtime = await showtime.create(data);
        const seatsInRoom = await seats.find({ room_id: newShowtime.room_id });
        const seatTimes = seatsInRoom.map(seat =>({
                seat_id: seat._id,
                showtime_id: newShowtime._id,
                seat_status: false
            
        }));

        await seatTime.insertMany(seatTimes);

        return newShowtime;
    }
    
    getRoomAvailabilityByCinemaIDAndDate = async (cinemaID, showtime_start, showtime_end) => {
        try {
        
            const conflictingShowtimes = await showtime.find({
                cinema_id: cinemaID,
                // Tìm kiếm showtime theo utc
                $or: [
                    {
                        showtime_start: { $gte: showtime_start, $lte: showtime_end }
                    },
                    {
                        showtime_end: { $gte: showtime_start, $lte: showtime_end }
                    }
                ]
            }).select('room_id').lean(); // phòng đang bận
            // Danh sách các phòng đang bận
            const busyRoomIds = conflictingShowtimes.map(showtime => showtime.room_id);

    
            const availableRooms = await rooms.find({
                cinema_id: cinemaID,
                _id: { $nin: busyRoomIds }
            }).lean();
            
            return availableRooms;
    
        } catch (error) {
            console.error("Error fetching room availability:", error);
            throw error;
        }
    }
    

    getShowtimes = async () => {
        return await showtime.find();
    }

    getShowtimeByID = async (id) => {
        return await showtime.findById(id);
    }

    updateShowtime = async (id, data) => {
        return await showtime.findByIdAndUpdate(id, data, { new: true });
    }

    deleteShowtime = async (id) => {
        await showtime.findByIdAndDelete(id);
    }

    getShowtimesByMovieID = async (id) => {
        return await showtime.find({ movie: id });
    }

    getShowtimesByCinemaID = async (id) => {
        return await showtime.find({ cinema_id: id });
    }

    getShowtimesByMovieIDAndCinemaIDAndDate = async (movieID, cinemaID, date) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
    
        const results = await showtime.find({
            movie_id: movieID,
            cinema_id: cinemaID,
            showtime: { $gte: startOfDay, $lte: endOfDay }
        });
        return results;
    };
    

}

module.exports = new ShowtimeService;