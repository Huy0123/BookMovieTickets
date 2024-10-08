const mongoose = require('mongoose');

const createPromotion = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    discount:{
        type: Number,
        required: true
    },
    start_date:{
        type: Date,
        required: true
    },
    end_date:{
        type: Date,
        required: true
    }
});
const promotions = mongoose.model('promotions', createPromotion);
module.exports = promotions;