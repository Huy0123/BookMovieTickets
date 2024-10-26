const mongoose = require('mongoose');
const showtimes = require('./Showtime');
const seats = require('./Seat');
const createRoom = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    cinema_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cinemas',
        required: true
    }
    });
const rooms = mongoose.model('rooms', createRoom);
module.exports = rooms;

createRoom.pre('remove', async function(next){
    try{
        await showtimes.deleteMany({room_id: this._id});
        await seats.deleteMany({room_id: this._id});
        next();
    } catch (error){
        next(error);
    }
});