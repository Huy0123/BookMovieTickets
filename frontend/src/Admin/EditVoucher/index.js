import React from "react";
import classNames from 'classnames/bind';
import styles from './EditVoucher.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';


const cx = classNames.bind(styles);
const EditVoucher = ({ isOpen, onClose }) => {


  

  if (!isOpen) return null;

  return (
    <div className={cx('modal-container')}>
    <div className={cx('modal-content')}>
    <h3 className={cx('tyle')}>Chỉnh sửa mã </h3>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tên phim</h4>
        <input 
            type="text" 
            name="foodaname" 
            className={cx('food-name', 'form-info')}     
        />
    </div>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thể loại</h4>
        <input 
            type="text" 
            name="type" 
            className={cx('type', 'form-info')}     
        />
    </div>            
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thêm ảnh</h4>
        <input 
            type="file" 
            name="imgfood" 
            accept="image/*" 
            className={cx('imgFood', 'form-info')}     
        />
    </div>   
    <div className={cx('content')}>
        <h4 className={cx('title')}>Mô tả</h4>
        <textarea 
            name="description" 
            className={cx('description', 'form-info')}     
        />
    </div>  
    <div className={cx('content')}>
                <h4 className={cx('title')}>Đơn giá</h4>
                <input 
                    type="number" 
                    name="price" 
                   
                    className={cx('price', 'form-info')}     
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

export default EditVoucher;
