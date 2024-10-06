const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const createOrderItem = new mongoose.Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Orders',
        required: true
    },
    item_id: {
        type: Schema.Types.ObjectId, // Tham chiếu đến Food_and_Drink hoặc Tickets
        required: true
    },
    item_type: {
        type: String,
        enum: ['ticket', 'food','drink'],  
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const OrderItem = mongoose.model('Order_Items', createOrderItem);
module.exports = OrderItem;
