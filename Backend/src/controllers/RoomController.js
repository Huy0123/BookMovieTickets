const roomService = require('../services/RoomService');

class RoomController {
    createRoom = async (req, res) => {
        try {
            const room = await roomService.createRoom(req.body);
            res.status(201).send(room);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    getRoomByCinemaID = async (req, res) => {
        try {
            const rooms = await roomService.getRoomByCinemaID(req.params.id);
            res.status(200).send(rooms);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getRooms = async (req, res) => {
        try {
            const rooms = await roomService.getRooms();
            res.status(200).send(rooms);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getRoomByID = async (req, res) => {
        try {
            const room = await roomService.getRoomByID(req.params.id);
            res.status(200).send(room);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    updateRoom = async (req, res) => {
        try {
            const room = await roomService.updateRoom(req.params.id, req.body);
            res.status(200).send(room);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    deleteRoom = async (req, res) => {
        try {
            await roomService.deleteRoom(req.params.id);
            res.status(204).json({ message: 'Room deleted successfully' });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}

module.exports = new RoomController;