import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import classNames from 'classnames/bind';
import styles from './style.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

const ShowtimeList = ({ cinema_id }) => {
    const [showtimes, setShowtimes] = useState([]);
    const [roomsAvailable, setRoomsAvailable] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [showtime, setShowtime] = useState({
        movie_id: "",
        room_id: "",
        showtime_start: "",
        showtime_end: "",
    });
    const [showtimeUpdate, setShowtimeUpdate] = useState({
        _id: "",
        movie_id: "",
        room_id: "",
        showtime_start: "",
        showtime_end: "",
    });
    const openModal = (id) => {
        handleUpdateShowtime(id);

    }


    // Hàm lấy danh sách showtime từ API
    const fetchShowtimes = useCallback(async () => {
        if (!cinema_id) {
            return;
        }
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
    }, [fetchMovies, fetchShowtimes]);


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
        if (!showtime.showtime_start || !showtime.showtime_end) {
            return;
        }
        RoomsAvailable();
    }, [RoomsAvailable, showtime.showtime_start, showtime.showtime_end]);

    // Hàm cập nhật showtime
    const handleUpdateShowtime = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/getShowtimeByID/${id}`);
            if (response.status === 200) {
                setShowtimeUpdate(prevFormData => ({
                    ...prevFormData,
                    ...response.data,
                    showtime_start: new Date(response.data.showtime_start).toISOString().slice(0, 16),
                    showtime_end: new Date(response.data.showtime_end).toISOString().slice(0, 16),
                }));
            }
        } catch (error) {
            console.log("Error updating showtime:", error);
        }
    };

    // Hàm để xóa showtime
    const handleDeleteShowtime = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/v1/deleteShowtime/${id}`);
            fetchShowtimes();
        } catch (error) {
            if (error.response.data === 'Showtime is not over yet') {
                toast.error('Không thể xóa lịch chiếu khi chưa kết thúc');
            }
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



    const handleInputChange = (e) => {
        setShowtime({ ...showtime, [e.target.name]: e.target.value });
    }

    const handleUpdateInputChange = (e) => {
        setShowtimeUpdate({ ...showtimeUpdate, [e.target.name]: e.target.value });
    }

    const handleSaveUpdatedShowtime = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/v1/updateShowtime/${id}`, showtimeUpdate);
            if (response.status === 200) {
                toast.success('Cập nhật lịch chiếu thành công');
                fetchShowtimes();
            }
        } catch (error) {
            console.log("Error updating showtime:", error);
        }
    };

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
                toast.success('Tạo lịch chiếu thành công');
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
            <ToastContainer position="top-right" autoClose={3000} />
            <div className={cx('collapse-title')} >
                <a data-bs-toggle="collapse" href="#add-showtime" role="button" aria-expanded="false">Tạo lịch chiếu</a>
            </div>
            <div className={cx('collapse')} id="add-showtime">
                <div className={cx('collapse-container')}>
                    <div className="card card-body shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                        <h2>Tạo Lịch Chiếu</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="movie" className="form-label">Chọn phim</label>
                            <select
                                className={cx('form-select', ' form-select-lg mb-3')} aria-label="Choose a movie" name="movie_id" value={showtime.movie_id} onChange={handleInputChange}>

                                <option value="" disabled>Chọn phim</option>
                                {Object.entries(allMovies).map(([id, title]) => (
                                    <option key={id} value={id}>{title}</option>
                                ))}
                            </select>

                            <div className="mb-3">
                                <label htmlFor="showtime_start" className={cx('form-label')}>Thời gian bắt đầu</label>
                                <input type="datetime-local" min={new Date().toISOString().slice(0, 16)} className={cx('form-control')} id="showtime_start" name="showtime_start" value={showtime.showtime_start} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="showtime_end" className={cx('form-label')}>Thời gian kết thúc</label>
                                <input type="datetime-local" className={cx('form-control')} min={new Date().toISOString().slice(0, 16)} id="showtime_end" name="showtime_end" value={showtime.showtime_end} onChange={handleInputChange} />
                            </div>
                            <label htmlFor="room" className="form-label">Chọn phòng</label>
                            <select className={cx('form-select', ' form-select-lg mb-3')} aria-label="Choose a room" name="room_id" value={showtime.room_id} onChange={handleInputChange}>
                                <option value="" disabled>Chọn phòng</option>
                                {Object.entries(roomsAvailable).map(([id, name]) => (
                                    <option key={id} value={id}>{name}</option>
                                ))}
                            </select>
                            <div className={cx('btn-submit')}>
                                <button type="submit">Tạo lịch chiếu</button>

                            </div>

                        </form>
                    </div>
                </div>
            </div>
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
                                <td>{showtime.movie_id.title || "Loading..."}</td>
                                <td>{showtime.cinema_id.name || "Loading..."}</td>
                                <td>{showtime.room_id.name || "Loading..."}</td>
                                <td>{new Date(showtime.showtime_start).toLocaleString()}</td>
                                <td>{new Date(showtime.showtime_end).toLocaleString()}</td>
                                <td>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#edit-showtime" onClick={() => openModal(showtime._id)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteShowtime(showtime._id)}>Delete</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="modal" id="edit-showtime">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Showtime</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label htmlFor="movie" className="form-label">Chọn phim</label>
                                <select
                                    className={cx('form-select', ' form-select-lg mb-3')} aria-label="Choose a movie" name="movie_id" value={showtimeUpdate.movie_id} onChange={handleUpdateInputChange}>

                                    <option value="" disabled>Chọn phim</option>
                                    <option value={showtimeUpdate.movie_id._id}>{showtimeUpdate.movie_id.title}</option>
                                    {Object.entries(allMovies)
                                        .filter(([id]) => id !== showtimeUpdate.movie_id._id) // Loại bỏ phim hiện tại
                                        .map(([id, title]) => (
                                            <option key={id} value={id}>
                                                {title}
                                            </option>
                                        ))}
                                </select>

                                <div className="mb-3">
                                    <label htmlFor="showtime_start" className={cx('form-label')}>Thời gian bắt đầu</label>
                                    <input type="datetime-local" className={cx('form-control')} id="showtime_start" name="showtime_start" value={showtimeUpdate.showtime_start} onChange={handleUpdateInputChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="showtime_end" className={cx('form-label')}>Thời gian kết thúc</label>
                                    <input type="datetime-local" className={cx('form-control')} id="showtime_end" name="showtime_end" value={showtimeUpdate.showtime_end} onChange={handleUpdateInputChange} />
                                </div>
                                <label htmlFor="room" className="form-label">Chọn phòng</label>
                                <select className={cx('form-select', ' form-select-lg mb-3')} aria-label="Choose a room" name="room_id" value={showtimeUpdate.room_id} onChange={handleUpdateInputChange}>
                                    <option value="" disabled>Chọn phòng</option>
                                    {showtimeUpdate.room_id && <option value={showtimeUpdate.room_id._id}>{showtimeUpdate.room_id.name}</option>}
                                    {Object.entries(roomsAvailable).map(([id, name]) => (
                                        <option key={id} value={id}>{name}</option>
                                    ))}
                                </select>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={() => handleSaveUpdatedShowtime(showtimeUpdate._id)}>Save</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};



export default ShowtimeList;
