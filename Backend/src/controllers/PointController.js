const pointService = require('../services/PointService');
const userService = require('../services/userService');
class PointController{
    createPoint = async (req, res) => {
        try {
            const point = await pointService.createPoint(req.body);
            res.status(201).send(point);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    getPoints = async (req, res) => {
        try {
            const point = await pointService.getPoints();
            res.status(200).send(point);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    getPointByID = async (req, res) => {
        try {
            const point = await pointService.getPointByID(req.params.id);
            res.status(200).send(point);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    updatePoint = async (req, res) => {
        try {
            const point = await pointService.updatePoint(req.params.id, req.body);
            res.status(200).send(point);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    deletePoint = async (req, res) => {
        try {
            await pointService.deletePoint(req.params.id);
            res.status(200).json({ message: 'Point deleted successfully' });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    exchange = async (req, res) => {
        try {
            const { pointId, userId } = req.body;
            console.log(pointId, userId);
            const result = await pointService.exchangePoints(userId, pointId);
            res.status(200).json(result);
        } catch (error) {
          
            if(error.code = 'INSUFFICIENT_POINTS'){
                return res.status(404).json({message:"A"})
            }
        }
    }
}

module.exports = new PointController;