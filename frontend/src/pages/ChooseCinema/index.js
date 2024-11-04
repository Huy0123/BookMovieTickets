import React, { useState, useEffect } from 'react';
import styles from './ChooseCinema.module.scss';
import classNames from 'classnames/bind';
import 'bootstrap/dist/css/bootstrap.min.css';
import images from '~/assets/img';
import TrailerModal from '../Trailer/TrailerModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClock, faClosedCaptioning, faEarthAsia, faTag, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

function ChooseCinema() {
    const [visibleMovies, setVisibleMovies] = useState([]); // Movies to display
    const [startIndex, setStartIndex] = useState(0); // Current index
    const [selectedMovie, setSelectedMovie] = useState(null); // Selected movie
    const [allMovies, setAllMovies] = useState([]); // All movies fetched for the cinema
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState(''); // State for trailer link
    const cinema_id = useParams().id; // Get cinema ID from URL params
    const navigate = useNavigate();
    useEffect(() => {
        const fetchMoviesByCinemaId = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/v1/getMovies`);
                setAllMovies(res.data);
                setVisibleMovies(res.data.slice(0, 5)); // Display first 5 movies
                console.log("mv",res.data);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMoviesByCinemaId();
    }, [cinema_id]); // Fetch movies whenever the cinema_id changes

    const handleBack = () => {
        if (startIndex < allMovies.length - 5) {
            const newIndex = startIndex + 1;
            setStartIndex(newIndex);
            setVisibleMovies(allMovies.slice(newIndex, newIndex + 5));
        }
    };

    const handleNext = () => {
        if (startIndex > 0) {
            const newIndex = startIndex - 1;
            setStartIndex(newIndex);
            setVisibleMovies(allMovies.slice(newIndex, newIndex + 5));
        }
    };

    const handleSelectMovie = (movieId) => {
        setSelectedMovie(movieId); // Update selected movie

        // // Smooth scroll to the content section
        // setTimeout(() => {
        //     const wrapContent = document.getElementById('wrap-content');
        //     if (wrapContent) {
        //         wrapContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        //     }
        // }, 0);
        navigate(`/bookticket/${movieId}`); 
    };

    const openModal = (link) => {
        setTrailerUrl(link);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={cx('container')}>
            <div className={cx('wrap-card')}>
                {visibleMovies.map((movie) => (
                    <div 
                        key={movie._id} 
                        className={cx('the')} 
                        // Handle movie selection
                    >
                        <img src={movie.poster} alt={movie.title} className={cx('movie-image')} onClick={() => handleSelectMovie(movie._id)} />
                        <div className={cx('content-movie')}>
                            <h3 className={cx('movie-title')} onClick={() => handleSelectMovie(movie._id)} >{movie.title}</h3>
                            <button 
                                onClick={() => openModal(movie.trailerLink)} 
                                className={cx('trailer-link')}
                            >
                                Xem Trailer
                            </button>
                            <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
                        </div>
                    </div>
                ))}
            </div>

            <div className={cx('pagination')}>
                <button onClick={handleNext} disabled={startIndex === 0}>
                    <FontAwesomeIcon className={cx('icon-pre')} icon={faChevronLeft} />
                </button>
                <button onClick={handleBack} disabled={startIndex >= allMovies.length - 5}>
                    <FontAwesomeIcon className={cx('icon-next')} icon={faChevronRight} />
                </button>
            </div>

            {selectedMovie && ( // Show details when a movie is selected
                <div id="wrap-content" className={cx('wrap-content', 'my-5')}>
                    <div className="row">
                        <div className={cx('movie-detail', 'col-4')}>
                            <img src={selectedMovie.poster} className={cx('d-block')} alt={selectedMovie.title} />
                        </div>
                        <div className={cx('wrap-line')}>
                            <div className={cx('wrap-info', 'mb-5')}>
                                <h1 className={cx('title')}>Tên phim: {selectedMovie.title}</h1>
                                <div className="info-group d-flex">
                                    <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faTag} />
                                    <div className={cx('type')}>Thể loại: ...</div>
                                </div>
                                <div className="info-group d-flex">
                                    <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faClock} />
                                    <div className={cx('duration')}>Thời gian: ...</div>
                                </div>
                                <div className="info-group d-flex">
                                    <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faEarthAsia} />
                                    <div className={cx('country')}>Quốc gia: ...</div>
                                </div>
                                <div className="info-group d-flex">
                                    <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faClosedCaptioning} />
                                    <div className={cx('sub')}>Phụ đề: ...</div>
                                </div>
                                <div className="info-group d-flex">
                                    <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faUserCheck} />
                                    <div className={cx('limit')}>Nhãn phim: ...</div>
                                </div>
                            </div>
                            <div className={cx('schedule')}>
                                <div className={cx('group')}>
                                    {[...Array(3)].map((_, i) => (
                                        <button key={i} className={cx('btn-schedule')}>8:00</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChooseCinema;
