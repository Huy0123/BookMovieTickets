const movie = require('../models/Movie');
const upload = require('../utils/upload')


class MovieService {
    createMovie = async (movieData) => {
        try {
            const { files, body } = movieData;

            const uploadFile = async (file) => {
                return await upload.uploadFile(
                    String(file.originalname), 
                    file.buffer, 
                    String(file.mimetype)
                );
            };
    
            let poster1Url = null;
            let poster2Url = null;
    
            // Kiểm tra và upload poster1
            if (files.poster1 && files.poster1[0]) {
                poster1Url = await uploadFile(files.poster1[0]);
            } else {
                console.warn("Poster1 file is missing.");
            }
    
            // Kiểm tra và upload poster2
            if (files.poster2 && files.poster2[0]) {
                poster2Url = await uploadFile(files.poster2[0]);
            } else {
                console.warn("Poster2 file is missing.");
            }
    
            // Tạo phim trong cơ sở dữ liệu với đường dẫn poster
            const createMovie = await movie.create({
                ...body,
                poster1: poster1Url,
                poster2: poster2Url
            });
    
            return createMovie;
        } catch (error) {
            throw error
        }
       
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