const seatService = require('../services/SeatService.js');

class SeatController {
    createSeat = async (req, res) => {
        try {
            const seat = await seatService.createSeat(req.body);
            res.status(201).send(seat);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getSeats = async (req, res) => {
        try {
            const seats = await seatService.getSeats();
            res.status(200).send(seats);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getSeatByID = async (req, res) => {
        try {
            const seat = await seatService.getSeatByID(req.params.id);
            res.status(200).send(seat);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    updateSeat = async (req, res) => {
        try {
            const seat = await seatService.updateSeat(req.params.id, req.body);
            res.status(200).send(seat);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    deleteSeat = async (req, res) => {
        try {
            await seatService.deleteSeat(req.params.id);
            res.status(204).json({ message: 'Seat deleted successfully' });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getSeatByRoomID = async (req, res) => {
        try {
            const seat = await seatService.getSeatByRoomID(req.params.id);
            res.status(200).send(seat);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

module.exports = new SeatController;