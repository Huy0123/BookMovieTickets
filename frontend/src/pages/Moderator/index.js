import 'bootstrap/dist/css/bootstrap.min.css';

import React, {useState, useEffect} from 'react';
import Sidebar from './Components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom'; // Thay đổi tại đây
import ShowtimeList from './Components/ShowtimeList';
import RoomList from './Components/RoomList';
import SeatList from './Components/SeatList';
import Charts from './Components/Charts';
import classNames from 'classnames/bind';
import styles from './Moderator.module.scss';
import axios from 'axios';
const cx = classNames.bind(styles);
const Index = () => {
  const [cinema_id, setCinema_id] = useState('');
  const fetchCinemas = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v1/getCinemaIdByUserId/6729e5f07886f0f1c05ebdc3`);
      setCinema_id(response.data.Cinema[0]._id);
    } catch (error) {}
  };
  
  useEffect(() => {
    fetchCinemas();
  }, []);
  return (
    <div className={cx('d-flex','wrap')}>
      <Sidebar />
      <div className={cx('container','flex-grow-1 p-4 bg-body overflow-auto')}>
        <Routes >
          <Route path="/" element={<Navigate to="charts" />} />
          <Route path="charts" element={<Charts cinema_id ={cinema_id} />} />
          <Route path="showtime-list" element={<ShowtimeList cinema_id={cinema_id} />} />
          <Route path="room-list" element={<RoomList cinemaId={cinema_id} />} />
          <Route path="seat-list" element={<SeatList cinema_id={cinema_id} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Index;
