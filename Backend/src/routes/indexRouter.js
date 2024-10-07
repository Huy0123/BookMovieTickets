
const Users = require('./UserRouter.js')
<<<<<<< HEAD
const Payment = require('./PaymentRouter.js')
const Booking = require('./BookingRouter.js')

function route(app){
    app.use('/v1/Users',Users)
    app.use('/v1/Payment',Payment)
    app.use('/v1/Booking',Booking)
    app.get('/v1', (req, res) => {
        res.send('API đang hoạt động!');
    });

}

=======
const movie = require('../routes/MovieRouter.js')
const booking = require('../routes/BookingRouter.js')
const showtime = require('../routes/ShowtimeRouter.js')
const seat = require('../routes/SeatRouter.js')
const cinema = require('../routes/CinemaRouter.js')
const payment = require('../routes/PaymentRouter.js')
const promotion = require('../routes/PromotionRouter.js')
const room = require('../routes/RoomRouter.js')
function router(app) {
    app.use('/v1', Users)
    app.use('/v1',movie)
    // app.use('/v1',booking)
    app.use('/v1', showtime)
    app.use('/v1',seat)
    app.use('/v1', cinema)
    // app.use('/v1',payment)
    app.use('/v1',promotion)
    app.use('/v1',room)
}
>>>>>>> 013d85ec86bebbb85163bf916e8516a4a3b91ebe

module.exports = router;
