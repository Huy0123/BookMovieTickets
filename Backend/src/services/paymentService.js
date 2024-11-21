//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method

const OrdersModel = require('../models/OrdersModel.js')
const PaymentModel = require('../models/PaymentModel.js')
const SendEmailService = require('./SendEmailService.js')
const SeatTimeModel = require('../models/SeatTime.js');
const QRCode = require('qrcode');
const UserModel = require('../models/userModel.js')
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const moment = require('moment');
const { ProductCode, VnpLocale, VNPay, ignoreLogger, dateFormat } = require('vnpay')
const querystring = require('querystring');
const movie = require('../models/Movie.js')
const showtime = require('../models/Showtime.js')

//parameters
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var orderInfo = 'pay with MoMo';
var partnerCode = 'MOMO';
var redirectUrl = 'http://localhost:3000/thanks';
const ngrok = 'https://4dd8-2402-800-6378-6c38-3d6a-b5df-7a1d-fe21.ngrok-free.app'
var ipnUrl = `${ngrok}/v1/Payment/callback`;
var requestType = "payWithMethod";
var extraData = '';
var orderGroupId = '';
var autoCapture = true;
var lang = 'vi';


class paymentService {
    paymentCreater = async (data) => {
        var orderId = data.orderId;
        var requestId = orderId;
        console.log(data)
        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + data.amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: data.amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        });
        //Create the HTTPS objects
        const opptions = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            },
            data: requestBody
        }

        try {
            const createResult = await axios(opptions);
            if (createResult.data && createResult.data.payUrl) {
                console.log("URL thanh toán MoMo:", createResult.data.payUrl);

                // Gọi hàm kiểm tra trạng thái sau khi tạo thanh toán
                setTimeout(async () => {
                    const statusResult = await this.status({ orderId });
                    console.log("Trạng thái thanh toán:", statusResult);
                }, 5000); // Kiểm tra trạng thái sau 5 giây, có thể điều chỉnh thời gian này
            }

            return createResult.data;
        } catch (error) {
            console.error('Lỗi khi tạo giao dịch:', error.response?.data || error.message);
            throw error;
        }


    }
    callback = async (data) => {
        try {
            if (data.resultCode === 0) {
                const order = await OrdersModel.findByIdAndUpdate(data.orderId, { status: true }, { new: true })
                const Payment = await PaymentModel.create({
                    order_id: data.orderId,
                    payment_method: data.orderType,
                    user_id: order.user_id,
                    amount: data.amount,
                    resultCode: data.resultCode,
                    message: data.message
                })

                const qrData = {
                    order_id: data.orderId.toString(),
                };
                console.log(qrData.order_id)
                const qrCodeUrl = await QRCode.toDataURL(qrData.order_id);
                const user = await UserModel.findById(order.user_id)
                await SendEmailService.sendEmailWithQRCode(user, qrCodeUrl, data.orderId);
                const seats_id = order.seats_id;
                for (const seat_id of seats_id) {
                    await SeatTimeModel.updateOne({ seat_id: seat_id ,showtime_id:order.showtime_id}, { seat_status: "true" })
                    const point = Math.ceil((user.point) + ((data.amount * 1) / 1000))
                    console.log("point", point)
                    await UserModel.updateOne({ _id: order.user_id }, { point: point })
                    if (user) {

                        const pointId = order.point_id;
                        // Bước 2: Tìm chỉ mục của promotion_id cần xóa
                        const index = user.promotions_id.indexOf(pointId);
                        if (index !== -1) {
                            // Bước 3: Xóa chỉ một occurrence
                            user.promotions_id.splice(index, 1); // Xóa occurrence tại chỉ mục
                            await user.save(); // Lưu thay đổi vào cơ sở dữ liệu
                        }
                    }
                }
                return { order, Payment, qrCodeUrl }
            }
        } catch (error) {
            return error
        }
    }

    status = async (data) => {
        const { orderId } = data;
        console.log("data", data);

        // Chuỗi ký kết
        const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest('hex');

        // Thông tin yêu cầu
        const requestBody = JSON.stringify({
            partnerCode: "MOMO",
            requestId: orderId,
            orderId,
            signature,
            lang: 'vi'
        });

        const options = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/query",
            headers: {
                'Content-Type': 'application/json',
            },
            data: requestBody
        };

        try {
            const result = await axios(options);
            console.log(result.data)
            return result.data; // Trả về dữ liệu của phản hồi
        } catch (error) {
            console.error('Error querying MoMo API:', error.response?.data || error.message);
            return error; // Ném lỗi để xử lý ở nơi khác nếu cần
        }
    }

    createrVnpay = async (data) => {

        let tmnCode = "V45O0WA3";
        let secretKey = "N13S9RBKLTZ49UWP8QLYN15BQXPZ56KW";

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const vnpay = new VNPay({
            tmnCode: tmnCode,
            secureSecret: secretKey,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
            hashAlgorithm: 'SHA512', // tùy chọn
            enableLog: true, // optional
            loggerFn: ignoreLogger, // optional
        });

        // Các tham số gửi tới VNPay
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: data.amount,
            vnp_IpAddr: '192.168.1.152',
            vnp_TxnRef: data.orderId,
            vnp_OrderInfo: 'Thanh toan don hang',
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:3000/thanks',
            vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
            vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
            vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
        });

        return { paymentUrl }

    }
    returnVnpay = async (data) => {
        console.log(data)
        const data1 = querystring.parse(data);
        let tmnCode = "V45O0WA3";
        let secretKey = "N13S9RBKLTZ49UWP8QLYN15BQXPZ56KW";
        const vnpay = new VNPay({
            tmnCode: tmnCode,
            secureSecret: secretKey,
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512', // tùy chọn 
            enableLog: true, // optional
            loggerFn: ignoreLogger, // optional  
        });
        try {

            const verify = vnpay.verifyReturnUrl(data1);
            console.log(verify)
            if (!verify.isVerified) {
                return { message: 'Xác thực tính toàn vẹn dữ liệu không thành công' }
            }
            if (!verify.isSuccess) {
                return { message: 'Đơn hàng thanh toán không thành công' }
            }
            const vnp_ResponseCode = verify.vnp_ResponseCode;
            const vnp_TransactionStatus = verify.vnp_TransactionStatus;
            const isVerified = verify.isVerified;
            const isSuccess = verify.isSuccess;
            const order = await OrdersModel.findByIdAndUpdate(verify.vnp_TxnRef, { status: true }, { new: true })
            if (vnp_ResponseCode === "00" && vnp_TransactionStatus === "00" && isVerified && isSuccess) {
                const Payment = await PaymentModel.create({
                    order_id: verify.vnp_TxnRef,
                    user_id: order.user_id,
                    payment_method: "VNPay",
                    amount: verify.vnp_Amount,
                    resultCode: vnp_ResponseCode,
                    message: verify.message
                })

                const qrData = {
                    order_id: verify.vnp_TxnRef.toString(),
                };
                console.log(qrData.order_id)
                const qrCodeUrl = await QRCode.toDataURL(qrData.order_id);
                const user = await UserModel.findById(order.user_id)
                await SendEmailService.sendEmailWithQRCode(user, qrCodeUrl, verify.vnp_TxnRef);
                const seats_id = order.seats_id;
                for (const seat_id of seats_id) {
                    await SeatTimeModel.updateOne({ seat_id: seat_id ,showtime_id:order.showtime_id }, { seat_status: "true" })
                }
                const point = Math.ceil((user.point) + ((verify.vnp_Amount * 1) / 1000))
                console.log("point", point)
                await UserModel.updateOne({ _id: order.user_id }, { point: point })
                if (user) {

                    const pointId = order.point_id;
                    // Bước 2: Tìm chỉ mục của promotion_id cần xóa
                    const index = user.promotions_id.indexOf(pointId);
                    if (index !== -1) {
                        // Bước 3: Xóa chỉ một occurrence
                        user.promotions_id.splice(index, 1); // Xóa occurrence tại chỉ mục
                        await user.save(); // Lưu thay đổi vào cơ sở dữ liệu
                    }
                }
                return { order, Payment, qrCodeUrl }
            }
            else {
                return { message: 'Đơn hàng thanh toán k thành công' };
            }

        } catch (error) {
            // return {message:'Dữ liệu không hợp lệ'}
            return error
        }
    }



    createrZalopay = async (data) => {
        const app_id = "2553"
        const key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL"
        const key2 = "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz"
        const endpoint = "https://sb-openapi.zalopay.vn/v2/create"
        const redirecturl = "http://localhost:3000/thanks"
        const embed_data = { redirecturl };
        const order_id = data.orderId
        const orderin4 = await OrdersModel.findById(data.orderId)
        const items = [{ order_id }];
        const transID = data.orderId;
        const order = {
            app_id: app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: orderin4.user_id,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: data.amount,
            description: `Payment for the order #${transID}`,
            bank_code: "",
            callback_url: `${ngrok}/v1/Payment/callbackZalopay`
        };
        const data1 = app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data1, key1).toString()

        try {
            const result = await axios.post(endpoint, null, { params: order })
            console.log(result.data);
            const data2 = result.data
            return { data2 }
        } catch (error) {
            return error
        }



    }
    callbackZalopay = async (data) => {
        const key2 = "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz";
        let result = {};
        try {
            let dataStr = data.data;
            let reqMac = data.mac;
            let mac = CryptoJS.HmacSHA256(dataStr, key2).toString();
            console.log("mac =", mac);
            if (reqMac !== mac) {
                // callback không hợp lệ
                result.return_code = -1;
                result.return_message = "mac not equal";
            }
            else {
                // thanh toán thành công
                // merchant cập nhật trạng thái cho đơn hàng
                let dataJson = JSON.parse(dataStr, key2);
                console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

                result.return_code = 1;
                result.return_message = "success";
            }
        } catch (ex) {
            result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
            result.return_message = ex.message;
        }

        const parsedData = JSON.parse(data.data);
        const item = JSON.parse(parsedData.item)
        console.log("hhhh", result, parsedData, item)
        if (result.return_code === 1) {
            const orderId = item[0].order_id
            console.log("hagsgsf", item[0].order_id)

            const order = await OrdersModel.findByIdAndUpdate(orderId, { status: true }, { new: true })
            const Payment = await PaymentModel.create({
                order_id: orderId,
                payment_method: "Zalopay",
                user_id: parsedData.app_user,
                amount: parsedData.amount,
                resultCode: 0,
                message: result.return_message
            })

            const qrData = {
                order_id: orderId.toString(),
            };
            console.log(qrData.order_id)
            const qrCodeUrl = await QRCode.toDataURL(qrData.order_id);
            const user = await UserModel.findById(order.user_id)
            await SendEmailService.sendEmailWithQRCode(user, qrCodeUrl, orderId);
            const seats_id = order.seats_id;
            const showtime_id = order.showtime_id;
            for (const seat_id of seats_id) {
                await SeatTimeModel.updateOne({ seat_id: seat_id ,showtime_id:showtime_id}, { seat_status: "true" })
            }
            const point = Math.ceil((user.point) + ((parsedData.amount * 1) / 1000))
            console.log("point", point)
            await UserModel.updateOne({ _id: order.user_id }, { point: point })        
                const pointId = order.point_id;
                // Bước 2: Tìm chỉ mục của promotion_id cần xóa
                const index = user.promotions_id.indexOf(pointId);
                if (index !== -1) {
                    // Bước 3: Xóa chỉ một occurrence
                    user.promotions_id.splice(index, 1); // Xóa occurrence tại chỉ mục
                    await user.save(); // Lưu thay đổi vào cơ sở dữ liệu
                }
            
    

            return { result, Payment, qrCodeUrl }
        }
    }



    getPayment = async () => {
        try {
            return await PaymentModel.find()
        } catch (error) {
            throw error
        }

    }

    getPaymentById = async (data) => {
        try {
            const res = await PaymentModel.findById(data)
            return { res }
        } catch (error) {
            throw error
        }
    }

    getPaymentByCinemaId = async (data) => {
        try {
            const orders = await OrdersModel.find({ cinema_id: data })
            const orderIds = orders.map(order => order._id)
            const payment = await PaymentModel.find({ order_id: { $in: orderIds } })
            return { payment }
        } catch (error) {
            throw error
        }
    }
    getPaymentByUserId = async (data) => {
        try {
            const res = await PaymentModel.find({ user_id: data })
            return { res }
        } catch (error) {
            throw error
        }
    }

    getPaymentByMovie = async () => {
        const movies = await movie.find().select('_id title').lean();
        const movieIds = movies.map(movie => movie._id);
        
        const showtimes = await showtime.find({ movie_id: { $in: movieIds } }).lean();
        const showtimeIds = showtimes.map(showtime => showtime._id);
        
        const orders = await OrdersModel.find({ showtime_id: { $in: showtimeIds } }).lean();
        const orderIds = orders.map(order => order._id);
        
        const payments = await PaymentModel.find({ order_id: { $in: orderIds } }).lean();
        
        const paymentsByMovie = payments.reduce((acc, payment) => {
            const order = orders.find(order => order._id.toString() === payment.order_id.toString());
            
            if (order) {
                const showtime = showtimes.find(showtime => showtime._id.toString() === order.showtime_id.toString());
                if (showtime) {
                    const movieId = showtime.movie_id.toString();
                    if (!acc[movieId]) acc[movieId] = [];
                    acc[movieId].push(payment);
                }
            }
            return acc;
        }, {});

        const result = movies.map(movie => {
            const movieId = movie._id.toString();
            const totalRevenue = paymentsByMovie[movieId]
                ? paymentsByMovie[movieId].reduce((acc, payment) => acc + payment.amount , 0)
                : 0;
            
            return {
                ...movie,
                payments: totalRevenue
            };
        });

        return result;
    }
}

module.exports = new paymentService
