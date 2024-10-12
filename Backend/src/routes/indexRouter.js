
const Users = require('./UserRouter.js')
const Payment = require('./PaymentRouter.js')
const Booking = require('./BookingRouter.js')
const movie = require('../routes/MovieRouter.js')
const showtime = require('../routes/ShowtimeRouter.js')
const seat = require('../routes/SeatRouter.js')
const cinema = require('../routes/CinemaRouter.js')
const promotion = require('../routes/PromotionRouter.js')
const room = require('../routes/RoomRouter.js')

function route(app){
    app.use('/v1/Users',Users)
    app.use('/v1/Payment',Payment)
    app.use('/v1/Booking',Booking)
    app.use('/v1',movie)
    // app.use('/v1',booking)
    app.use('/v1', showtime)
    app.use('/v1',seat)
    app.use('/v1', cinema)
    // app.use('/v1',payment)
    app.use('/v1',promotion)
    app.use('/v1',room)
    // app.use('/v1/SendEmail',SendEmail)
    app.get('/v1', (req, res) => {
        res.send('API đang hoạt động!');
    });
}
module.exports = route;
