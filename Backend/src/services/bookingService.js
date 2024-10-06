const FoodAndDrinkModel = require('../models/FoodAndDrinkModel.js')
const TicketsModel = require('../models/TicketsModel.js')
const OrdersModel = require('../models/OrdersModel.js')
const OrderItemModel = require('../models/OrderItemModel.js')
const PaymentModel = require('../models/PaymentModel.js')
const userModel = require('../models/userModel.js')
const oders = require('../models/OrdersModel.js')


class bookingService {
    createBooking = async (data) => {
       try {
        const { user_id, showtime_id, seat_number, food_items, drink_items, payment_method,total_price } = data;
        if (!user_id || !showtime_id || !seat_number) {
            throw new Error('Missing required fields');
        }
        //tạo vé
        const ticket = new TicketsModel({
            showtime_id,
            user_id,
            seat_number,
            price: 1000 //seat.price 
        });
       
        await ticket.save(); 
        // Cập nhật trạng thái chỗ ngồi
        // seat.seat_status = true; 
        // await seat.save();

        // Tạo đơn hàng nếu có món ăn hoặc đồ uống
        let order_id = null;
        let orderDetails = {};

        // Nếu có food_items hoặc drink_items, mới tạo đơn hàng
        if ((food_items && food_items.length > 0) || (drink_items && drink_items.length > 0)) {
            const order = new OrdersModel({
                user_id,
                order_date: new Date(),
                total_price 
            });
            const savedOrder = await order.save();
            order_id = savedOrder._id;

            // Thêm món ăn vào đơn hàng (nếu có)
            if (food_items && food_items.length > 0) {
                orderDetails.food = [];
                for (const item of food_items) {
                    const foodItem = await FoodAndDrinkModel.findById(item.item_id);
                    if (foodItem) {
                        const orderItem = new OrderItemModel({
                            order_id,
                            item_id: foodItem._id,
                            quantity: item.quantity,
                            price: foodItem.price,
                            item_type: 'food'
                        });
                        await orderItem.save();
                        orderDetails.food.push({
                            item_id: foodItem._id,
                            quantity: item.quantity,
                            price: foodItem.price
                        });
                    }
                }
            }

            // Thêm đồ uống vào đơn hàng (nếu có)
            if (drink_items && drink_items.length > 0) {
                orderDetails.drink = [];
                for (const item of drink_items) {
                    const drinkItem = await FoodAndDrinkModel.findById(item.item_id);
                    if (drinkItem) {
                        const orderItem = new OrderItemModel({
                            order_id,
                            item_id: drinkItem._id,
                            quantity: item.quantity,
                            price: drinkItem.price,
                            item_type: 'drink'
                        });
                        await orderItem.save();
                        orderDetails.drink.push({
                            item_id: drinkItem._id,
                            quantity: item.quantity,
                            price: drinkItem.price
                        });
                    }
                }
            }
            if (payment_method) {
                const payment = new PaymentModel({
                    order_id,
                    payment_method: payment_method,
                    amount: total_price, // Sử dụng total_price từ body
                    date: new Date()
                });
    
                await payment.save(); // Lưu thông tin thanh toán
            }
        }
        

        const user = await userModel.findById(user_id).select('fullname');
        const fullname = user.fullname

       
        
        

        return {order_id , fullname,ticket: { showtime_id,seat_number,price: 1000  },payment_method, orderDetails}; 
       } catch (error) {
        console.error(error);
        throw new Error('Error creating booking: ' + error.message);
       }
    }
}

module.exports = new bookingService