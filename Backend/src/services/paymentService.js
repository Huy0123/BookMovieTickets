//https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method

const OrdersModel = require('../models/OrdersModel.js')
const PaymentModel = require('../models/PaymentModel.js')
const SendEmailService = require('../services/SendEmailService.js')
const SeatTimeModel = require('../models/SeatTime.js');
const QRCode = require('qrcode'); 
const UserModel = require('../models/userModel.js')
const crypto = require('crypto');
const axios = require('axios');
//parameters
var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var orderInfo = 'pay with MoMo';
var partnerCode = 'MOMO';
var redirectUrl = 'http://localhost:3000/thanks';
var ipnUrl = 'https://4072-14-161-10-15.ngrok-free.app/v1/Payment/callback';
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

    

}

module.exports = new paymentService