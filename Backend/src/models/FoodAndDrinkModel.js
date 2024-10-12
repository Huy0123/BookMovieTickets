const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodAndDrinkSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['food', 'drink'], 
        required: true
    }
});

const   FoodAndDrink = mongoose.model('Food_and_Drink', foodAndDrinkSchema);
module.exports = FoodAndDrink;
