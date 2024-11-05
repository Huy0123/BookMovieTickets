import 'bootstrap/dist/css/bootstrap.min.css';
import './Moderator.module.scss';
import React from 'react';
import Sidebar from './Components/Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom'; // Thay đổi tại đây
import ShowtimeList from './Components/ShowtimeList';
import RoomList from './Components/RoomList';
import SeatList from './Components/SeatList';
import Charts from './Components/Charts';

const Index = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4 bg-body">
        <Routes>
          <Route path="/" element={<Navigate to="charts" />} />
          <Route path="charts" element={<Charts />} />
          <Route path="showtime-list" element={<ShowtimeList />} />
          <Route path="room-list" element={<RoomList />} />
          <Route path="seat-list" element={<SeatList />} />
        </Routes>
      </div>
    </div>
  );
};

export default Index;
