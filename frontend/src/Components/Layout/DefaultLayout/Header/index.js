import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Import Tippy styles

const cx = classNames.bind(styles);

function Header() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [headerColor, setHeaderColor] = useState('#000000');
    const [fullname, setFullname] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dropdownRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");  // State to hold error message

    const navigate = useNavigate();
    const location = useLocation();
    localStorage.setItem('previousPage', location.pathname);
    const cinemas = [
        'Tên rạp 1', 'Tên rạp 2', 'Tên rạp 3', 'Tên rạp 4',
        'Tên rạp 5', 'Tên rạp 6', 'Tên rạp 7', 'Tên rạp 8',
        'Tên rạp 9', 'Tên rạp 10'
    ];

    const handleNavigateSignin = () => navigate('/signIn');
    const handleNavigateSignup = () => navigate('/signUp');
   

    const handleScroll = () => {
        setHeaderColor(window.scrollY > 50 ? 'rgba(12, 0, 0, 0.5)' : '#000000');
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('userToken')
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:8080/v1/Users/getUserbyid`, {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                        
                    });
                    console.log(response.data)
                    setFullname(response.data.userFound.fullname);
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const renderUserDropdown = () => (
        <div className={cx('user-dropdown')}>
            <div className={cx('dropdown-item')} onClick={() => navigate('/profile')}>
                Thông tin cá nhân
            </div>
            <div className={cx('dropdown-item')} onClick={() => navigate('/transaction-history')}>
                Lịch sử giao dịch
            </div>
            <div className={cx('dropdown-item')} onClick={logout}>
                Đăng xuất
            </div>
        </div>
    );


    const logout = async (event) => {
        event.preventDefault();
        setErrorMessage("");  
        try {
            await axios.post(
            'http://localhost:8080/v1/Users/logout',
                {},  // Đảm bảo body không trống
                { withCredentials: true } // Đảm bảo gửi cookie cùng request
            );
            setIsLoggedIn(false);
            const previousPage = localStorage.getItem('previousPage') || '/';  // Fallback to '/' if not found
                navigate(previousPage);  // Redirect to the previous page
            localStorage.clear();
        } catch (error) {
            console.error('Error during logout:', error);
            setErrorMessage("Logout failed. Please try again.");
        }
    };

    return (
        <div className={cx('wrapper')} style={{ backgroundColor: headerColor }}>
            <div className={cx('container')}>
                <div className={cx('header1')}>
                    <div className="row">
                        <div className="col-lg-1"></div>
                        <div className={cx('col-lg-10', 'wrap')}>
                            <div className="row">
                                <div className="col-lg-2 mt-4">
                                    <img
                                        className={cx('logo')}
                                        src="https://png.pngtree.com/png-vector/20220525/ourmid/pngtree-spa-logo-png-image_4721219.png"
                                        alt="Logo"
                                    />
                                </div>
                                <div className="col-lg-4"></div>
                                <div className={cx('wrap1', 'col-lg-6', 'mt-3')}>
                                    <div className="row">
                                        <div className="col-lg-6 d-flex flex-row-reverse pe-5">
                                            <button type="button" className={cx('btn', 'book')}>
                                                Đặt vé ngay
                                            </button>
                                        </div>
                                        {!isLoggedIn ? (
                                            <div className={cx('sign', 'col-lg-6')}>
                                                <div className="row gap-2">
                                                    <button
                                                        type="button"
                                                        className={cx('btn', 'sign-up', 'col-lg-6')}
                                                        onClick={handleNavigateSignup}
                                                    >
                                                        Đăng ký
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={cx('btn', 'sign-in', 'col-lg-6')}
                                                        onClick={handleNavigateSignin}
                                                    >
Đăng nhập
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                         
                                                <div className={cx('logined', 'col-sm')}>
                                                <Tippy
                                                content={renderUserDropdown()}
                                                interactive={true}
                                                trigger="click"
                                                placement="bottom-start" // Đặt vị trí dưới và căn về bên trái
                                                offset={[0, 10]} // Điều chỉnh khoảng cách giữa Tippy và thẻ logined
                                            >
                                                    <div className={cx('wrap-logined', 'd-flex align-items-center w-100 h-100')}>
                                                        <FontAwesomeIcon className={cx('icon-user')} icon={faUser} />
                                                        <h3 className={cx('fullname')}>{fullname}</h3>
                                                    </div>
                                                    </Tippy>
                                                </div>
                                           
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-1"></div>
                    </div>
                </div>

                <div className={cx('header2')}>
                    <div className="row">
                        <div className="col-lg-1"></div>
                        <div className={cx('wrap2', 'pt-3', 'col-lg-3', 'pb-3')} ref={dropdownRef}>
                            <button
                                type="button"
                                className={cx('btn-choose', 'col-lg-6', 'me-3')}
                                onClick={() => setDropdownVisible((prev) => !prev)}
                            >
                                <FontAwesomeIcon className={cx('icon')} icon={faLocationDot} />
                                Chọn rạp
                            </button>
                            {isDropdownVisible && (
                                <div className={cx('dropdown-menu')}>
                                    {cinemas.map((cinema, index) => (
                                        <div key={index} className={cx('dropdown-item')}>
                                            {cinema}
                                        </div>
                                    ))}
                                </div>
                            )}
                                <button type="button" className={cx('btn-schedule', 'col-lg-6')} onClick={() => navigate('/schedule')}>
                                <FontAwesomeIcon className={cx('icon')} icon={faLocationDot} />
                                Lịch chiếu
                            </button>
                        </div>
                        <div className="col-lg-8"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;