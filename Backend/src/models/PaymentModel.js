const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createPayment = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Orders',  
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending'
    }
});

const Payment = mongoose.model('Payments', createPayment);
module.exports = Payment;
