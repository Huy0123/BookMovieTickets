const mongoose = require('mongoose');
const rooms = require('./Room');
const showtimes = require('./Showtime');
const { createShowtime } = require('../services/ShowtimeService');
const createCinema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
});

const cinemas = mongoose.model('cinemas', createCinema);
module.exports = cinemas;