const mongoose = require('mongoose');

const createPayment = new mongoose.Schema({
    booking_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookings',
        required: true
    },
    payment_date:{
        type: Date,
        required: true
    },
    trainsaction_id:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('payments', createPayment);
module.exports = createPayment;