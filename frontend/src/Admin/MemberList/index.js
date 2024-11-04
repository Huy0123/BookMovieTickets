import React,{useState}   from 'react';
import classNames from 'classnames/bind';
import styles from './MemberList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faFilter, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';


const cx = classNames.bind(styles);
function MemberList() {
    // const [cinemaName,setCinemaName] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
    return ( 
    <div className={cx('container')}>
 
        <h2>Danh sách thành viên</h2>   
        <div className={cx('table-con')}>
        <div className={cx('finding')}>
        <div className={cx('search')}>
          <FontAwesomeIcon  className="fs-3 me-2" icon={faSearch} />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
        </div>
       <div className={cx('filter')} ><FontAwesomeIcon className="fs-3 " icon={faFilter} /> 
       <select id="options" value={selectedOption} >
        <option value="">--Chọn mục--</option>
        <option value="option1">Email</option>
        <option value="option2">Số điện thoại</option>
        <option value="option3">role</option>
        <option value="option4">Tài Khoản</option>
      </select>
       </div>
       </div>
        <table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tài Khoản</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Mật Khẩu</th>
            <th>role</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
       
            <tr >
              <td>02</td>
              <td>bo may bi gay</td>
              <td>gayvc@gmail.com</td>
              <td>123456789</td>
              <td>123456789</td>
              <td>user</td>
              <td> 
                <button>Chỉnh sửa</button>
                <button>xóa</button>
              </td>
            </tr>
          
        
        </tbody>
      </table>
      </div>
    </div>
);
}

export default MemberList;