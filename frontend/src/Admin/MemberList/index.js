import React,{ useState }  from 'react';
import classNames from 'classnames/bind';
import styles from './MemberList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { text } from '@fortawesome/fontawesome-svg-core';

const cx = classNames.bind(styles);
function MemberList() {
    // const [cinemaName,setCinemaName] = useState('');
    return ( 
    <div className={cx('container')}>
 
        <h2>Danh sách thành viên</h2>   
        <div className={cx('table-con')}>
        <table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tài Khoản</th>
            <th>Email</th>
            <th>Mật Khẩu</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
       
            <tr >
              <td>02</td>
              <td>bo may bi gay</td>
              <td>gayvc@gmail.com</td>
              <td>123456789</td>
              <td>
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