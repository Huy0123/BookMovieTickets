const showtime = require('../models/Showtime')
const rooms = require('../models/Room')
const seats = require('../models/Seat')
const seatTime = require('../models/SeatTime')
class ShowtimeService {

    createShowtime =    async (data) => {
        try{
        data.showtime_start = new Date(data.showtime_start);
        data.showtime_end = new Date(data.showtime_end);
        const newShowtime = await showtime.create(data);
        const seatsInRoom = await seats.find({ room_id: newShowtime.room_id });
        const seatTimes = seatsInRoom.map(seat =>({
                seat_id: seat._id,
                showtime_id: newShowtime._id,
                seat_status: false
            
        }));

        await seatTime.insertMany(seatTimes);
        return newShowtime;
    }catch(error){
        throw error;
    }
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

        return await showtime.find()
        .populate(
            'cinema_id'
        )
    }

    getShowtimeByID = async (id) => {
        return await showtime.findById(id)
        .populate(
            'cinema_id room_id movie_id'
        );
    }

    updateShowtime = async (id, data) => {
        return await showtime.findByIdAndUpdate(id, data, { new: true });
    }

    deleteShowtime = async (id) => {
        const showtimeData = await showtime.findById(id);
        if(showtimeData.showtime_end < new Date()){
        await seatTime.deleteMany({ showtime_id: id });
        await showtime.findByIdAndDelete(id);
        }else{
            throw new Error('Showtime is not over yet');
        }
    }

    getShowtimesByMovieID = async (id) => {
        return await showtime.find({ movie_id: id })
        .populate(
            'cinema_id room_id movie_id'
        );
    }

    getShowtimesByCinemaID = async (id) => {
        return await showtime.find({ cinema_id: id })
        .populate(
            'cinema_id', 'name'
        )
        .populate(
            'room_id', 'name'
        )
        .populate(
            'movie_id'
        );
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
    
    getShowtimeByMovieFromCinemaId = async (movieID, cinemaID) => {
        return await showtime.find({
            movie_id: movieID,
            cinema_id: cinemaID,
            
        })
        .populate('cinema_id movie_id');;
    };
}

module.exports = new ShowtimeService;