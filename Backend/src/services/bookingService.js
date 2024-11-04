const FoodAndDrinkModel = require('../models/FoodAndDrinkModel.js');
const OrdersModel = require('../models/OrdersModel.js');
const PaymentModel = require('../models/PaymentModel.js');
const userModel = require('../models/userModel.js');
const SeatModel = require('../models/Seat.js');
const ShowtimeModel = require('../models/Showtime.js');
const PointModel = require('../models/Point.js');

const SeatTimeModel = require('../models/SeatTime.js')



class bookingService {
    createBooking = async (data) => {
        try {
            const { user_id, showtime_id, seats_id = [], FoodAndDrinks_id = [],point_id} = data;
            if (!user_id || !showtime_id || !seats_id) {
                throw new Error('Missing required fields');
            }
            const showtime = await ShowtimeModel.findById(showtime_id).populate('cinema_id','_id')
            console.log("showtime",showtime)
            var total_price_seat = 0;
            var total_price_food = 0;
            
            for (const seat_id of seats_id){
                let i = 0;
                const seat = await SeatTimeModel.find({seat_id:seat_id}).populate('seat_id')
               if(!seat){
                return {message:"khoong co seat"}
               }
                console.log("seat",seat)
               
                if(seat[i].seat_status){
                    return {message :`${seat[i].seat_id.seat_number} không tồn tại hoặc đã được đặt`}
                }
                console.log("seat",seat[i].seat_id.price)
                total_price_seat += seat[i].seat_id.price
                i++
               
            }
            console.log(total_price_seat)
          
           if(FoodAndDrinks_id){
            for (const FoodAndDrink_id of FoodAndDrinks_id){
                const FoodAndDrink = await FoodAndDrinkModel.findById(FoodAndDrink_id.item_id)
                total_price_food += FoodAndDrink.price*FoodAndDrink_id.quantity
            }
           }
           
           
            
            var total_price = total_price_seat+total_price_food;
            console.log(total_price)
            if(point_id){
                const pointData = await PointModel.findById(point_id)
                    total_price = total_price - total_price*pointData.discount;
                const promotions = await userModel.findById(user_id).select('promotions_id')
                console.log(promotions)
                for(const promotion_id of promotions.promotions_id){
                    console.log(promotion_id)
                    if(point_id==promotion_id){
                        await userModel.updateOne(
                            { _id: user_id },                 
                            { $pull: { promotions_id: promotion_id } } 
                        );
                    }
                }
                
                console.log(promotions.promotions_id)
                    console.log(total_price)
            }
            
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
           
           
         
         
            return { message:"Thanh toán thành công ",orders_infor};
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
