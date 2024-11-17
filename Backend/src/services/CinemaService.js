const cinema = require('../models/Cinema');
const showtime = require('../models/Showtime');
const UserModel = require('../models/userModel')
const PaymentModel = require('../models/PaymentModel')
const OrdersModel = require('../models/OrdersModel.js')
const saltRounds =10
const bcrypt =require('bcrypt')
class CinemaService {
    createCinema = async (data) => {
        const findusername = await UserModel.findOne({username: data.username})
        if(findusername){
            return { EC: 1, EM: "Tên người dùng đã được sử dụng!" }
        }
        const findemail = await UserModel.findOne({email: data.email})
        if (findemail){
            return { EC: 2, EM: "Email đã được sử dụng!" }

        }
 
        const hashPassword = await bcrypt.hash(data.password, saltRounds);
        const userCinema = await UserModel.create({
            fullname: data.nameCinema,
            username: data.username, 
            email: data.email,
            num: data.num,
            password: hashPassword,
            role:"Cinema"         
        })

        const Cinema = await cinema.create({
            name:data.nameCinema,
            address:data.address,
            user_id:userCinema._id

        })
        
       return {userCinema,Cinema} 
    }

    getCinemas = async () => { 
        return cinema.find().populate('user_id');
    }

    getCinemaByID = async (id) => {
        return cinema.findById(id).populate('user_id');
    }

    updateCinema = async (id,data) => {
       const Cinema=  await cinema.findByIdAndUpdate(id,{
        name:data.name,
        address:data.address
       },{new:true});
       console.log(Cinema.user_id)
       const user = await UserModel.findByIdAndUpdate(Cinema.user_id,{
        fullname:data.name,
        email:data.email,
        num:data.num
  
       },{new:true})

        return {user,Cinema}
    }

    deleteCinema = async (id) => {
       const deleteCinema = await cinema.findByIdAndDelete(id,{new:true});
       await UserModel.findByIdAndDelete({_id:deleteCinema.user_id},{new:true})
       console.log("xóa thành công")
       return {message:"xóa thành công"}
    }

    getCinemasByMovieID = async (id) => {
        return cinema.find({ movies: id });
    }

    getCinemasByCity = async (city) => { 
        return cinema.find({ address: { $regex: city, $options: 'i' } });
    }

    getCinemasByMovieIDAndCity = async (id, city) => {
        return cinema.find({ movies: id,  address: { $regex: city, $options: 'i' } });
    }
    getCinemaIdByUserId = async (id) => {
        const Cinema = await cinema.find({user_id:id}).populate('user_id')
        console.log(Cinema)
        return Cinema? {Cinema} :{message:"Không có rạp này"}
        
    }

    getShowtimeAndPaymentByCinema = async () => {
        const cinemas = await cinema.find().select('_id name').lean();
        const cinemaIds = cinemas.map(cinema => cinema._id);
    
        // Lấy tất cả các showtimes, orders và payments
        const showtimes = await showtime.find({ cinema_id: { $in: cinemaIds } }).lean();
        const orders = await OrdersModel.find({ cinema_id: { $in: cinemaIds } }).lean();
        const ordersId = orders.map(order => order._id)
        const payments = await PaymentModel.find({ order_id: { $in: ordersId } }).lean();
    
        // Tạo các Map để nhóm showtimes và payments theo cinema_id
        const showtimesByCinema = showtimes.reduce((acc, showtime) => {
            const cinemaId = showtime.cinema_id;
            if (!acc[cinemaId]) acc[cinemaId] = [];
            acc[cinemaId].push(showtime);
            return acc;
        }, {});
    
        const paymentsByCinema = payments.reduce((acc, payment) => {
            const order = orders.find(order => order._id.toString() === payment.order_id.toString());
            
            if (order) {
                const cinemaId = order.cinema_id;
                if (!acc[cinemaId]) acc[cinemaId] = [];
                acc[cinemaId].push(payment);
            }
            return acc;
        }, {});
    
        // Tạo kết quả cuối cùng
        const result = cinemas.map(cinema => {
            const cinemaId = cinema._id;
            // Tính số lượng showtimes
            const totalShowtimes = showtimesByCinema[cinemaId] ? showtimesByCinema[cinemaId].length : 0;
            
            // Tính tổng doanh thu
            const totalRevenue = paymentsByCinema[cinemaId]
                ? paymentsByCinema[cinemaId].reduce((acc, payment) => acc + payment.amount, 0)
                : 0;
            
            return {
                ...cinema,
                showtimes: totalShowtimes,
                payments: totalRevenue
            };
        });
    
        return result;
    };
    
}

module.exports = new CinemaService;