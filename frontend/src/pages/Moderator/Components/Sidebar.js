import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './style.module.scss';
import axios from "axios";
const cx = classNames.bind(styles);
const Sidebar = () => {
  const [points, setPoints] = useState(''); // Initial points
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
  const handleLogout= async(event) =>{
    

    
    event.preventDefault();
    try {
        await axios.post(
        'http://localhost:8080/v1/Users/logout',
            {},  // Đảm bảo body không trống
            { withCredentials: true } // Đảm bảo gửi cookie cùng request
        );
        setIsLoggedIn(false);
        
            navigate('/'); 
        localStorage.clear();
    } catch (error) {
        console.error('Error during logout:', error);
    }
   }
  return (
    <div className="d-flex flex-column bg-dark" style={{ width: '250px', height: '620px' }}>
      <Link to="/moderator" className="nav-link text-white">
        <h2 className="text-white p-3">Moderator Dashboard</h2>
      </Link>
      <nav className="nav flex-column">
        <Link to="/moderator/showtime-list" className="nav-link text-white">
          <div className="me-2" /> Quản lý suất chiếu
        </Link>
        <Link to="/moderator/room-list" className="nav-link text-white">
          <div className="me-2" /> Quản lý phòng chiếu
        </Link>
        <Link to="/moderator/seat-list" className="nav-link text-white">
          <div className="me-2" /> Quản lý ghế ngồi
        </Link>
      </nav>
      <button type='button' className={cx('logout')} onClick={handleLogout}>Đăng xuất</button>

    </div>
    
  )
};

export default Sidebar;