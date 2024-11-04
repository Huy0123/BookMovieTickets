const mongoose = require('mongoose');
const rooms = require('./Room');
const showtimes = require('./Showtime');
const { createShowtime } = require('../services/ShowtimeService');
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

createCinema.pre('remove', async function(next){
    try{
        await rooms.deleteMany({cinema_id: this._id});
        await showtimes.deleteMany({cinema_id: this._id});
        next();
    } catch (error){
        next(error);
    }
});