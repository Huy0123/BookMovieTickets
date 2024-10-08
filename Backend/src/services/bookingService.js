const FoodAndDrinkModel = require('../models/FoodAndDrinkModel.js');
const TicketsModel = require('../models/TicketsModel.js');
const OrdersModel = require('../models/OrdersModel.js');
const OrderItemModel = require('../models/OrderItemModel.js');
const PaymentModel = require('../models/PaymentModel.js');
const userModel = require('../models/userModel.js');
const SeatModel = require('../models/Seat.js');
const RoomModel = require('../models/Room.js');
const ShowtimeModel = require('../models/Showtime.js');

class bookingService {
    createBooking = async (data) => {
        try {
            const { user_id, showtime_id, seat_ids, food_items, payment_method } = data;
            if (!user_id || !showtime_id || !seat_ids) {
                throw new Error('Missing required fields');
            }
            
            const showtime = await ShowtimeModel.findOne({_id:showtime_id})
            const seat = await SeatModel.findOne({_id:seat_ids,room_id:showtime.room_id}); 

            if (!showtime) {
                throw new Error('Seat not found');
            }
            console.log(showtime) 
            console.log(seat) 
            var total_price = 0; 
        
            const tickets = [];
            // Tạo đơn hàng trước
            const order = new OrdersModel({
                user_id,
                order_date: new Date(),
                total_price
            });
            const savedOrder = await order.save();
            const order_id = savedOrder._id;

            // Tạo vé
            
            for (const seat_id of seat_ids) {
                const seat = await SeatModel.findOne({ _id: seat_id, room_id: showtime.room_id });
                if (!seat) {
                    throw new Error(`Seat with ID ${seat_id} not found`);
                }

                // Tạo vé
                const ticket = new TicketsModel({
                    order_id: order_id,
                    showtime_id,
                    user_id,
                    seat_id,
                    price: seat.price // Giá vé
                });
                await ticket.save();
                tickets.push(ticket);

                // Cập nhật tổng giá
                total_price += seat.price;

                // Tạo đồ ăn nếu có
                
            }

            const orderItems = [];
            const items = food_items || [];
                for (const item of items) {
                    const productItem = await FoodAndDrinkModel.findById(item.item_id);
                    if (productItem) {
                        const orderItem = new OrderItemModel({
                            order_id: order_id,
                            item_id: productItem._id,
                            quantity: item.quantity,
                            price: productItem.price * item.quantity
                        });
                        await orderItem.save();
                        orderItems.push(orderItem);
                        total_price += productItem.price * item.quantity; // Cập nhật tổng giá
                    }
                }
            // Cập nhật tổng giá cho đơn hàng
            await OrdersModel.updateOne({ _id: order_id }, { total_price });
            

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

            return { message:"Thanh toán thành công ",order_id, fullname, tickets, payment_method, orderItems ,total_price};
        } catch (error) {
            console.error(error);
            throw new Error('Error creating booking: ' + error.message);
        }
    }
}

module.exports = new bookingService();
