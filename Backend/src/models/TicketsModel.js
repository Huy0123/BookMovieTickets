const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const createTicket = new mongoose.Schema({
    showtime_id: {
        type: Schema.Types.ObjectId, // Sử dụng ObjectId để tham chiếu đến Showtime
        ref: 'showtimes',             // Tham chiếu tới collection Showtime
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,  // Tham chiếu đến người dùng
        ref: 'users',                  // Tham chiếu tới collection User
        required: true
    },
    seat_id: {
        type: Schema.Types.ObjectId,  // Tham chiếu đến người dùng
        ref: 'seats',                  // Tham chiếu tới collection User
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    purchase_date: {
        type: Date,
        default: Date.now
    },
    order_id: {
        type: Schema.Types.ObjectId, 
        ref: 'Orders',
    }
})
const tickets = mongoose.model('Tickets',createTicket)
module.exports = tickets