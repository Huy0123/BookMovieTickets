import 'bootstrap/dist/css/bootstrap.min.css';
import './Moderator.module.scss';
import React from 'react';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Route, Routes } from 'react-router-dom';
import ShowtimeList from './Components/ShowtimeList';
import RoomList from './Components/RoomList';
import SeatList from './Components/SeatList';
import Charts from './Components/Charts';
import { Navigate } from 'react-router-dom';
const Index = () => {
  
  return (
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-body">
        
            <Routes>
            <Route path="/" element={<Navigate to="charts" />} />
            <Route path="charts" element={<Charts />} />
              <Route path= 'showtime-list' Component={ShowtimeList} />
              <Route path= 'room-list' Component={RoomList} />
              <Route path= 'seat-list' Component={SeatList} />
            </Routes>
        </div>
      </div>
  )
}

export default Index;