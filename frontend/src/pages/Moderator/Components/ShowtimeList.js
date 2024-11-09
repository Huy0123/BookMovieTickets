import React, { useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classNames from 'classnames/bind';
import styles from './style.module.scss';
const cx = classNames.bind(styles);

const ShowtimeList = () => {
    const navigate = useNavigate();
    
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState({});
    const [cinemas, setCinemas] = useState({});
    const [rooms, setRooms] = useState({});
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    
    // Hàm để điều hướng đến trang chỉnh sửa
    const editShowtime = (showtime) => {
        navigate(`/edit-showtime/${showtime.id}`, { state: showtime });
    };

    // Hàm lấy thông tin bổ sung (phim, phòng, rạp)
    const fetchAdditionalInfo = useCallback(async () => {
        try {
            const movieIds = [...new Set(showtimes.map(showtime => showtime.movie_id))];
            const cinemaIds = [...new Set(showtimes.map(showtime => showtime.cinema_id))];
            const roomIds = [...new Set(showtimes.map(showtime => showtime.room_id))];
    
            // Lấy tên phim
            const moviePromises = movieIds.map(id => axios.get(`http://localhost:8080/v1/getMovieByID/${id}`));
            const movieResponses = await Promise.all(moviePromises);
            const movieData = movieResponses.reduce((acc, res) => ({ ...acc, [res.data._id]: res.data.title }), {});
            setMovies(movieData);
    
            // Lấy tên rạp
            const cinemaPromises = cinemaIds.map(id => axios.get(`http://localhost:8080/v1/getCinemaByID/${id}`));
            const cinemaResponses = await Promise.all(cinemaPromises);
            const cinemaData = cinemaResponses.reduce((acc, res) => ({ ...acc, [res.data._id]: res.data.name }), {});
            setCinemas(cinemaData);
    
            // Lấy tên phòng
            const roomPromises = roomIds.map(id => axios.get(`http://localhost:8080/v1/getRoomByID/${id}`));
            const roomResponses = await Promise.all(roomPromises);
            const roomData = roomResponses.reduce((acc, res) => ({ ...acc, [res.data._id]: res.data.name }), {});
            setRooms(roomData);
    
        } catch (error) {
            console.log("Error fetching additional info:", error);
        }
    }, [showtimes]);
    

    // Hàm lấy danh sách showtime từ API
    const fetchShowtimes = async () => {
        
        try {
            const response = await axios.get(`http://localhost:8080/v1/getShowtimeByCinemaID/66fbf96791e08c377610139b`);
            setShowtimes(response.data);
            await fetchAdditionalInfo(response.data);
        } catch (error) {
            console.log("Error fetching showtimes:", error);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/getMovies`);

            const movieData = response.data.reduce((acc, res) => ({ ...acc, [res._id]: res.title }), {});
            setAllMovies(movieData);
        } catch (error) {
            console.log("Error fetching movies:", error);
        }
    };

    // Gọi fetchShowtimes khi component mount
    useEffect(() => {
        fetchMovies();
        fetchShowtimes();
    }, []);

    
    useEffect(() => {
        fetchAdditionalInfo();
    }, [showtimes, fetchAdditionalInfo]);
    

    const RoomsAvailable = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/getRoomAvailability`,
                {
                    params: {
                        cinema_id: "66fbf96791e08c377610139b",
                        showtime_start: timeStart,
                        showtime_end: timeEnd
                    }
                }
            );
            const roomData = response.data.reduce((acc, res) => ({ ...acc, [res._id]: res.name }), {});
            setRoomsAvailable(roomData);
        } catch (error) {
            console.log("Error fetching rooms availability:", error);
        }
    }, [timeStart, timeEnd]);

    useEffect(() => {
        if (timeStart && timeEnd) {
            RoomsAvailable();
        }
    }, [timeStart, timeEnd, RoomsAvailable]);

    // Hàm để xóa showtime
    const handleDeleteShowtime = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/v1/deleteShowtime/${id}`);
                fetchShowtimes();
        } catch (error) {
            console.log("Error deleting showtime:", error);
        }
    };
    const handleStartTimeChange = (e) => {
        setTimeStart(e.target.value);
    }
    const handleEndTimeChange = (e) => {
        setTimeEnd(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form

        try {
            const response = await axios.post('http://localhost:8080/v1/createShowtime', {
                movie_id: selectedMovie,
                showtime_start: timeStart,
                cinema_id: "66fbf96791e08c377610139b",
                showtime_end: timeEnd,
                room_id: selectedRoom,
            });
            if (response.status === 201) {
                setTimeStart('');
                setTimeEnd('');
                setSelectedMovie('');
                setSelectedRoom('');
                setRoomsAvailable([]);
                fetchShowtimes();
                
            }
        } catch (error) {
            console.log('Error creating showtime:', error);
        }
    };
    return (
        <>
            <div className={cx('collapse-title')}>
            <a data-bs-toggle="collapse" href="#add-showtime" role="button" aria-expanded="false">Tạo lịch chiếu</a>
            </div>
            <div className={cx('collapse')} id="add-showtime">
            <div className={cx('collapse-container')}>
            <div className="card card-body shadow-sm p-3 mb-5 bg-body-tertiary rounded">
            <h2>Tạo Lịch Chiếu</h2>
            <form onSubmit={handleSubmit} >
                <select
                    className={cx('form-select',' form-select-lg mb-3')} aria-label="Choose a movie" value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
                    <option value="" disabled>Chọn phim</option>
                    {Object.entries(allMovies).map(([id, title]) => (
                        <option key={id} value={id}>{title}</option>
                    ))}
                </select>
           
                <div className="mb-3">
                    <label htmlFor="showtime_start" className={cx('form-label')}>Thời gian bắt đầu</label>
                    <input type="datetime-local" className={cx('form-control')} id="showtime_start" value={timeStart} onChange={handleStartTimeChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="showtime_end" className={cx('form-label')}>Thời gian kết thúc</label>
                    <input type="datetime-local" className={cx('form-control')} id="showtime_end" value={timeEnd} onChange={handleEndTimeChange} />
                </div>
                <select className={cx('form-select',' form-select-lg mb-3')} aria-label="Choose a room" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                    <option value="" disabled>Chọn phòng</option>
                    {Object.entries(roomsAvailable).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
                <div  className={cx('btn-submit')}>
                    <button type="submit">Tạo lịch chiếu</button>
                </div>
                
            </form>
            </div>
            </div>
            </div>

            <div className={cx('table-container')}> 
                <table className={cx('table',' table-hover')}>
                    <thead>
                        <tr className="text-center posision-ficed">
                            <th>Movie</th>
                            <th>Cinema</th>
                            <th>Room</th>
                            <th>Time Start</th>
                            <th>Time End</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showtimes.map((showtime) => (
                            <tr key={showtime._id}>
                                <td>{movies[showtime.movie_id] || "Loading..."}</td>
                                <td>{cinemas[showtime.cinema_id] || "Loading..."}</td>
                                <td>{rooms[showtime.room_id] || "Loading..."}</td>
                                <td>{new Date(showtime.showtime_start).toLocaleString()}</td>
                                <td>{new Date(showtime.showtime_end).toLocaleString()}</td>
                                <td>
                                    <button className="btn btn-primary me-3" onClick={() => editShowtime(showtime)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteShowtime(showtime._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ShowtimeList;
