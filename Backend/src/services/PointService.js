const pointModel = require('../models/Point');
const User = require('../models/userModel')
const upload = require('../utils/upload');
class PointService {
    createPoint = async (pointData) => {
        try {
        const { file, body } = pointData;
        const uploadFile = async (file) => {
            return await upload.uploadFile(
                String(file.originalname),
                file.buffer,
                String(file.mimetype)
            );
        };
        let imageUrl = null;
        if (file) {
             imageUrl = await uploadFile(file);
        } else {
            console.warn('No image uploaded');
        }
        return await pointModel.create({
            ...body,
            image: imageUrl
        });
    } catch (error) {
        throw error;
    }

    }
    getPoints = async () => {
        return await pointModel.find();
    }
    getPointByID = async (id) => {
        return await pointModel.findById(id);
    }
    
    updatePoint = async (id, pointData) => {
        const { file, body } = pointData;
        const uploadFile = async (file) => {
            return await upload.uploadFile(
                String(file.originalname),
                file.buffer,
                String(file.mimetype)
            );
        };
        let imageUrl = null;
        if (file) {
            imageUrl = await uploadFile(file);
        } else {
            console.warn('No image uploaded');
        }
        return await pointModel.findByIdAndUpdate(id, {
            ...body,
            image: imageUrl
        });
    }

    deletePoint = async (id) => {
        return await pointModel.findByIdAndDelete(id);
    }
    exchangePoints = async (userId, pointId) => {
        try {
            // Fetch the point by ID
            const point = await pointModel.findById(pointId);
            console.log(point);
            // Check if the point exists
            if (!point) {
                throw new Error('Point ID not found');
            }

            // Fetch the user by ID
            const user = await User.findById(userId);  
            if (!user) {
                throw new Error('User not found');
            }

            if (user.point < point.points) {
                const error = new Error('Không đủ điểm');
                error.code = 'INSUFFICIENT_POINTS'; // Bạn có thể đặt mã lỗi tùy chỉnh
                throw error;
            }

            user.point -= point.points;
            console.log(user.point);
            await user.save(); 
            await User.updateOne({_id:userId},{ $push: { promotions_id: pointId } } )


            return {
                message: 'Points exchanged successfully',
                remainingPoints: user.point,
                point: point
            };
        } catch (error) {
            throw error; 
        }
    }
}

module.exports = new PointService;
