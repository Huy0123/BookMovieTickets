import { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './EditCinema.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const EditCinema = ({ isOpen, onClose, cinemaId }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [num, setNum] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Clear state when cinemaId changes or when modal opens
    if (cinemaId) {
      setName('');
      setAddress('');
      setNum('');
      setEmail('');
    }
  }, [cinemaId]);

  useEffect(() => {
    if (cinemaId) {
      const fetchCinema = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/v1/getCinemaByID/${cinemaId}`);
          setName(response.data.name); 
          setAddress(response.data.address);
          setNum(response.data.user_id.num);
          setEmail(response.data.user_id.email);
        } catch (error) {
          console.error("Error fetching cinema data:", error);
        }
      };
      fetchCinema();
    }
  }, [cinemaId]);

  const handleSubmit = async () => {
    const cinemaData = {
      name,
      email,
      num,
      address,
    };
    try {
      await axios.put(`http://localhost:8080/v1/updateCinema/${cinemaId}`, cinemaData);
      alert('Cập nhật thành công');
      onClose(); // Close modal after saving
      window.location.reload();
    } catch (error) {
      console.error("Error updating cinema:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cx('modal-container')}>
      <div className={cx('modal-content')}>
        <h3 className={cx('title')}>Chỉnh sửa rạp</h3>
        <div className={cx('content')}>
          <h4 className={cx('label')}>Tên rạp</h4>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)} 
            className={cx('cinema-name', 'form-info')}
          />
        </div>
        <div className={cx('content')}>
          <h4 className={cx('label')}>Địa chỉ</h4>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)} 
            className={cx('address', 'form-info')}
          />
        </div>
        <div className={cx('content')}>
          <h4 className={cx('label')}>Số điện thoại</h4>
          <input
            type="text"
            name="phone"
            value={num}
            onChange={(event) => setNum(event.target.value)} 
            className={cx('phone', 'form-info')}
          />
        </div>
        <div className={cx('content')}>
          <h4 className={cx('label')}>Email</h4>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)} 
            className={cx('email', 'form-info')}
          />
        </div>
        <div className={cx('btn-container')}>
          <button type="button" className={cx('btn-confirm')} onClick={handleSubmit}>
            Xác nhận
          </button>
          <div className={cx('close-modal')} onClick={onClose}>
            <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCinema;
