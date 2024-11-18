const showtimeService = require('../services/ShowtimeService');

class ShowtimeController {
    createShowtime = async (req, res) => {
        try {
            const showtime = await showtimeService.createShowtime(req.body);
            res.status(201).send(showtime);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    getRoomAvailabilityByCinemaIDAndDate = async (req, res) => {
        const { cinema_id, showtime_start, showtime_end } = req.query;
        try {
            const showtimes = await showtimeService.getRoomAvailabilityByCinemaIDAndDate(cinema_id, showtime_start , showtime_end);
            res.status(200).send(showtimes);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getShowtimes = async (req, res) => {
        try {
            const showtimes = await showtimeService.getShowtimes();
            res.status(200).send(showtimes);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getShowtimeByID = async (req, res) => {
        try {
            const showtime = await showtimeService.getShowtimeByID(req.params.id);
            res.status(200).send(showtime);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    updateShowtime = async (req, res) => {
        try {
            const showtime = await showtimeService.updateShowtime(req.params.id, req.body);
            res.status(200).send(showtime);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    deleteShowtime = async (req, res) => {
        try {
            await showtimeService.deleteShowtime(req.params.id);
            res.status(204).json({ message: 'Showtime deleted successfully' });
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getShowtimeByMovieID = async (req, res) => {
        try {
            const showtimes = await showtimeService.getShowtimesByMovieID(req.params.id);
            res.status(200).send(showtimes);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getShowtimeByCinemaID = async (req, res) => {
        try {
            const showtimes = await showtimeService.getShowtimesByCinemaID(req.params.id);
            res.status(200).send(showtimes);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getShowtimeByMovieIDAndCinemaIDAndDate = async (req, res) => {
        try{
            const showtimes = await showtimeService.getShowtimesByMovieIDAndCinemaIDAndDate(req.params.movieID, req.params.cinemaID, req.params.date);
            res.status(200).send(showtimes);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }


getShowtimeByMovieFromCinemaId = async (req, res) => {
    try{
        const showtimes = await showtimeService.getShowtimeByMovieFromCinemaId(req.params.movieID, req.params.cinemaID);
        res.status(200).send(showtimes);
    } catch (error) {
        res.status(400).send(error.message);
    }
}   
}
module.exports = new ShowtimeController;