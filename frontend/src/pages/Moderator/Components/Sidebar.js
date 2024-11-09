import { Link } from "react-router-dom";
import React from "react";
import classNames from 'classnames/bind';
import styles from './style.module.scss';
const cx = classNames.bind(styles);
const Sidebar = () => {
  
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
    </div>
  )
};

export default Sidebar;