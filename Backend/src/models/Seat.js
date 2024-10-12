const mongoose = require('mongoose');

const createSeat = new mongoose.Schema({
    room_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true
    },
    seat_number:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    seat_type:{
        type: String,
        required: true
    }

});

const seats = mongoose.model('seats', createSeat);
module.exports = seats;