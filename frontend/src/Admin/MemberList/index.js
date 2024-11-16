import classNames from 'classnames/bind';
import styles from './MemberList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPenToSquare, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const cx = classNames.bind(styles);

function MemberList() {
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    const [getUsers, setGetUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState("");

    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
      setSelectedOption(event.target.value);
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
        console.log(userIdToDelete)
        if (userIdToDelete) {
            try {
                await axios.delete(`http://localhost:8080/v1/Users/deleteUser/${userIdToDelete}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setShowModal(false);
                setGetUsers(prevUsers => prevUsers.filter(user => user._id !== userIdToDelete)); // Cập nhật danh sách sau khi xóa
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const openModal = (id) => {
        setUserIdToDelete(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setUserIdToDelete(null);
    };

    const filteredUsers = getUsers
      .filter(user => {
        return (
          user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.num.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

    return (
        <div className={cx('container')}>
            <h2>Danh sách thành viên</h2>
            <div className={cx('table-con')}>
                <div className={cx('finding')}>
                    <div className={cx('search')}>
                      <FontAwesomeIcon className="fs-3 me-2" icon={faSearch} />
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                      />
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
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.fullname}</td>
                                    <td>{item.username}</td>
                                    <td>{item.num}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        <FontAwesomeIcon className={cx('btn-del')} icon={faTrash} onClick={() => openModal(item._id)}/>
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
