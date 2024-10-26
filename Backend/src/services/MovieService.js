const movie = require('../models/Movie');
const upload = require('../utils/upload')


class MovieService {
    createMovie = async (movieData) => {
    const posterFile = movieData.files.poster ? movieData.files.poster[0] : null;
    const trailerFile = movieData.files.trailer ? movieData.files.trailer[0] : null;

    let posterUrl = null;
    if (posterFile) {
        posterUrl = await upload.uploadFile(String(posterFile.originalname), posterFile.buffer, String(posterFile.mimetype));
    } else {
        throw new Error("Poster file is missing.");
    }

    let trailerUrl = null;
    if (trailerFile) {
        trailerUrl = await upload.uploadFile(trailerFile.originalname, trailerFile.buffer, trailerFile.mimetype);
    } else {
        throw new Error("Trailer file is missing.");
    }
        
        const createMovie = await movie.create({
            ...movieData.body,
            poster: posterUrl,
            trailer: trailerUrl
        });
        return createMovie;
    }

    getMovies = async () => {
        return await movie.find();
    }

    getMovieByID = async (id) => {
        return await movie.findById(id);
    }

    updateMovie = async (id, movieData) => {
        const posterFile = movieData.files.poster ? movieData.files.poster[0] : null;
    const trailerFile = movieData.files.trailer ? movieData.files.trailer[0] : null;
        const exitingMovie = await movie.findById(id);
        if (posterFile){
            if (exitingMovie.poster){
                await upload.deleteFile(exitingMovie.poster);
            }
            const posterUrl = await upload.uploadFile(posterFile.originalname, posterFile.buffer, posterFile.mimetype);
            movieData.body.poster = posterUrl;
        }

        if (trailerFile){
            if (exitingMovie.trailer){
                await upload.deleteFile(exitingMovie.trailer);
            }
            const trailerUrl = await upload.uploadFile(trailerFile.originalname, trailerFile.buffer, trailerFile.mimetype);
            movieData.body.trailer = trailerUrl;
        }

        return await movie.findByIdAndUpdate(id, movieData.body, { new: true });
    
    }

    deleteMovie = async (id) => {
        const existingMovie = await movie.findById(id);
        if (existingMovie.poster){
            await upload.deleteFile(existingMovie.poster);
        }
        if (existingMovie.trailer){
            await upload.deleteFile(existingMovie.trailer);
        }
        return await movie.findByIdAndDelete(id);
    }

}

module.exports = new MovieService;