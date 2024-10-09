const FoodAndDrinkModel = require('../models/FoodAndDrinkModel.js');
const TicketsModel = require('../models/TicketsModel.js');
const OrdersModel = require('../models/OrdersModel.js');
const OrderItemModel = require('../models/OrderItemModel.js');
const PaymentModel = require('../models/PaymentModel.js');
const userModel = require('../models/userModel.js');
const SeatModel = require('../models/Seat.js');
const RoomModel = require('../models/Room.js');
const MovieModel = require('../models/Movie.js')
const CinemaModel = require('../models/Cinema.js')
const ShowtimeModel = require('../models/Showtime.js');
const SeatModelModel = require('../models/Seat.js')
const nodemailer = require('nodemailer'); 
const QRCode = require('qrcode'); 

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
                await SeatModelModel.updateOne({ _id: seat_id }, { seat_status:"true"});
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
            const user = await userModel.findById(user_id);
            const fullname = user.fullname;
            const qrData = {
                order_id,
                fullname,
                total_price,
            };

            const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), { errorCorrectionLevel: 'H' });
            await this.sendEmailWithQRCode(user, qrCodeUrl);
            return { message:"Thanh toán thành công ",order_id, fullname, tickets, payment_method, orderItems ,total_price,qrCodeUrl};
        } catch (error) {
            console.error(error);
            throw new Error('Error creating booking: ' + error.message);
        }
    }


    sendEmailWithQRCode = async (user, qrCodeUrl) => {
        try {
            console.log("email",user.email)
            const email = user.email;
            const fullname = user.fullname;
            // Thiết lập transporter
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_MYEMAIL, 
                    pass: process.env.EMAIL_PASSWORD  
                }
            });

            // Tạo nội dung email
            const mailOptions = {
                from: process.env.EMAIL_MYEMAIL,
                to: email,
                subject: 'Mã QR Code cho đơn hàng của bạn',
                text: 'Dưới đây là mã QR Code cho đơn hàng của bạn.',
                html:`<p>Cảm ơn ${fullname} đã đặt vé xem phim của chúng tôi</p>`,
                attachments: [
                    {
                        filename: 'qr-code.png',
                        content: qrCodeUrl.split(',')[1], 
                        encoding: 'base64',
                    },
                ],
            };

            // Gửi email
            await transporter.sendMail(mailOptions);
            console.log('Email đã được gửi cho: ' + email);
        } catch (error) {
            console.error('Có lỗi xảy ra khi gửi email: ', error);
        }
    }

    GetBooking = async ()=>{
        try {
            const result = await OrdersModel.find();
           let data= []
            for(const result_item of result){
                const order_id = await OrdersModel.findById({_id:result_item._id});
                const tickets = await TicketsModel.find({order_id:order_id._id}).select("showtime_id seat_id price")
                let seats = [];
                const showtime = await ShowtimeModel.findOne(tickets.showtime_id)
                const movie = await MovieModel.findById(showtime.movie_id)
                const cinema = await CinemaModel.findById(showtime.cinema_id)
                const room = await RoomModel.findById(showtime.room_id)
                for (const ticket of tickets){
                    const seat = await SeatModel.findById(ticket.seat_id)            
                    seats.push(seat)                                    
                }
                const ticket_infor = {seats,tickets,showtime,movie,cinema,room}
                const orderItems = await OrderItemModel.find({order_id:order_id._id})
                let items=[];
                for(const orderItem of orderItems){
                    const item = await FoodAndDrinkModel.findById(orderItem.item_id)
                    items.push(item)
                }
                const item_infor = {items,orderItems}
                const orders_infor = {order_id,ticket_infor,item_infor}
                data.push ({orders_infor})
            }

           return {data}
           
        } catch (error) {
            throw error
        }
       

    }

    GetUserBookingById = async (data)=>{
        try {
            const user_id = data
            const user = await userModel.findById(user_id).select("fullname email num username")
            const oders = await OrdersModel.find({user_id})
            let result= []
            for(const oder of oders){
                const order_id = await OrdersModel.findById({_id:oder._id});
                const tickets = await TicketsModel.find({order_id:order_id._id}).select("showtime_id seat_id price")
                let seats = [];
                const showtime = await ShowtimeModel.findOne(tickets.showtime_id)
                const movie = await MovieModel.findById(showtime.movie_id)
                const cinema = await CinemaModel.findById(showtime.cinema_id)
                const room = await RoomModel.findById(showtime.room_id)
                for (const ticket of tickets){
                    const seat = await SeatModel.findById(ticket.seat_id)            
                    seats.push(seat)                                    
                }
                const ticket_infor = {seats,tickets,showtime,movie,cinema,room}
                const orderItems = await OrderItemModel.find({order_id:order_id._id})
                let items=[];
                for(const orderItem of orderItems){
                    const item = await FoodAndDrinkModel.findById(orderItem.item_id)
                    items.push(item)
                }
                const item_infor = {items,orderItems}
                const orders_infor = {ticket_infor,item_infor}
                result.push ({user,orders_infor})
            }

           return {result}
           
        } catch (error) {
            throw error
        }
    }
    GetBookingById = async (data)=>{
        try {
            const order_id = data 
            const oders = await OrdersModel.findById(order_id)
            
                const user = await userModel.find({_id:oders.user_id}).select("fullname email num username")
                const tickets = await TicketsModel.find({order_id:order_id._id}).select("showtime_id seat_id price")
                let seats = [];
                const showtime = await ShowtimeModel.findOne(tickets.showtime_id)
                const movie = await MovieModel.findById(showtime.movie_id)
                const cinema = await CinemaModel.findById(showtime.cinema_id)
                const room = await RoomModel.findById(showtime.room_id)
                for (const ticket of tickets){
                    const seat = await SeatModel.findById(ticket.seat_id)            
                    seats.push(seat)                                    
                }
                const ticket_infor = {seats,tickets,showtime,movie,cinema,room}
                const orderItems = await OrderItemModel.find({order_id:oders._id})
                let items=[];
                for(const orderItem of orderItems){
                    const item = await FoodAndDrinkModel.findById(orderItem.item_id)
                    items.push(item)
                }
                const item_infor = {items,orderItems}
                const orders_infor = {ticket_infor,item_infor}
               
            

           return {user,orders_infor}
        } catch (error) {
            throw error
        }

    }
}

module.exports = new bookingService();
