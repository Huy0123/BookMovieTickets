const movieService = require('../services/MovieService');

class MovieController {
    createMovie = async (req, res) => {
        try{ 
            const movie = await movieService.createMovie(req);
            res.status(201).json(movie);
        } catch (error) {
            // res.status(500).json({ error: 'Failed to create movie' });
            throw error;
        }
    };

    getMovies = async (req, res) => {
        try{
            const movies = await movieService.getMovies();
            res.status(200).json(movies);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get movies' });
        }
    }

    getMovieByID = async (req, res) => {
        try{
            const movie = await movieService.getMovieByID(req.params.id);
            res.status(200).json(movie);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get movie' });
        }
    }

    updateMovie = async (req, res) => {
        try {
            
            const updatedMovie = await movieService.updateMovie(req.params.id, req);
            res.status(200).json(updatedMovie);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update movie' });
        }
    };
    

    deleteMovie = async (req, res) => {
        try{
            await movieService.deleteMovie(req.params.id);
            res.status(204).json({message: 'Movie deleted successfully'});
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete movie' });
        }
    }
}

module.exports = new MovieController();