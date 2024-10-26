const SendEmailService = require('../services/SendEmailService')

class SendEmailController{
    SendEmailforgotpassword = async(req,res)=>{
        try {
            const {email} = req.body
            const forgotpassword = await SendEmailService.SendEmailforgotpassword(email);
            return res.status(201).json({forgotpassword})
        } catch (error) {
            throw error
        }
    }
}
module.exports = new SendEmailController