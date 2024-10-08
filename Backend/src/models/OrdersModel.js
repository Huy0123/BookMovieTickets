const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const createOrder = mongoose.Schema({
    user_id : {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    order_date : {
        type : Date,
        default: Date.now,
    },
    total_price:{
        type : Number,
        required : true
    }
})

const oders = mongoose.model('oders',createOrder)
module.exports = oders