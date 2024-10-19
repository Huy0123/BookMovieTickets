const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
    point:{
        type:Number,
        default:0
    },
    promotions_id: {
        type: [Schema.Types.ObjectId],
        ref: 'point',
        default: [] // Đặt giá trị mặc định là một mảng chứa ObjectId
    }
    

    ,
    role: {
        type: String,
        default:"User"
    },
});

    const users = mongoose.model('users', createUser);
    module.exports = users;


