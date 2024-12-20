const mongoose = require('mongoose');
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
    cinema_id: 
        {
            type: Schema.Types.ObjectId,
            ref: 'cinemas',
        }
    ,
    seats_id: [
        {
            type: Schema.Types.ObjectId,
            ref: 'seats', 
        }
    ],
    showtime_id:{
        type: Schema.Types.ObjectId,
        ref: 'showtimes',
        required: true
    }
    ,
    point_id:{
        type: Schema.Types.ObjectId,
        ref: 'point',
    },
    FoodAndDrinks_id: [
        {
            item_id: {
                type: Schema.Types.ObjectId,
                ref: 'Food_and_Drink',
                required: true
            },
            quantity: {
                type: Number,
                default: 1 
            }
        }
    ],
    total_price:{
        type : Number,
        required : true
    },
    status:{
        type :Boolean,
        default:false,
        require:true
        
    }
})

const oders = mongoose.model('oders',createOrder)
module.exports = oders