const SeatTimeService = require('../services/SeatTimeService');

class SeatTimeController {
    createSeatTime = async (req, res) => {
        try {
            const seatTime = await SeatTimeService.createSeatTime(req.body);
            res.status(201).send(seatTime);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getSeatTimes = async (req, res) => {
        try {
            const seatTimes = await SeatTimeService.getSeatTimes();
            res.status(200).send(seatTimes);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getSeatTimeByID = async (req, res) => {
        try {
            const seatTime = await SeatTimeService.getSeatTimeByID(req.params.id);
            res.status(200).send(seatTime);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    updateSeatTime = async (req, res) => {
        try {
            const seatTime = await SeatTimeService.updateSeatTime(req.params.id, req.body);
            res.status(200).send(seatTime);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    deleteSeatTime = async (req, res) => {
        try {
            await SeatTimeService.deleteSeatTime(req.params.id);
            res.status(204).json({ message: 'SeatTime deleted successfully' });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getSeatTimeByShowtimeID = async (req, res) => {
        try {
            const seatTime = await SeatTimeService.getSeatTimeByShowtimeID(req.params.id);
            res.status(200).send(seatTime);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    
}

module.exports = new SeatTimeController;