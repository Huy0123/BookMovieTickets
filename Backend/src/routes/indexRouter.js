
const Users = require('./UserRouter.js')
const Payment = require('./PaymentRouter.js')
const Booking = require('./BookingRouter.js')
const movie = require('../routes/MovieRouter.js')
const showtime = require('../routes/ShowtimeRouter.js')
const seat = require('../routes/SeatRouter.js')
const cinema = require('../routes/CinemaRouter.js')
const promotion = require('../routes/PromotionRouter.js')
const room = require('../routes/RoomRouter.js')
const seatTime = require('../routes/SeatTimeRouter.js')
const point = require('../routes/PointRouter.js')
const food = require('./FoodRouter.js')
function route(app){
    app.use('/v1/Users',Users)
    app.use('/v1/Payment',Payment)
    app.use('/v1/Booking',Booking)
    app.use('/v1',movie)
    app.use('/v1', showtime)
    app.use('/v1',seat)
    app.use('/v1', cinema)
    app.use('/v1',promotion)
    app.use('/v1',room)
    app.use('/v1',seatTime)
    app.use('/v1',point)
    app.use('/v1/Food',food)

}

module.exports = route;
