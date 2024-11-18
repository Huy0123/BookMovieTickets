import classNames from 'classnames/bind';
import styles from './Schedule.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { faClock, faClosedCaptioning, faEarthAsia, faTag, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm import này

const cx = classNames.bind(styles);

function Schedule() {
    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState('');
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCinema, setSelectedCinema] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resMovies = await axios.get('http://localhost:8080/v1/getMovies');
                setMovies(resMovies.data);

                const resShowtimes = await Promise.all(
                    resMovies.data.map((movie) =>
                        axios.get(`http://localhost:8080/v1/getShowtimeByMovieID/${movie._id}`)
                    )
                );

                const formattedShowtimes = resShowtimes.flatMap((response) =>
                    response.data.map((showtime) => ({
                        cinemaId: showtime.cinema_id._id,
                        cinemaName: showtime.cinema_id.name,
                        cinemaAddress: showtime.cinema_id.address,
                        showtimeStart: showtime.showtime_start,
                        movieId: showtime.movie_id._id,
                        showtimeId: showtime._id,
                    }))
                );
                setShowtimes(formattedShowtimes);

                const resCinemas = await axios.get('http://localhost:8080/v1/getCinemas');
                setCinemas(resCinemas.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const generateDates = () => {
            const today = new Date();
            const days = Array.from({ length: 3 }, (_, i) => {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                return {
                    value: date.toISOString().split('T')[0],
                    label: date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                };
            });
            setDates(days);
        };

        generateDates();
    }, []);

    const handleMovieSelect = (event) => {
        setSelectedMovieId(event.target.value);
    };

    const handleDateSelect = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleCinemaSelect = (event) => {
        setSelectedCinema(event.target.value);
    };

    const filteredShowtimes = showtimes.filter(
        (showtime) =>
            (!selectedMovieId || showtime.movieId === selectedMovieId) && // Lọc theo ID phim
            (!selectedDate || showtime.showtimeStart.startsWith(selectedDate)) && // Lọc theo ngày
            (!selectedCinema || showtime.cinemaId === selectedCinema) // Lọc theo rạp
    );
    

    const filteredMoviesByDate = filteredShowtimes
        .map((showtime) => showtime.movieId)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((movieId) => movies.find((movie) => movie._id === movieId))
        .filter((movie) => movie);

    
    return (  
        <div className={cx('container')}>
            <div className={cx('search', 'pt-4')}>
                <div className="row">
                    <div className="col-lg-1"></div>
                    <div className={cx('wrap', 'd-flex justify-content-between', 'col-lg-10', 'pb-5')}>
                        <div className={cx('date')}>
                            <h2>NGÀY</h2>
                            <select
                                className={cx('select1')}
                                aria-label="Select date"
                                value={selectedDate}
                                onChange={handleDateSelect}
                            >
                                <option value="">Chọn ngày</option>
                                {dates.map((date, index) => (
                                    <option key={index} value={date.value}>
                                        {date.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('movie')}>
                            <h2>PHIM</h2>
                            <select
                                className={cx('select2')}
                                aria-label="Select movie"
                                onChange={handleMovieSelect}
                            >
                                <option value="">Chọn phim</option>
                                {movies.map((movie) => (
                                    <option key={movie._id} value={movie._id}>
                                        {movie.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={cx('cinema')}>
                            <h2>RẠP</h2>
                            <select
                                className={cx('select3')}
                                aria-label="Select cinema"
                                value={selectedCinema}
                                onChange={handleCinemaSelect}
                            >
                                <option value="">Chọn rạp</option>
                                {cinemas.map((cinema) => (
                                    <option key={cinema._id} value={cinema._id}>
                                        {cinema.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-1"></div>
                </div>
            </div>

            {/* Add movie */}
            <div className={cx('content')}>
    <div className="row">
        <div className="col-1"></div>
        <div className={cx('wrap-content', 'col-10')}>
            <div className="row">
                {filteredMoviesByDate.length > 0 ? (
                    filteredMoviesByDate.map((movie, index) => (
                        <div key={index} className="col-12 mb-5">
                            <div className={cx('row', 'content-shadow', 'rowerr')}>
                                <div className={cx('movie-detail', 'col-4')}>
                                    <div className={cx('img-contain')}>
                                        <img
                                            src={movie.poster2}
                                            className={cx('img-she')}
                                            alt={movie.name}
                                        />
                                    </div>
                                    <div className={cx('wrap-info', 'ms-5', 'mt-4')}>
                                        <h1 className={cx('title')}>Tên phim: {movie.title}</h1>
                                        {/* Movie information */}
                                        <div className="info-group d-flex">
                                            <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faTag} />
                                            <div className={cx('type')}>Thể loại: {movie.genre}</div>
                                        </div>
                                        <div className="info-group d-flex">
                                            <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faClock} />
                                            <div className={cx('duration')}>Thời gian: {movie.duration} phút</div>
                                        </div>
                                        <div className="info-group d-flex">
                                            <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faEarthAsia} />
                                            <div className={cx('country')}>Quốc gia: {movie.country}</div>
                                        </div>
                                        <div className="info-group d-flex">
                                            <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faClosedCaptioning} />
                                            <div className={cx('sub')}>Phụ đề: {movie.subtitles}</div>
                                        </div>
                                        <div className="info-group d-flex">
                                            <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faUserCheck} />
                                            <div className={cx('limit')}>Nhãn phim: {movie.limit} +</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('time', 'col-8',  'mt-5')}>
                                        {Object.entries(
                                            showtimes
                                                // Lọc lịch chiếu từ ngày hôm nay trở về sau
                                                .filter((st) => {
                                                    const showtimeDate = new Date(st.showtimeStart);
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0); // Đặt giờ của ngày hôm nay về 0:00:00
                                                    return showtimeDate >= today; // Chỉ lấy lịch từ hôm nay trở về sau
                                                })
                                                // Lọc theo movieId và selectedDate
                                                .filter((st) => st.movieId === movie._id && st.showtimeStart.startsWith(selectedDate))
                                                // Gom nhóm lịch chiếu theo tên rạp
                                                .reduce((acc, showtime) => {
                                                    const key = showtime.cinemaName;
                                                    if (!acc[key]) {
                                                        acc[key] = { 
                                                            cinemaAddress: showtime.cinemaAddress,
                                                            showtimeStarts: [] 
                                                        };
                                                    }

                                                    // Convert showtime to Vietnam time
                                                    const showtimeUTC = new Date(showtime.showtimeStart);
                                                    const formattedShowtime = showtimeUTC.toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false,
                                                    });

                                                    acc[key].showtimeStarts.push({
                                                        time: formattedShowtime,
                                                        showtimeId: showtime.showtimeId, // Lưu showtimeId để điều hướng
                                                    });
                                                    return acc;
                                                }, {})
                                        ).map(([cinemaName, { cinemaAddress, showtimeStarts }], idx) => (
                                            <div key={idx} className={cx('wrap-line', 'mb-3')}>
                                                <div className="row">
                                                    <div className={cx('about', 'col-4')}>
                                                        <h1 className={cx('cinema-name')}>TÊN RẠP: {cinemaName}</h1>
                                                        <div className={cx('address')}>Địa chỉ: {cinemaAddress}</div>
                                                    </div>
                                                    <div className={cx('schedule', 'col-8')}>
                                                        <div className={cx('group')}>
                                                            {showtimeStarts.map(({ time, showtimeId }, i) => (
                                                                <button 
                                                                    key={i} 
                                                                    className={cx('btn-schedule')}
                                                                    onClick={() => navigate(`/bookTicket/${movie._id}`, { state: { showtimeId } })}
                                                                >
                                                                    {time}
                                                                </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={cx('no-schedule')}>
                        <h2>Hiện tại không có lịch chiếu</h2>
                    </div>
                )}
            </div>
        </div>
        <div className="col-1"></div>
    </div>
</div>

        </div>
    );
}

export default Schedule;
