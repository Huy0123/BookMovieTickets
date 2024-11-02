import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RoomList = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [cinemas, setCinemas] = useState({});
    const [room, setRoom] = useState('');

    // Fetch rooms from API
    const fetchRooms = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/v1/getRoomByCinemaID/66fbf96791e08c377610139b");
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }, []);

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

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/v1/createRoom", { name: room, cinema_id: "66fbf96791e08c377610139b" });
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
            <div>
                <a data-bs-toggle="collapse" href="#add-room" role="button" aria-expanded="false">Tạo phòng mới</a>
            </div>
            <div className="collapse" id="add-room">
                <div className="card card-body">
                    <h2>Tạo phòng mới</h2>
                    <form onSubmit={handleRoomSubmit}>
                        <div className="mb-3">
                            <label htmlFor="room-name" className="form-label">Tên Phòng</label>
                            <input type="text" className="form-control" id="room-name" value={room} onChange={(e) => setRoom(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary">Tạo Phòng</button>
                    </form>
                </div>
            </div>

            <div>
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
                                    <button className="btn btn-primary me-2">Sửa</button>
                                    <button className="btn btn-danger" onClick={() => handleRoomDelete(room._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default RoomList;
