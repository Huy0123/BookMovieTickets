const FoodAndDrinkModel = require('../models/FoodAndDrinkModel.js');
const OrdersModel = require('../models/OrdersModel.js');
const PaymentModel = require('../models/PaymentModel.js');
const userModel = require('../models/userModel.js');
const SeatModel = require('../models/Seat.js');
const ShowtimeModel = require('../models/Showtime.js');
const SendEmailService = require('../services/SendEmailService.js')
const QRCode = require('qrcode'); 


class bookingService {
    createBooking = async (data) => {
        try {
            const { user_id, showtime_id, seats_id = [], FoodAndDrinks_id = [], payment_method } = data;
            if (!user_id || !showtime_id || !seats_id||!FoodAndDrinks_id) {
                throw new Error('Missing required fields');
            }
            const showtime = await ShowtimeModel.findById(showtime_id).populate('cinema_id','_id')
            console.log(showtime)
            var total_price_seat = 0;
            var total_price_food = 0;
            for (const seat_id of seats_id){
                const seat = await SeatModel.findById(seat_id)
                // if(seat.seat_status){
                //     return {message :`${seat.seat_number} không tồn tại hoặc đã được đặt`}
                // }
                total_price_seat += seat.price
            }

            
           
            for (const FoodAndDrink_id of FoodAndDrinks_id){
                const FoodAndDrink = await FoodAndDrinkModel.findById(FoodAndDrink_id.item_id)
                total_price_food += FoodAndDrink.price*FoodAndDrink_id.quantity
            }
            
            var total_price = total_price_seat+total_price_food;
           
            console.log(total_price)
            const order = new OrdersModel({
                user_id,
                showtime_id,
                cinema_id:showtime.cinema_id,
                seats_id:seats_id,
                FoodAndDrinks_id:FoodAndDrinks_id,
                order_date: new Date(),
                total_price
            })
            const orders_infor = await order.save();
            const order_id = orders_infor._id;
           for (const seat_id of seats_id){
                await SeatModel.updateOne({_id:seat_id},{seat_status:"true"})
            }
            
            if (payment_method) {
                const payment = new PaymentModel({
                    order_id:order_id,
                    payment_method: payment_method,
                    amount: total_price, 
                    date: new Date()
                });
                await payment.save();
            }

          const user = await userModel.findById(user_id)
          console.log("point",user.point)
          const point = (user.point)+((total_price*1)/1000)
          console.log("point",point)
          await userModel.updateOne({_id:user_id},{point:point})
            const qrData = {           
                order_id:order_id._id.toString(),
            };
            console.log(qrData.order_id)
            const qrCodeUrl = await QRCode.toDataURL(qrData.order_id);
            
            await SendEmailService.sendEmailWithQRCode(user, qrCodeUrl,order_id);
            return { message:"Thanh toán thành công ",orders_infor,qrCodeUrl};
        } catch (error) {
            console.error(error);
            throw new Error('Error creating booking: ' + error.message);
        }
    }


    

    GetBooking = async ()=>{
        try {
            const order_infor = await OrdersModel.find()
            .populate('user_id','fullname username email num')
            .populate({
                path:'seats_id',
                select:'seat_number price seat_type'
            })
            .populate({
                path:'cinema_id',
            })
            .populate({
                path:'showtime_id',
                populate:'movie_id  room_id'            
            })
            .populate({
                path:'FoodAndDrinks_id',
                populate:{
                    path:'item_id',
                }
            })
           return {order_infor}
           
        } catch (error) {
            throw error
        }
       

    }

    GetUserBookingById = async (user_id)=>{
        try {

            const order_infor = await OrdersModel.find({user_id:user_id})
            .populate('user_id','fullname username email num')
            .populate({
                path:'seats_id',
                select:'seat_number price seat_type'
            })
            .populate({
                path:'cinema_id',
            })
            .populate({
                path:'showtime_id',
                populate:'movie_id room_id'            
            })
            .populate({
                path:'FoodAndDrinks_id',
                populate:{
                    path:'item_id',
                }
            })
           return {order_infor}
           
        } catch (error) {
            throw error
        }
    }

    GetBookingById = async (order_id)=>{
        try {       
                const orders_infor = await OrdersModel.findById(order_id) 
                .populate('user_id','fullname username email num')
                .populate({
                    path:'seats_id',
                    select:'seat_number price seat_type'
                })
                .populate({
                    path:'cinema_id',
                })
                .populate({
                    path:'showtime_id',
                    populate:'movie_id room_id' 
                })
                .populate({
                    path:'FoodAndDrinks_id',
                    populate:{
                        path:'item_id',
                    }
                })
           return {orders_infor}
        } catch (error) {
            throw error
        }

    }
    getCinemaBookingById = async(cinema_id)=>{
        try {       
            const orders_infor = await OrdersModel.find({cinema_id}) 
            .populate('user_id','fullname username email num')
                .populate({
                    path:'seats_id',
                    select:'seat_number price seat_type'
                })
                .populate({
                    path:'cinema_id',
                })
                .populate({
                    path:'showtime_id',
                    populate:'movie_id room_id' 
                })
                .populate({
                    path:'FoodAndDrinks_id',
                    populate:{
                        path:'item_id',
                    }
                })
       return {orders_infor}
    } catch (error) {
        throw error
    }
    }

   DeleteBooking = async (order_id) => {
        try {
            const order = await OrdersModel.findById(order_id)
            .populate({
                path:'seats_id',
                select:'seat_status'
            })
            if (!order) {
                return { message: "Không có order này" };
            }
            for(const seat_status of order.seats_id){
               if(seat_status.seat_status){
                return {message:"booking này đang trong quá trình sử dụng nên không thể xóa"}
               }
            }

            const deleteOrderResult = await OrdersModel.deleteOne({ _id: order._id });
            if (deleteOrderResult.deletedCount === 0) {
                return { message: "Xóa order không thành công" };
            }  
            return { message: "Xóa thành công" };
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            return { message: "Có lỗi xảy ra khi xóa", error: error.message };
        }
    };
    
}

module.exports = new bookingService();
