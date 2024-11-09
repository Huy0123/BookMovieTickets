import React, { useState, useEffect, useCallback } from "react";

import axios from "axios";
import classNames from 'classnames/bind';
import styles from './style.module.scss';
const cx = classNames.bind(styles);

const ShowtimeList = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [showtime, setShowtime] = useState({
        movie_id: "",
        room_id: "",
        showtime_start: "",
        showtime_end: "",
    });
    const [cinema_id, setCinema_id] = useState('66fbf96791e08c377610139b');
    // const [updateShowtime, setUpdateShowtime] = useState({
    //     movie_id: "",
    //     room_id: "",
    //     showtime_start


// Hàm lấy id của rạp chiếu phim
// const fetchCinemas = async () => {
//     try {
//     } catch (error) {}
// };

// // Hàm lấy danh sách showtime từ API
const fetchShowtimes = useCallback(async () => {

    try {
        const response = await axios.get(`http://localhost:8080/v1/getShowtimeByCinemaID/${cinema_id}`);
        setShowtimes(response.data);
        
    } catch (error) {
        console.log("Error fetching showtimes:", error);
    }
}, [cinema_id]);

const fetchMovies = useCallback(async () => {
    try {
        const response = await axios.get(`http://localhost:8080/v1/getMovies`);

        const movieData = response.data.reduce((acc, res) => ({ ...acc, [res._id]: res.title }), {});
        setAllMovies(movieData);
    } catch (error) {
        console.log("Error fetching movies:", error);
    }
}, []);

useEffect(() => {
    fetchMovies();
    fetchShowtimes();
},[fetchMovies, fetchShowtimes]);


const RoomsAvailable = useCallback(async () => {
    try {
        const response = await axios.get(`http://localhost:8080/v1/getRoomAvailability`,
            {
                params: {
                    cinema_id: cinema_id,
                    showtime_start: showtime.showtime_start,
                    showtime_end: showtime.showtime_end
                }
            }
        );
        const roomData = response.data.reduce((acc, res) => ({ ...acc, [res._id]: res.name }), {});
        setRoomsAvailable(roomData);
    } catch (error) {
        console.log("Error fetching rooms availability:", error);
    }
}, [showtime.showtime_start, showtime.showtime_end, cinema_id]);

useEffect(() => {
    if(!showtime.showtime_start || !showtime.showtime_end) {
        return;
    }
    RoomsAvailable();
}, [RoomsAvailable, showtime.showtime_start, showtime.showtime_end]);

// Hàm cập nhật showtime
// const handleUpdateShowtime = async (id) => {
//     try {
//         const response = await axios.put(`http://localhost:8080/v1/getShowtimeByID/${id}`);

// Hàm để xóa showtime
const handleDeleteShowtime = async (id) => {
    try {
        await axios.delete(`http://localhost:8080/v1/deleteShowtime/${id}`);
        fetchShowtimes();
    } catch (error) {
        console.log("Error deleting showtime:", error);
    }
};

const resetForm = () => {
    setRoomsAvailable([]);
    setShowtime({
        movie_id: "",
        room_id: "",
        showtime_start: "",
        showtime_end: ""
    });
};
console.log("showtime", showtime);
console.log("cinema_id", cinema_id);
const handleInputChange = (e) => {
    setShowtime({ ...showtime, [e.target.name]: e.target.value });
}

const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form

    try {
        const response = await axios.post('http://localhost:8080/v1/createShowtime', {
            ...showtime,
            cinema_id: cinema_id
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status === 201) {
            resetForm();
            fetchShowtimes();
        } else {
            console.log('Unexpected response status:', response.status);
        }
    } catch (error) {
        console.error('Error creating showtime:', error);
    }
};
return (
    <>
    {/* Modal cập nhật showtime*/}
    {/* <div className="modal-container">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Sửa xuất chiếu</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="showtime_start" className="form-label">Thời gian bắt đầu</label>
                        <input type="datetime-local" className="form-control" id="showtime_start" value={timeStart} onChange={handleStartTimeChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="showtime_end" className="form-label">Thời gian kết thúc</label>
                        <input type="datetime-local" className="form-control" id="showtime_end" value={timeEnd} onChange={handleEndTimeChange} />
                    </div>
                    <select className="form-select form-select-lg mb-3" aria-label="Choose a room" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                        <option value="" disabled>Chọn phòng</option>
                        {Object.entries(roomsAvailable).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                    <button type="submit" className="btn btn-primary">Tạo lịch chiếu</button>
                </form>
            </div>
        </div>
    </div> */}
        <div  className={cx('collapse-title')} >
            <a data-bs-toggle="collapse" href="#add-showtime" role="button" aria-expanded="false">Tạo lịch chiếu</a>
        </div>
        <div className={cx('collapse')} id="add-showtime">
        <div className={cx('collapse-container')}>
            <div className="card card-body shadow-sm p-3 mb-5 bg-body-tertiary rounded">
            <h2>Tạo Lịch Chiếu</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="movie" className="form-label">Chọn phim</label>
                <select
                    className={cx('form-select',' form-select-lg mb-3')} aria-label="Choose a movie" name="movie_id" value={showtime.movie_id} onChange={handleInputChange}>
                        
                    <option value="" disabled>Chọn phim</option>
                    {Object.entries(allMovies).map(([id, title]) => (
                        <option key={id} value={id}>{title}</option>
                    ))}
                </select>
           
                <div className="mb-3">
                    <label htmlFor="showtime_start" className={cx('form-label')}>Thời gian bắt đầu</label>
                    <input type="datetime-local" className={cx('form-control')} id="showtime_start" name="showtime_start" value={showtime.showtime_start} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="showtime_end" className={cx('form-label')}>Thời gian kết thúc</label>
                    <input type="datetime-local" className={cx('form-control')}id="showtime_end" name="showtime_end" value={showtime.showtime_end} onChange={handleInputChange} />
                </div>
                <label htmlFor="room" className="form-label">Chọn phòng</label>
                <select className={cx('form-select',' form-select-lg mb-3')}  aria-label="Choose a room" name="room_id" value={showtime.room_id} onChange={handleInputChange}>
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
</div></div>
        <div className={cx('table-container')}>
            <table className="table table-hover">
                <thead>
                    <tr className="text-center">
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
                            <td>{showtime.movie_id.title|| "Loading..."}</td>
                            <td>{showtime.cinema_id.name|| "Loading..."}</td>
                            <td>{showtime.room_id.name || "Loading..."}</td>
                            <td>{new Date(showtime.showtime_start).toLocaleString()}</td>
                            <td>{new Date(showtime.showtime_end).toLocaleString()}</td>
                            <td>
                                <button className="btn btn-primary me-3">Edit</button>
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
