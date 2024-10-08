const promotionService = require('../services/PromotionService');

class PromotionController {
    createPromotion = async (req, res) => {
        try {
            const promotion = await promotionService.createPromotion(req.body);
            res.status(201).send(promotion);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getPromotions = async (req, res) => {
        try {
            const promotions = await promotionService.getPromotions();
            res.status(200).send(promotions);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getPromotionByID = async (req, res) => {
        try {
            const promotion = await promotionService.getPromotionByID(req.params.id);
            res.status(200).send(promotion);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    updatePromotion = async (req, res) => {
        try {
            const promotion = await promotionService.updatePromotion(req.params.id, req.body);
            res.status(200).send(promotion);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    deletePromotion = async (req, res) => {
        try {
            await promotionService.deletePromotion(req.params.id);
            res.status(204).json({ message: 'Promotion deleted successfully' });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    
}

module.exports = new PromotionController;