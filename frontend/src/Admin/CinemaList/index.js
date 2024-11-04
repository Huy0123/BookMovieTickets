import React,{ useState }  from 'react';
import classNames from 'classnames/bind';
import styles from './CinemaList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';


const cx = classNames.bind(styles);
function CinemaList() {
    const [addCinema,setAddCinema] = useState(false);
   


    const handleAddCinem =() =>{
        setAddCinema(true)
    }
    const handleCloseModal =() =>{
        setAddCinema(false)
    }
    return ( 
    <div className={cx('container')}>
        <div className={cx('top')}>
            <button onClick={handleAddCinem}>
            <FontAwesomeIcon className="fs-3 me-2" icon={faPlus} />Thêm rạp </button>
        </div>
        <h2>Danh sách Rạp</h2>   
        <div className={cx('table-con')} >
        <table striped bordered hover>
        <thead>
          <tr>
          <th>ID</th>
            <th>Tên Rạp</th>
            <th>Vị Trí</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
       
            <tr >
              <td>02</td>
              <td>bo may bi gay</td>
              <td>gayvc@gmail.com</td>
             
              <td>
              <button>chỉnh sửa</button>
                <button>xóa</button>
              </td>
            </tr>
          
        
        </tbody>
      </table>
      </div>
      {addCinema &&(
        <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
            <div className={cx('content')}>
                      <h4 className={cx('title')}>Tên rạp</h4>
                      <input 
                        type="text" 
                        name="cinemaname" 
                        // value={newpass}
                        // onChange={(event) => setNewpass(event.target.value)}
                        className={cx('cinema-name','form-info')}     
                      />
                      </div> 
                      <div className={cx('content')}>
                      <h4 className={cx('title')}>Địa chỉ</h4>
                      <input 
                        type="text" 
                        name="address" 
                        // value={newpass}
                        // onChange={(event) => setNewpass(event.target.value)}
                        className={cx('address','form-info')}     
                      />
                    
                      </div> 
                      <div className={cx('btn-con')}>
                      <button type='button' className={cx('btn-confirm')} >
                           Xác nhận
                        </button>
                      </div>
                   
                        <div className={cx('close-modal')} onClick={handleCloseModal}>
                        <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
                        </div>
            </div>
        </div>
      )}
    </div>
);
}

export default CinemaList;