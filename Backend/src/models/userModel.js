const mongoose = require('mongoose');

const createUser = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    num: {
        type: String,
       
    },
    password: {
        type: String,
      
    },
    role: {
        type: String,
        default:"User"
    },
});

    const users = mongoose.model('users', createUser);
    module.exports = users;


