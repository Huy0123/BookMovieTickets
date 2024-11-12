const mongoose = require('mongoose');

const createCinema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    address:{
        type: String,
        required: true
    },
});


const cinemas = mongoose.model('cinemas', createCinema);
module.exports = cinemas;

