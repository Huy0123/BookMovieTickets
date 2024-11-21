const mongoose = require('mongoose');

const createPoint = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    discount:{
        type: Number,
        required: true
    },
    points:{
        type:Number,
        required:true
    },
    image:{
        type: String,
        required: true
    },
    start_date:{
        type: Date,
        required: true
    },
    end_date:{
        type: Date,
        required: true
    }
});

createPoint.post('save', async function (doc) {
    try {
        if (doc.points === 0) {
            // Lấy tất cả user và thêm mã khuyến mãi này vào promotions_id
            const User = mongoose.model('users'); // Lấy model user
            const users = await User.find(); // Lấy tất cả user trong database

            // Thêm mã khuyến mãi vào promotions_id của từng user nếu chưa có
            await Promise.all(users.map(async (user) => {
                // Nếu user chưa có mã khuyến mãi này, thêm vào
                if (!user.promotions_id.includes(doc._id)) {
                    user.promotions_id.push(doc._id);
                    await user.save(); // Lưu lại user với promotions_id mới
                }
            }));

            console.log(`Đã thêm mã khuyến mãi ${doc._id} vào tất cả user.`);
        }
    } catch (err) {
        console.error('Lỗi khi thêm mã khuyến mãi vào user:', err);
    }
});
createPoint.pre('find', async function () {
    const now = new Date();
    // Xóa các mã khuyến mãi đã hết hạn
    await mongoose.model('point').deleteMany({ end_date: { $lt: now } });
    console.log('Đã xóa các mã khuyến mãi hết hạn.');
    
        
});


const points = mongoose.model('point', createPoint);
module.exports = points;