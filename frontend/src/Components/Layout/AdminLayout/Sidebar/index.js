import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebarad.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faFilm} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const cx = classNames.bind(styles);
function Sidebar(){
    const [points, setPoints] = useState(''); // Initial points
  
    const navigate = useNavigate();
  
   
    
    return (  
  <div className={cx('navbar')}>
     <h1>Admin Dashboard</h1>
     <div className={cx('bar')}>
            <div className={cx('nav')} onClick={() => navigate('/admin/memberList')}> <FontAwesomeIcon className="fs-3 me-2" icon={faUser} /><h3>Danh sách thành viên</h3> </div>
            <div className={cx('nav')} onClick={() => navigate('/admin/cinemaList')}> <FontAwesomeIcon className="fs-3 me-2" icon={faFilm} /><h3>Danh sách Rạp</h3></div>
                <div className={cx('nav')} onClick={() => navigate('/admin/movieList')}> <FontAwesomeIcon className="fs-3 me-2" icon={faUser} /> <h3>Danh sách phim</h3></div>
     </div>
     <button className={cx('logout')}>Đăng xuất</button>
  </div>

)

}
export default Sidebar;