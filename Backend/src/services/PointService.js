const pointModel = require('../models/Point');
const User = require('../models/userModel')
class PointService {
    createPoint = async (pointData) => {
        return await pointModel.create(pointData);
    }
    getPoints = async () => {
        return await pointModel.find();
    }
    getPointByID = async (id) => {
        return await pointModel.findById(id);
    }
    updatePoint = async (id, pointData) => {
        return await pointModel.findByIdAndUpdate(id, pointData, { new: true });
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
                throw new Error('Not enough points to exchange');
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
            throw error; // Rethrow the error to be handled in the controller
        }
    }
}

module.exports = new PointService;
