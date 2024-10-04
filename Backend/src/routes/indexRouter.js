
const Users = require('./UserRouter.js')
const Payment = require('./PaymentRouter.js')
function route(app){
    app.use('/v1',Users)
    app.use('/v1',Payment)
}

module.exports = route;
