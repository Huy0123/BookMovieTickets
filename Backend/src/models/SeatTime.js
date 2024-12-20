const mongoose = require('mongoose');

const createSeatTime = new mongoose.Schema({
    seat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seats',
        required: true
    },
    showtime_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'showtimes',
        required: true
    },
    seat_status:{
        type: Boolean,
        required: true
    },
});
createSeatTime.index({ seat_id: 1, showtime_id: 1 }, { unique: true });

const seatTimes = mongoose.model('seatTimes', createSeatTime);
module.exports = seatTimes;