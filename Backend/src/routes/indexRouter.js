
const Users = require('./UserRouter.js')
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

module.exports = router;
