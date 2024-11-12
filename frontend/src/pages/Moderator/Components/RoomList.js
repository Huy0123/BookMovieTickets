import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import classNames from 'classnames/bind';
import styles from './style.module.scss';
const cx = classNames.bind(styles);
const RoomList = ({cinemaId}) => {
    
    const [rooms, setRooms] = useState([]);
    const [cinemas, setCinemas] = useState({});
    const [room, setRoom] = useState('');
    const [roomEdit, setRoomEdit] = useState({
        _id: "",
        name: "",
    });
    const fetchRooms = useCallback(async () => {
        if(!cinemaId) return;
        try {
            const response = await axios.get(`http://localhost:8080/v1/getRoomByCinemaID/${cinemaId}`);
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }, [cinemaId]);

    // Fetch cinemas information based on room data
    const fetchCinemasInfo = useCallback(async (rooms) => {
        try {
            const cinemaIds = [...new Set(rooms.map(room => room.cinema_id))];
            const cinemaPromises = cinemaIds.map(id => axios.get(`http://localhost:8080/v1/getCinemaByID/${id}`));
            const cinemaResponses = await Promise.all(cinemaPromises);
            const cinemaData = cinemaResponses.reduce((acc, res) => ({ ...acc, [res.data._id]: res.data.name }), {});
            setCinemas(cinemaData);
        } catch (error) {
            console.error("Error fetching cinemas info:", error);
        }
    }, []);

    const fetchRoom = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/getRoomByID/${id}`);
            if (response.status === 200) {
                setRoomEdit({name: response.data.name, _id: response.data._id});
            }
        } catch (error) {
            console.error("Error fetching room:", error);
        }
    }
    console.log(roomEdit);

    const handleRoomEdit = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/v1/updateRoom/${id}`, { name: roomEdit.name });
            if (response.status === 200) {
                alert('Cập nhật thành công');
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating room:", error);
        }
    }
    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        if (!room || !cinemaId) return;
        try {
            const response = await axios.post("http://localhost:8080/v1/createRoom", { name: room, cinema_id: cinemaId });
            if (response.status === 201) {
                fetchRooms();
            }
        } catch (error) {
            console.error("Error creating room:", error);
        }
    }

    const handleRoomDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/v1/deleteRoom/${id}`);
            fetchRooms();
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    }

    useEffect(() => {
        // First fetch rooms
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        // Then fetch cinemas info only if rooms data is populated
        if (rooms.length > 0) {
            fetchCinemasInfo(rooms);
        }
    }, [rooms, fetchCinemasInfo]);

    return (
        <>
            <div className={cx('collapse-title')}>
                <a data-bs-toggle="collapse" href="#add-room" role="button" aria-expanded="false">Tạo phòng mới</a>
            </div>
            <div className="collapse" id="add-room">
            <div className={cx('collapse-container')}>
                <div className="card card-body">
                    <h2>Tạo phòng mới</h2>
                    <form onSubmit={handleRoomSubmit}>
                        <div className="mb-3">
                            <label htmlFor="room-name" className="form-label">Tên Phòng</label>
                            <input type="text" className={cx('form-control')} id="room-name" value={room} onChange={(e) => setRoom(e.target.value)} />
                        </div>
                        <div  className={cx('btn-submit')}>
                    <button type="submit">Tạo lịch chiếu</button>
                </div>
                    </form>
                </div>
            </div>
            </div>
            <div  className={cx('table-container')} >
                <table className="table table-hover">
                    <thead>
                        <tr className="text-center">
                            <th>STT</th>
                            <th>Tên Phòng</th>
                            <th>Rạp</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room._id} className="text-center">
                                <td>{index + 1}</td>
                                <td>{room.name}</td>
                                <td>{cinemas[room.cinema_id]}</td>
                                <td>
                                    <button className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#eidt-room" onClick={()=> fetchRoom(room._id)}>Sửa</button>
                                    <button className="btn btn-danger" onClick={() => handleRoomDelete(room._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="modal fade" id="eidt-room" tabIndex="-1" aria-labelledby="edit-room" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sửa phòng chiếu</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="room-name" className="form-label">Tên Phòng</label>
                                    <input type="text" className={cx('form-control')} id="room-name" value={roomEdit.name} onChange={(e) => setRoomEdit({...roomEdit, name:e.target.value})} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleRoomEdit(roomEdit._id)}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RoomList;
