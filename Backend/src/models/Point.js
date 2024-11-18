const mongoose = require('mongoose');

const createPoint = new mongoose.Schema({
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
    points:{
        type:Number,
        required:true
    },
    image:{
        type: String,
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

const points = mongoose.model('point', createPoint);
module.exports = points;