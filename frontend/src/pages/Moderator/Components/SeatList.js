import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import images from "~/assets/img";
import styles from "~/pages/BookTicket/BookTicket.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SeatList = () => {
    const navigate = useNavigate();
    const [seats, setSeats] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [seatDetails, setSeatDetails] = useState(null);
    const [seatNumber, setSeatNumber] = useState('');
    const [seatType, setSeatType] = useState('');
    const [amount, setAmount] = useState('');

    // Fetch rooms once when component mounts
    const fetchRooms = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/getRoomByCinemaID/66fbf96791e08c377610139b`);
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }, []);

    // Fetch seats only when selectedRoom changes
    const fetchSeats = useCallback(async () => {
        if (!selectedRoom) return;
        try {
            const response = await axios.get(`http://localhost:8080/v1/getSeatByRoomID/${selectedRoom}`);
            setSeats(response.data);
        } catch (error) {
            console.error("Error fetching seats:", error);
        }
    }, [selectedRoom]);

    const handleDeleteSeat = async (seatId) => {
        try {
            await axios.delete(`http://localhost:8080/v1/deleteSeat/${seatId}`);
            fetchSeats();
        } catch (error) {
            console.error("Error deleting seat:", error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/v1/createSeat", {
                seat_number: seatNumber,
                seat_type: seatType,
                price: amount,
                room_id: selectedRoom,
            });
            if (response.status === 201) {
                fetchSeats();
            }
        } catch (error) {
            console.error("Error creating seat:", error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    useEffect(() => {
        fetchSeats();
    }, [fetchSeats]);

    useEffect(() => {
        // Reset selected seat when selected room changes
        setSelectedSeat(null);
        setSeatDetails(null);
    }, [selectedRoom]);

    // Handle seat selection
    const handleSeatClick = async (seatNumber, seatId) => {
        if (selectedSeat === seatNumber) {
            // Nếu đã chọn ghế này, bỏ chọn
            setSelectedSeat(null);
            setSeatDetails(null);
        } else {
            // Chọn ghế mới
            setSelectedSeat(seatNumber);
            try {
                const response = await axios.get(`http://localhost:8080/v1/getSeatByID/${seatId}`);
                setSeatDetails(response.data);
            } catch (error) {
                console.error("Error fetching seat details:", error);
            }
        }
    };

    return (
        <>
            {/* Add seats form */}
            <div>
                <a data-bs-toggle="collapse" href="#add-room" role="button" aria-expanded="false">Thêm ghế mới</a>
            </div>
            <div className="collapse" id="add-room">
                <div className="card card-body">
                    <h2>Thêm ghế mới</h2>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="seat-number" className="form-label">Tên Ghế</label>
                            <input type="text" className="form-control" id="seat-number" value={seatNumber} onChange={(e)=> setSeatNumber(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="seat-type" className="form-label">Loại Ghế</label>
                            <input type="text" className="form-control" id="seat-type" value={seatType} onChange={(e) => setSeatType(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">Giá Ghế</label>
                            <input type="text" className="form-control" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-primary">Thêm ghế mới</button>
                    </form>
                </div>
            </div>

            <select
                className="form-select form-select-lg mb-3"
                aria-label="Choose a room"
                value={selectedRoom || ""}
                onChange={(e) => setSelectedRoom(e.target.value)}
            >
                <option value="" disabled>Chọn phòng</option>
                {rooms.map((room) => (
                    <option key={room._id} value={room._id}>{room.name}</option>
                ))}
            </select>

            <div>
                {selectedRoom && (
                    <div className={cx('seat')}>
                        <div className={cx('wrap-seat')}>
                            <div className={cx('all-seat')}>
                                <div className="row">
                                    <div className="col-2"></div>
                                    <div className="col-8">
                                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((rowName, rowIndex) => {
                                            const availableSeatsInRow = seats.filter(seat =>
                                                seat._id && seat.seat_number.startsWith(rowName)
                                            );

                                            return (
                                                <div key={rowIndex} className={cx('group-seat')}>
                                                    <div className={cx('seat-name', 'me-4')}>{rowName}</div>
                                                    <div className={cx('group-btn-seat')}>
                                                        {availableSeatsInRow.map(seatInfo => {
                                                            const seatNumber = seatInfo.seat_number;
                                                            const seatId = seatInfo._id;

                                                            return (
                                                                <button
                                                                    key={seatNumber}
                                                                    type="button"
                                                                    className={cx('num-seat', {
                                                                        'vip-seat': seatInfo.seat_type.toLowerCase() === 'vip',
                                                                        'selected-seat': selectedSeat === seatNumber,
                                                                    
                                                                    })}
                                                                    style={{
                                                                        backgroundColor: selectedSeat === seatNumber ? '#F9E400' : seatInfo.seat_status ? '#f5004f' : '',
                                                                        color: seatInfo.seat_status ? '#000' : '',
                                                                    }}
                                                                    onClick={() => {
                                                                        if (!seatInfo.seat_status) {
                                                                            handleSeatClick(seatNumber, seatId);
                                                                        }
                                                                    }}
                                                                    disabled={seatInfo.seat_status}
                                                                    aria-label={`Seat ${seatNumber} ${seatInfo.seat_status ? 'occupied' : 'available'}`}
                                                                >
                                                                    {seatNumber}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="col-2">
                                        {/* Selected seat information */}
                                        
                                        {
                                            seatDetails && (
                                                <>
                                                <h2>Thông tin ghế</h2>
                                                <div>
                                                    <p>Ghế: {seatDetails.seat_number}</p>
                                                    <p>Loại ghế: {seatDetails.seat_type}</p>
                                                    <p>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(seatDetails.price)}</p>
                                                </div>
                                                <div>
                                                    <button className="btn btn-primary me-2">Sửa</button>
                                                    <button className="btn btn-danger" onClick={() => handleDeleteSeat(seatDetails._id)}>Xóa</button>
                                                </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Seat type legend */}
                            <div className={cx('type-seat')}>
                                <div className="row">
                                    <div className="col-1"></div>
                                    <div className={cx('wrap-type', 'col-10')}>
                                        <div className={cx('status-seat')}>
                                            <div className={cx('btn-casual')} style={{ backgroundColor: '#d9d9d9' }}></div>
                                            <h3>Ghế thường</h3>
                                        </div>
                                        <div className={cx('status-seat')}>
                                            <div className={cx('btn-vip')} style={{ backgroundColor: '#FFAF00' }}></div>
                                            <h3>Ghế VIP</h3>
                                        </div>
                                    </div>
                                    <div className="col-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SeatList;
