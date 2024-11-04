import React from "react";
import classNames from 'classnames/bind';
import styles from './EditCinema.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';


const cx = classNames.bind(styles);
const EditCinema = ({ isOpen, onClose }) => {


  

  if (!isOpen) return null;

  return (
    <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
            <h3 className={cx('tyle')}>Chỉnh sửa rạp </h3>
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
                   
                        <div className={cx('close-modal')} onClick={onClose}>
                        <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
                        </div>
            </div>
        </div>
  );
};

export default EditCinema;
