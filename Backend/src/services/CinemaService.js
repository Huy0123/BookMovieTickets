const cinema = require('../models/Cinema');


class CinemaService {
    createCinema = async (cinemaData) => {
        return await cinema.create(cinemaData);
    }

    getCinemas = async () => {
        return cinema.find();
    }

    getCinemaByID = async (id) => {
        return cinema.findById(id);
    }

    updateCinema = async (id, cinemaData) => {
        await cinema.findByIdAndUpdate(id, cinemaData);
        return cinema.findById(id);
    } 

    deleteCinema = async (id) => {
        await cinema.findByIdAndDelete(id);
    }

    getCinemasByMovieID = async (id) => {
        return cinema.find({ movies: id });
    }

    getCinemasByCity = async (city) => { 
        return cinema.find({ address: { $regex: city, $options: 'i' } });
    }

    getCinemasByMovieIDAndCity = async (id, city) => {
        return cinema.find({ movies: id,  address: { $regex: city, $options: 'i' } });
    }
}

module.exports = new CinemaService;