
import classNames from 'classnames/bind';
import styles from './MemberList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faFilter, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate từ react-router-dom
import axios from 'axios';

const cx = classNames.bind(styles);

function MemberList() {
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate(); // Khai báo useNavigate
    const [getUsers, setGetUsers] = useState([]);
    const [showModal, setShowModal] = useState(false); // State để điều khiển modal
    const [userIdToDelete, setUserIdToDelete] = useState(null); // State để lưu ID người dùng cần xóa
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/v1/Users/getUsers`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                setGetUsers(res.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchData();
    }, [token]);

    const handleDelete = async () => {
        if (userIdToDelete) {
            try {
                await axios.delete(`http://localhost:8080/v1/Users/deleteUser/${userIdToDelete}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setShowModal(false); // Đóng modal
                window.location.reload();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const openModal = (id) => {
        setUserIdToDelete(id); // Lưu ID của người dùng cần xóa
        setShowModal(true); // Mở modal
    };

    const closeModal = () => {
        setShowModal(false); // Đóng modal
        setUserIdToDelete(null); // Reset ID
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
                            <th>STT</th>
                            <th>Họ và tên</th>
                            <th>Tài Khoản</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.fullname}</td>
                                    <td>{item.username}</td>
                                    <td>{item.num}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>
                                         <button>Chỉnh sửa</button>
                                        <button className={cx('btn-del')} type='button' onClick={() => openModal(item._id)}>Xóa</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal xác nhận xóa */}
            {showModal && (
                <div className={cx('modal')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h4>Xác nhận xóa</h4>
                            <button type="button" onClick={closeModal}>×</button>
                        </div>
                        <div className={cx('modal-body')}>
                            Bạn có chắc chắn muốn xóa người dùng này?
                        </div>
                        <div className={cx('modal-footer')}>
                            <button type="button" onClick={closeModal}>Hủy</button>
                            <button type="button" onClick={handleDelete}>Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MemberList;
