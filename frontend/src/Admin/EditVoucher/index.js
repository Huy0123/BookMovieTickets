import React , {useState, useEffect}from "react";
import classNames from 'classnames/bind';
import styles from './EditVoucher.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";


const cx = classNames.bind(styles);
const EditVoucher = ({ isOpen, onClose,vouncherId }) => {

    const [formData, setFormData] = useState({
        title: "",
        discount: "",
        start_date: "",
        end_date: "",
        image: null,
        points: "",
        description: "",
    });

    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const fetchVouncherId = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/getPointByID/${id}`);
            if (response.status === 200) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...response.data,
                    start_date: response.data.start_date.split("T")[0],
                    end_date: response.data.end_date.split("T")[0],
                }));
            }
        } catch (error) {
            console.log("Error fetching voucher:", error);
        }
    };
    
    const handleSubmit = async () => {
        console.log("formData", formData);
        try {
            const response = await axios.put(`http://localhost:8080/v1/updatePoint/${vouncherId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                alert('Cập nhật thành công');
                window.location.reload(); 
            }
            console.log("Voucher updated:", response.data);
        } catch (error) {
            console.log("Error updating voucher:", error);
        }
    };

    useEffect( () => {
        if (isOpen) {
            fetchVouncherId(vouncherId);
        }
    }, [isOpen, vouncherId]);

  if (!isOpen) return null;

  return (
    <div className={cx('modal-container')}>
    <div className={cx('modal-content')}>
    <h3 className={cx('tyle')}>Chỉnh sửa mã </h3>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tên phim</h4>
        <input 
            type="text" 
            name="title" 
            className={cx('food-name', 'form-info')} 
            onChange={handleInputChange}    
            value={formData.title}
        />
    </div>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Ngày bắt đầu</h4>
        <input 
            type="date" 
            name="start_date" 
            className={cx('release-date', 'form-info')} 
            onChange={handleInputChange} 
            value={formData.start_date}
        />
    </div>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Ngày kết thúc</h4>
        <input 
            type="date" 
            name="end_date" 
            className={cx('release-date', 'form-info')} 
            onChange={handleInputChange} 
            value={formData.end_date}
        />
    </div>    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thêm ảnh</h4>
        <input 
            type="file" 
            name="image" 
            accept="image/*" 
            className={cx('imgFood', 'form-info')}     
            onChange={(e) => setFormData({...formData,image: e.target.files[0]})}
        />
    </div>   
    <div className={cx('content')}>
        <h4 className={cx('title')}>Mô tả</h4>
        <textarea 
            name="description" 
            className={cx('description', 'form-info')}    
            onChange={handleInputChange} 
            value={formData.description} 
        />
    </div>  
    <div className={cx('content')}>
                <h4 className={cx('title')}>Điểm đổi</h4>
                <input 
                    type="number" 
                    name="points" 
                   
                    className={cx('price', 'form-info')}     
                    onChange={handleInputChange} 
                    value={formData.points}
                />
            </div>    
              <div className={cx('btn-con')}>
              <button type='button' className={cx('btn-confirm')} onClick={handleSubmit}>
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
