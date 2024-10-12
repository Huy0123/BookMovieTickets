const mongoose = require('mongoose');
const FoodAndDrink = require('./FoodAndDrinkModel');
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
    }
})

const oders = mongoose.model('oders',createOrder)
module.exports = oders