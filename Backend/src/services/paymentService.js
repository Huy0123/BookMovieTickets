//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method

const OrdersModel = require('../models/OrdersModel.js')
const PaymentModel = require('../models/PaymentModel.js')
const SendEmailService = require('./SendEmailService.js')
const SeatTimeModel = require('../models/SeatTime.js');
const QRCode = require('qrcode'); 
const UserModel = require('../models/userModel.js')
const crypto = require('crypto');
const axios = require('axios');
const { ProductCode, VnpLocale,VNPay,ignoreLogger,dateFormat} = require('vnpay')
const querystring = require('querystring');
//parameters
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var orderInfo = 'pay with MoMo';
var partnerCode = 'MOMO';
var redirectUrl = 'http://localhost:3000/thanks';
const ngrok = 'https://73ea-14-161-10-15.ngrok-free.app'
var ipnUrl = `${ngrok}/v1/Payment/callback`;
var requestType = "payWithMethod";
var extraData ='';
var orderGroupId ='';
var autoCapture =true;
var lang = 'vi';
  

class paymentService {
    paymentCreater=async(data)=>{
        var orderId = data.orderId;
        var requestId = orderId;
        console.log(data)
        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" +accessKey + "&amount=" + data.amount + "&extraData=" + extraData + "&ipnUrl=" +ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
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
            partnerCode : partnerCode,
            partnerName : "Test",
            storeId : "MomoTestStore",
            requestId : requestId,
            amount : data.amount,
            orderId : orderId,
            orderInfo : orderInfo,
            redirectUrl : redirectUrl,
            ipnUrl : ipnUrl,
            lang : lang,
            requestType: requestType,
            autoCapture:autoCapture,
            extraData : extraData,
            orderGroupId: orderGroupId,
            signature : signature
        });
        //Create the HTTPS objects
        const opptions = {
            method:"POST",
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
    callback = async(data)=>{
        try {
            if(data.resultCode===0){
                const Payment = await PaymentModel.create({
                    order_id:data.orderId,
                    payment_method:data.orderType,
                    amount:data.amount,
                    resultCode:data.resultCode,
                    message:data.message
                })
                const order= await OrdersModel.findByIdAndUpdate(data.orderId,{status:true},{new:true})
                const qrData = {           
                    order_id:data.orderId.toString(),
                };
                console.log(qrData.order_id)
                const qrCodeUrl = await QRCode.toDataURL(qrData.order_id);
                const user = await UserModel.findById(order.user_id)
                await SendEmailService.sendEmailWithQRCode(user, qrCodeUrl,data.orderId);
                const seats_id = order.seats_id;
                for (const seat_id of seats_id){
                await SeatTimeModel.updateOne({seat_id:seat_id},{seat_status:"true"})
            }
                return {order,Payment,qrCodeUrl}
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
            throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
        }
    }

    createrVnpay = async(data)=>{

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
            vnp_ReturnUrl: 'http://localhost:8080/v1/Payment/vnpay-return',    
            vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
            vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
            vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
        });
        
        return {paymentUrl}

    }
    returnVnpay = async(data)=>{     
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
                return {message:'Xác thực tính toàn vẹn dữ liệu không thành công'}
            }
            if (!verify.isSuccess) {
                return {message:'Đơn hàng thanh toán không thành công'}
            }
            const vnp_ResponseCode = verify.vnp_ResponseCode;
            const vnp_TransactionStatus = verify.vnp_TransactionStatus;
            const isVerified = verify.isVerified;
            const isSuccess = verify.isSuccess;
            if(vnp_ResponseCode==="00"&&vnp_TransactionStatus==="00"&&isVerified &&isSuccess){
                const Payment = await PaymentModel.create({
                    order_id:verify.vnp_TxnRef,
                    payment_method:"VNPay",
                    amount:verify.vnp_Amount,
                    resultCode:vnp_ResponseCode,
                    message:verify.message
                })
                const order= await OrdersModel.findByIdAndUpdate(verify.vnp_TxnRef,{status:true},{new:true})
                const qrData = {           
                    order_id:verify.vnp_TxnRef.toString(),
                };
                console.log(qrData.order_id)
                const qrCodeUrl = await QRCode.toDataURL(qrData.order_id);
                const user = await UserModel.findById(order.user_id)
                await SendEmailService.sendEmailWithQRCode(user, qrCodeUrl,verify.vnp_TxnRef);
                const seats_id = order.seats_id;
                for (const seat_id of seats_id){ 
                await SeatTimeModel.updateOne({seat_id:seat_id},{seat_status:"true"})
            }
                return {order,Payment,qrCodeUrl}
            }
            else{
                return { message: 'Đơn hàng thanh toán k thành công' };
            }
            
         } catch (error) {
            // return {message:'Dữ liệu không hợp lệ'}
            throw error
        }
    }

}

module.exports = new paymentService