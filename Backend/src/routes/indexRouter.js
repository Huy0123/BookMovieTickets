
const Users = require('./UserRouter.js')
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


    module.exports = route;
