const mongoose = require('mongoose')

const createService = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
})

const services = mongoose.model('services', createService);
module.exports = services;