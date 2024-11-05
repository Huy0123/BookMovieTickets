const movie = require('../models/Movie');
const upload = require('../utils/upload')


class MovieService {
    createMovie = async (movieData) => {
    const poster1File = movieData.files.poster1 ? movieData.files.poster1[0] : null;
    const poster2File = movieData.files.poster2 ? movieData.files.poster2[0] : null;
    const trailerFile = movieData.files.trailer ? movieData.files.trailer[0] : null;

    let poster1Url = null;
    if (poster1File) {
        poster1Url = await upload.uploadFile(String(poster1File.originalname), poster1File.buffer, String(poster1File.mimetype));
    } else {
        throw new Error("Poster file is missing.");
    }

    let poster2Url = null;
    if (poster2File) {
        poster2Url = await upload.uploadFile(String(poster2File.originalname), poster2File.buffer, String(poster2File.mimetype));
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
            poster1: poster1Url, 
            poster2: poster2Url,
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
        const poster1File = movieData.files.poster1 ? movieData.files.poster1[0] : null;
        const poster2File = movieData.files.poster2 ? movieData.files.poster2[0] : null;
        const trailerFile = movieData.files.trailer ? movieData.files.trailer[0] : null;
        const exitingMovie = await movie.findById(id);
        if (poster1File){
            if (exitingMovie.poster1){
                await upload.deleteFile(exitingMovie.poster1);
            }
            if (exitingMovie.poster2){
                await upload.deleteFile(exitingMovie.poster2);
            }
            const poster1Url = await upload.uploadFile(poster1File.originalname, poster1File.buffer, poster1File.mimetype);
            const poster2Url = await upload.uploadFile(poster2File.originalname, poster2File.buffer, poster2File.mimetype);
            movieData.body.poster = poster1Url;
            movieData.body.poster = poster2Url;
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