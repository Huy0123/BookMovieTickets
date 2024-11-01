const paymentService = require('../services/paymentService')
class paymentController  {
    payment =async(req,res)=>{
        const data = req.body
        const result=await paymentService.paymentCreater(data)
        return res.status(200).json(result)
    }   
    callback = async(req,res)=>{
        console.log("callback::")
        console.log(req.body) 
        const result=await paymentService.callback(req.body)
        return res.status(200).json(result);
        
    }
    status = async (req,res)=>{
        const data = req.body       
        const result=await paymentService.status(data)
        return res.status(200).json(result)
        
    }
}
module.exports = new paymentController