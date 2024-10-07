const express = require('express');
const serviceController = require('../controllers/OtherServiceController');

const router = express.Router();

router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);
router.post('/services', serviceController.createService);
router.put('/services/:id', serviceController.updateService);
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;