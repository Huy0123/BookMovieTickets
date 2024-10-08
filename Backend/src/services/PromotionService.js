const promotion = require('../models/Promotion');

class PromotionService {
    createPromotion = async (promotionData) => {
        return await promotion.create(promotionData);
    }

    getPromotions = async () => {
        return await promotion.find();
    }

    getPromotionByID = async (id) => {
        return await promotion.findById(id);
    }

    updatePromotion = async (id, promotionData) => {
        return await promotion.findByIdAndUpdate(id, promotionData, { new: true });
    }

    deletePromotion = async (id) => {
        return await promotion.findByIdAndDelete(id);
    }
}

module.exports = new PromotionService;