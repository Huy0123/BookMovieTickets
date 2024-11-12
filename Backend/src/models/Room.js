const mongoose = require('mongoose');
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
