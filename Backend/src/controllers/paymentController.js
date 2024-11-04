const paymentService = require('../services/paymentService')

class paymentController  {
    payment =async(req,res)=>{
        const data = req.body
        const result=await paymentService.paymentCreater(data)
        return res.status(201).json(result)
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

    createrVnpay = async (req,res)=>{
        const data = req.body
        const result=await paymentService.createrVnpay(data,req)
        return res.status(201).json(result)
    }
    returnVnpay= async(req,res)=>{
        const result = await paymentService.returnVnpay(req.params.query)
        return res.status(200).json(result)
    }



    getPayment = async (req,res)=>{
        const result = await paymentService.getPayment()
        return res.status(200).json(result)
    }
    getPaymentById =async (req,res)=>{
        const result = await paymentService.getPaymentById(req.params.id)
        return res.status(200).json(result)
    }

    getPaymentByCinemaId = async (req,res)=>{
        const result = await paymentService.getPaymentByCinemaId(req.params.id)
        return res.status(200).json(result)
    }
}
module.exports = new paymentController