const express = require('express')
const router = express.Router()
const promotionController = require('../controllers/PromotionController')

router.post('/createPromotion', promotionController.createPromotion)
router.get('/getPromotions', promotionController.getPromotions)
router.get('/getPromotionByID/:id', promotionController.getPromotionByID)
router.put('/updatePromotion/:id', promotionController.updatePromotion)
router.delete('/deletePromotion/:id', promotionController.deletePromotion)

module.exports = router