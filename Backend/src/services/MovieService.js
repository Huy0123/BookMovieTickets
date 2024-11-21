const movie = require('../models/Movie.js');
const upload = require('../utils/upload.js')


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
        const { files, body } = movieData;
        const uploadFile = async (file) => {
            return await upload.uploadFile(
                String(file.originalname), 
                file.buffer, 
                String(file.mimetype)
            );
        };
        const exitingMovie = await movie.findById(id);
        if (files.poster1 && files.poster1[0]) {
            if (exitingMovie.poster1){
                await upload.deleteFile(exitingMovie.poster1);
            }
            const poster1Url = await uploadFile(files.poster1[0]);
            movieData.body.poster1 = poster1Url;
        }

        if (files.poster2 && files.poster2[0]) {
            if (exitingMovie.poster2){
                await upload.deleteFile(exitingMovie.poster2);
            }
            const poster2Url = await uploadFile(files.poster2[0]);
            movieData.body.poster2 = poster2Url;
        }

        return await movie.findByIdAndUpdate(id, movieData.body, { new: true });
    
    }

    deleteMovie = async (id) => {
        const existingMovie = await movie.findById(id);
        if (existingMovie.poster1){
            await upload.deleteFile(existingMovie.poster1);
        }
        if (existingMovie.poster2){
            await upload.deleteFile(existingMovie.poster2);
        }
        return await movie.findByIdAndDelete(id);
    }

}

module.exports = new MovieService;