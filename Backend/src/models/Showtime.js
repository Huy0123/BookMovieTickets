const mongoose = require('mongoose');
const seatTimes = require('./SeatTime');
const createShowtime = new mongoose.Schema({
    movie_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movies',
        required: true
    },
    cinema_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cinemas',
        required: true
    },
    room_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true
    },
    showtime_start:{
        type: Date,
        required: true
    },
    showtime_end:{
        type: Date,
        required: true
    }
});

const showtimes = mongoose.model('showtimes', createShowtime);
module.exports = showtimes;

createShowtime.pre('remove', async function(next){
    try{
        await seatTimes.DateMany({showtime_id: this._id});
        next();
    } catch (error){
        next(error);
    }
});