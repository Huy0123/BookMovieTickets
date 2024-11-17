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
        const result=await paymentService.createrVnpay(data)
        return res.status(201).json(result)
    }
    returnVnpay= async(req,res)=>{
        const result = await paymentService.returnVnpay(req.params.query)
        return res.status(200).json(result)
    }

    createrZalopay = async (req,res)=>{
        const data = req.body
        const result=await paymentService.createrZalopay(data)
        return res.status(201).json(result)
    }
    callbackZalopay= async(req,res)=>{
        const result = await paymentService.callbackZalopay(req.body)
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
    getPaymentByUserId= async (req,res)=>{
        const result = await paymentService.getPaymentByUserId(req.params.id)
        return res.status(200).json(result)
    }

    getPaymentByMovie= async (req,res)=>{
        try {
            const result = await paymentService.getPaymentByMovie()
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}
module.exports = new paymentController