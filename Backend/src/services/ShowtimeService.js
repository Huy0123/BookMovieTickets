const showtime = require('../models/Showtime')
const rooms = require('../models/Room')
class ShowtimeService {

    createShowtime = async (data) => {
        return await showtime.create(data);
    }

    getRoomAvailabilityByCinemaIDAndDate = async (cinemaID, showtime_start, showtime_end) => {
        try {
            const conflictingShowtimes = await showtime.find({
                cinema_id: cinemaID,
                $or: [
                    // Suất chiếu mới bắt đầu trong khoảng của suất chiếu hiện có
                    { showtime_start: { $lt: showtime_end, $gte: showtime_start } },
                    // Suất chiếu hiện tại kết thúc sau khi suất chiếu mới bắt đầu
                    { showtime_end: { $gt: showtime_start, $lte: showtime_end } }
                ]
            }).select('room_id'); // phòng đang bận
    
            
    
            // Danh sách các phòng đang bận
            const busyRoomIds = conflictingShowtimes.map(showtime => showtime.room_id);
    
            
    
            const availableRooms = await rooms.find({
                cinema_id: '66fbf96791e08c377610139b',
            });
    
            
    
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