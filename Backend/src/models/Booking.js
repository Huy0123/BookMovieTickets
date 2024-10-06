const mongoose = require('mongoose');

const createBooking = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    showtime_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'showtimes',
        required: true
    },
    seat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seats',
        required: true
    },
    booking_date:{
        type: Date,
        required: true
    },
    total_price:{
        type: Number,
        required: true
    },
    payment_status:{
        type: Boolean,
        required: true
    }
});

const bookings = mongoose.model('bookings', createBooking);
module.exports = bookings;