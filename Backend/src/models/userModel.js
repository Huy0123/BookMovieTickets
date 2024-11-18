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
        default: [] 
    }
    ,
    role: {
        type: String,
        default:"User"
    },
});
createUser.pre('save', async function (next) {
    try {
        // Tìm tất cả các khuyến mãi có points = 0
        const zeroPointsPromotions = await mongoose.model('point').find({ points: 0 });
        if (zeroPointsPromotions && zeroPointsPromotions.length > 0) {
            // Lọc những khuyến mãi chưa có trong promotions_id
            const newPromotions = zeroPointsPromotions
                .map((promo) => promo._id)
                .filter((id) => !this.promotions_id.includes(id));

            // Thêm các khuyến mãi mới vào promotions_id
            this.promotions_id = [...this.promotions_id, ...newPromotions];
        }
    } catch (err) {
        return next(err);
    }
    next();
});

    const users = mongoose.model('users', createUser);
    module.exports = users;


