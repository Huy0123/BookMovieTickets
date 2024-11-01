import React, { useState,useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faStar, faCartShopping, faArrowsRotate, faLock} from '@fortawesome/free-solid-svg-icons';
import axios
 from 'axios';


const cx = classNames.bind(styles);

function Profile() {
  
    return (
        <div className={cx('container')}>
            <div className={cx('wrap-profile', 'row justify-content-center')}>
                

                <div className="col">
                
              
                    <div className={cx('modal-info','modal-histor', 'border p-4')}>
                    <h3 className={cx('title-info')}>THÔNG TIN THANH TOÁN</h3>

                        <div className={cx('histor-contain','main-contain')}>
                            <div className='w-100 row'>

                          
                            <div className={cx('col-1','rower')}>
                                Stt
                            </div>
                            <div className={cx('col-2','rower')}>
                                Tên phim
                            </div>
                            <div className={cx('col-2','rower')}>
                                Ngày dặt
                            </div>
                            <div className={cx('col-1','rower')}>
                                Phòng
                            </div>
                            <div className={cx('col-1','rower')}>
                                Số ghế
                            </div>
                            <div className={cx('col-1','rower')}>
                                Bắp nước
                            </div>  
                            <div className={cx('col-2','rower')}>
                                Giá tiền
                            </div>
                            <div className={cx('col-2','rower')}>
                               Trạng thái
                            </div>
                            </div>
                        </div>
                        
                        <div className={cx('histor-content')}>
                        <div className='w-100 row'>
                            <div className={cx('col-1','rower')}>
                               1
                            </div>
                            <div className={cx('col-2','rower')}>
                               ten phim that la dai qua la dai luon
                            </div>
                            <div className={cx('col-2','rower')}>
                              12/3/2020
                            </div>
                            <div className={cx('col-1','rower')}>
                               P02
                            </div>
                            <div className={cx('col-1','rower')}>
                               A5
                            </div>
                            <div className={cx('col-1','rower')}>
                                Bắp nước
                            </div>  
                            <div className={cx('col-2','rower')}>
                               1.352.000
                            </div>
                            <div className={cx('col-2','rower')}>
                              đã thanh toán
                            </div>
                            </div>
                            
                        </div>
                        
                       
                    </div>
              
            
                </div>
            </div>
        
            
        </div>
    );
}

export default Profile;
