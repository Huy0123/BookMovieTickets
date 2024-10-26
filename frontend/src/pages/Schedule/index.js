import classNames from 'classnames/bind';
import styles from './Schedule.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { faClock, faClosedCaptioning, faEarthAsia, faTag, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Schedule() {
    const [movies, setMovies] = useState([]);  // Danh sách tất cả phim
    const [showtimes, setShowtimes] = useState([]); // Lịch chiếu của từng phim
    const [cinemas, setCinemas] = useState([]); // Danh sách tất cả rạp
    useEffect(() => {
        const getShowtimeByMovieID = async () => {
            try {
                // Lấy danh sách phim
                const res = await axios.get('http://localhost:8080/v1/getMovies');
                const movieData = res.data;
                setMovies(movieData); // Lưu danh sách phim
                const movieIds = movieData.map(movie => movie._id);
                console.log(movieIds)
                // Gửi yêu cầu API cho từng ID phim
                const showtimesData = await Promise.all(
                    movieIds.map(id => axios.get(`http://localhost:8080/v1/getShowtimeByMovieID/${id}`))    
                );

                // Kết hợp và lấy ra các `showtime_start` và thông tin rạp từ dữ liệu trả về
                const formattedShowtimes = showtimesData.flatMap(response => 
                    response.data.map(showtime => ({
                        cinemaName: showtime.cinema_id.name,
                        cinemaAddress: showtime.cinema_id.address,
                        showtimeStart: showtime.showtime_start,
                        movieId: showtime.movie_id._id,
                    }))
                );  

                setShowtimes(formattedShowtimes); // Lưu lịch chiếu

                // Lấy danh sách rạp (có thể bỏ trùng nếu cần)
                const uniqueCinemas = Array.from(new Set(formattedShowtimes.map(st => st.cinemaName)))
                    .map(name => {
                        const cinema = formattedShowtimes.find(st => st.cinemaName === name);
                        return {
                            name,
                            address: cinema.cinemaAddress,
                        };
                    });
                setCinemas(uniqueCinemas); // Lưu danh sách rạp
            } catch (error) {
                console.error('Error fetching showtimes:', error);
            }
        };

        getShowtimeByMovieID();
    }, []);

    
    return (  
        <div className={cx('container')}>
            <div className={cx('search','pt-4')}>
                <div className='row'>
                    <div className='col-lg-1'></div>
                    <div className={cx('wrap','d-flex justify-content-between ', 'col-lg-10','pb-5')}>
                            <div className={cx('date')}>
                            <h2>NGÀY</h2>
                                <select className={cx('select1')} aria-label="Select date">
                                    <option value="">Select Date</option>
                                    <option value="1">Date 1</option>
                                    <option value="2">Date 2</option>
                                </select>
                            </div>

                            <div className={cx('movie')}>
                            <h2>PHIM</h2>
                                <select className={cx('select2')} aria-label="Select movie">
                                    <option value="">Select Movie</option>
                                    <option value="1">Movie 1</option>
                                    <option value="2">Movie 2</option>
                                </select>
                            </div>

                            <div className={cx('cinema')}>
                            <h2>RẠP</h2>
                                <select className={cx('select3')} aria-label="Select cinema">
                                    <option value="">Select Cinema</option>
                                    <option value="1">Cinema 1</option>
                                    <option value="2">Cinema 2</option>
                                </select>
                            </div>
                        </div>
                    <div className='col-lg-1'></div>
                    </div>
                    
            </div>          

            {/* Add movie */}
            <div className={cx('content', 'mt-5')}>
            <div className="row">
                <div className="col-1"></div>
                <div className={cx('wrap-content', 'col-10')}>
                    <div className="row">
                        {movies.map((movie, index) => (
                            <div key={index} className="col-12 mb-5">
                                <div className="row">
                                    <div className={cx('movie-detail', 'col-4')}>
                                        <img
                                            src={movie.image || images.banner4}
                                            className={cx('d-block')}
                                            alt={movie.name}
                                        />
                                        <div className={cx('wrap-info', 'ms-5', 'mt-4')}>
                                            <h1 className={cx('title')}>Tên phim: {movie.title}</h1>
                                            {/* Movie information */}
                                            <div className='info-group d-flex'>
                                                <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faTag} />
                                                <div className={cx('type')}>Thể loại: {movie.genre}</div>
                                            </div>
                                            <div className='info-group d-flex'>
                                                <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClock} />
                                                <div className={cx('duration')}>Thời gian: {movie.duration} phút</div>
                                            </div>
                                            <div className='info-group d-flex'>
                                                <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faEarthAsia} />
                                                <div className={cx('country')}>Quốc gia: {movie.country}</div>
                                            </div>
                                            <div className='info-group d-flex'>
                                                <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClosedCaptioning} />
                                                <div className={cx('sub')}>Phụ đề: {movie.subtitles}</div>
                                            </div>
                                            <div className='info-group d-flex'>
                                                <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faUserCheck} />
                                                <div className={cx('limit')}>Nhãn phim: {movie.limit} +</div>
                                             </div>
                                        </div>
                                    </div>
                                    <div className={cx('time', 'col-8', 'ps-5', 'pt-5', 'mt-5')}>
                                        {Object.entries(
                                            showtimes
                                                .filter(st => st.movieId === movie._id)
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
                                                    showtimeUTC.setHours(showtimeUTC.getHours() + 7); // Adjust to UTC+7
                                                    const formattedShowtime = showtimeUTC.toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false,
                                                    });

                                                    acc[key].showtimeStarts.push(formattedShowtime);
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
                                                            {showtimeStarts.map((time, i) => (
                                                                <button key={i} className={cx('btn-schedule')}>{time}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-1"></div>
            </div>
        </div>
            </div>
    );
}

export default Schedule;
