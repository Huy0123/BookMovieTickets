const cinemaService = require('../services/CinemaService');

class CinemaController {
    createCinema = async (req, res) => {
        try {
            const cinema = await cinemaService.createCinema(req.body);
            res.status(201).send(cinema);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getCinemas = async (req, res) => {
        try {
            const cinemas = await cinemaService.getCinemas();
            res.status(200).send(cinemas);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getCinemaByID = async (req, res) => {
        try {
            const cinema = await cinemaService.getCinemaByID(req.params.id);
            res.status(200).send(cinema);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    updateCinema = async (req, res) => {
        try {
            const cinema = await cinemaService.updateCinema(req.params.id, req.body);
            res.status(200).send(cinema);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    deleteCinema = async (req, res) => {
        try {
            const result = await cinemaService.deleteCinema(req.params.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).send(error.message);
        }
    }

    getCinemasByMovieID = async (req, res) => {
        try {
            const cinemas = await cinemaService.getCinemasByMovieID(req.params.id);
            res.status(200).send(cinemas);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getCinemasByCity = async (req, res) => {
        try {
            const cinemas = await cinemaService.getCinemasByCity(req.params.city);
            res.status(200).send(cinemas);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getCinemasByMovieIDAndCity = async (req, res) => {
        try {
            const cinemas = await cinemaService.getCinemasByMovieIDAndCity(req.params.id, req.params.city);
            res.status(200).send(cinemas);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getCinemaIdByUserId = async (req, res) => {
        try {
            const cinemas = await cinemaService.getCinemaIdByUserId(req.params.id);
            return res.status(200).json(cinemas);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    getShowtimeAndPaymentByCinema = async (req, res) => {
        try {
            const showtimeAndPayment = await cinemaService.getShowtimeAndPaymentByCinema();
            return res.status(200).json(showtimeAndPayment);
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

}

module.exports = new CinemaController;

