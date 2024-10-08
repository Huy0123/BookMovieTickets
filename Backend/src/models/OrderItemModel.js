const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createOrderItem = new Schema({
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Orders', // Tham chiếu đến đơn hàng
        required: true
    },
    item_id: {
        type: Schema.Types.ObjectId,
        required: true // Yêu cầu item_id, không để trống
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

// Tạo model cho OrderItem
const OrderItem = mongoose.model('Order_Items', createOrderItem);
module.exports = OrderItem;
