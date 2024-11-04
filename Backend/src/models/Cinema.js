const mongoose = require('mongoose');
const rooms = require('./Room');
const showtimes = require('./Showtime');
const userModel = require('./userModel')
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
        await userModel.deleteMany({_id: this.user_id});
        next();
    } catch (error){
        next(error);
    }
});