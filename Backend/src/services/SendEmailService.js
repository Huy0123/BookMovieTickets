const userModel = require('../models/userModel.js')
const nodemailer = require('nodemailer'); 
require('dotenv').config()
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars'); 
const axios = require('axios');
const { title } = require('process');

class SendEmailService{
    SendEmailforgotpassword = async (email)=>{
        if(!email){
            return{
                message: 'Bạn chưa nhập email !',
            }
        }
        const users = await userModel.findOne({email})
        if(!users){
            return {
                message: 'email chưa được đăng kí !',
            }
        }
        const token = jwt.sign({email:users.email},process.env.JWT_SECRET,{ expiresIn: '30m' })
        const link = `http://localhost:3000/reset-password/${token}`;
    
        
        console.log(token)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_MYEMAIL, 
                pass: process.env.EMAIL_PASSWORD 
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_MYEMAIL,
            to: email,
            subject: 'Đặt lại mật khẩu',
            html: `<p>Xin chào,</p>
                   <p>Để đặt lại mật khẩu của bạn, hãy nhấp vào liên kết bên dưới:</p>
                   <a href="${link}">Đặt lại mật khẩu</a>
                   <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>`,
        };
    
        await transporter.sendMail(mailOptions);
    
        return {
            message: 'Email đã được gửi để đặt lại mật khẩu!',
        };
    }

    sendEmailWithQRCode = async (user, qrCodeUrl,order_id) => {
        try {
            const options = {
                method: "GET",
                url: `http://localhost:8080/v1/Booking/getBooking/${order_id}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            
            };
            const result = await axios(options);
      
            const bookingInfo = result.data.orders_infor;
            const ticketContentPath = path.join(__dirname, '../resources/views/TicketContent.hbs');
            // Đọc nội dung file HDB
            const templateSource = fs.readFileSync(ticketContentPath, 'utf8');
            const template = handlebars.compile(templateSource);

            
            console.log("email",user.email)
            const email = user.email;
            const fullname = user.fullname;
            const qrCodeBase64 = qrCodeUrl.split(',')[1];
            const foodAndDrinks = bookingInfo.FoodAndDrinks_id.map(item => ({
                item_id: item.item_id,       // Thông tin món ăn/đồ uống
                quantity: item.quantity      // Số lượng
            }));
            const data = {
                fullname: fullname,
                cinemaName: bookingInfo.cinema_id.name,           // Tên rạp chiếu
                orderId: bookingInfo._id,    
                title:bookingInfo.showtime_id.movie_id.title,
                room:bookingInfo.showtime_id.room_id.name,
                orderdate:new Date(bookingInfo.order_date).toLocaleString(),                 
                totalPrice: bookingInfo.total_price,              // Tổng giá trị
                showtimeStart: new Date(bookingInfo.showtime_id.showtime_start).toLocaleString(),  // Thời gian chiếu
                seats: bookingInfo.seats_id.map(seat => seat.seat_number).join(', '), // Danh sách số ghế
                foodAndDrinks: foodAndDrinks,
                qrCodeUrl: `data:image/png;base64,${qrCodeBase64}` // Mã QR
            };
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
                html:template(data), 
                attachments: [
                    {
                        filename: 'qr-code.png',
                        content: qrCodeBase64, 
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
}

module.exports = new SendEmailService