const bookingService = require('../services/bookingService.js')
class BookingController {
    createBooking = async (req,res,next)=>{
        try {
            const data = req.body
            console.log(data)
            if(!data){
                return res.status(404).json({message: 'chưa có thông tin để đặt vé'})
            }
            const result = await bookingService.createBooking(data)
            return res.status(200).json(result)
        } catch (error) {
            throw error
        }
        
    }
    GetBooking = async (req,res) =>{
        try {  
            const result = await bookingService.GetBooking()
            return res.status(200).json(result)
        } catch (error) {
            throw error
        }
    }
    GetUserBookingById = async(req,res)=>{
        try {
            const data = req.params.id;
            const result = await bookingService.GetUserBookingById(data)
            return res.status(200).json(result)
        } catch (error) {
            throw error
        }
    }
    GetBookingById = async(req,res)=>{
        try {
            const data = req.params.id;
            const result = await bookingService.GetBookingById(data)
            return res.status(200).json(result)
        } catch (error) {
            throw error
        }
    }
}
module.exports = new BookingController