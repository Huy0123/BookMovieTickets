const FoodAndDrinkModel = require('../models/FoodAndDrinkModel.js');
const TicketsModel = require('../models/TicketsModel.js');
const OrdersModel = require('../models/OrdersModel.js');
const OrderItemModel = require('../models/OrderItemModel.js');
const PaymentModel = require('../models/PaymentModel.js');
const userModel = require('../models/userModel.js');

class bookingService {
    createBooking = async (data) => {
        try {
            const { user_id, showtime_id, seat_number, food_items, payment_method, total_price } = data;
            if (!user_id || !showtime_id || !seat_number) {
                throw new Error('Missing required fields');
            }

            // Tạo đơn hàng trước
            const order = new OrdersModel({
                user_id,
                order_date: new Date(),
                total_price
            });
            const savedOrder = await order.save();
            const order_id = savedOrder._id;

            // Tạo vé
            const ticket = new TicketsModel({
                order_id: order_id,
                showtime_id,
                user_id,
                seat_number,
                price: 1000 // Giá vé
            });
            await ticket.save();

            // Tạo đồ ăn nếu có
            const orderItems = [];
            const items = food_items || [];
            for (const item of items) {
                const productItem = await FoodAndDrinkModel.findById(item.item_id);
                if (productItem) {
                    const orderItem = new OrderItemModel({
                        order_id : order_id,
                        item_id: productItem._id,
                        quantity: item.quantity,
                        price: productItem.price*item.quantity
                    });
                    await orderItem.save();
                    orderItems.push(orderItem);
                }
            }

            // Lưu thông tin thanh toán nếu có
            if (payment_method) {
                const payment = new PaymentModel({
                    order_id,
                    payment_method: payment_method,
                    amount: total_price, // Sử dụng total_price từ body
                    date: new Date()
                });
                await payment.save();
            }

            // Lấy thông tin người dùng
            const user = await userModel.findById(user_id).select('fullname');
            const fullname = user.fullname;

            return { order_id, fullname, ticket, payment_method, orderItems };
        } catch (error) {
            console.error(error);
            throw new Error('Error creating booking: ' + error.message);
        }
    }
}

module.exports = new bookingService();
