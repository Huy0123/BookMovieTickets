import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const cx = classNames.bind(styles);

function Header() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [headerColor, setHeaderColor] = useState('#000000'); // Màu mặc định cho header
    const dropdownRef = useRef(null); // Tạo ref để theo dõi dropdown
    const [fullname, setFullname] = [''];

    const cinemas = [
        'Tên rạp 1',
        'Tên rạp 2',
        'Tên rạp 3',
        'Tên rạp 4',
        'Tên rạp 5',
        'Tên rạp 6',
        'Tên rạp 7',
        'Tên rạp 8',
        'Tên rạp 9',
        'Tên rạp 10',
    ];

    const navigate = useNavigate();
    const handlerNavigateSignin = () => {
        navigate('/signIn');
    };
    const handlerNavigateSignup = () => {
        navigate('/signUp');
    };

    // Hàm để đóng dropdown khi nhấn bên ngoài
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    // Hàm xử lý cuộn trang để đổi màu header
    const handleScroll = () => {
        if (window.scrollY > 50) {
            setHeaderColor('rgba(12, 0, 0, 0.5'); // Đổi màu header khi cuộn xuống
        } else {
            setHeaderColor('#000000'); // Màu mặc định
        }
    };

    // Sử dụng useEffect để thêm event listener cho nhấn ngoài và cuộn
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // const logined = async (event) => {
    //     event.preventDefault();

    //     try {
    //         const response = await axios.post(
    //             'http://localhost:8080/v1/Users/getUserByID/', 
    //             {
    //                 withCredentials: true,  
    //             }
    //         );
    //         console.log(response.data);
    //         const token = response.data.accesstoken;
    //         if (token) {
    //             localStorage.setItem('userToken', token);
    //             navigate('/'); 
    //         } else {
    //             setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng.'); // Show error if token not present
    //         }
    //     } catch (error) {
    //         setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng.'); // Show error on catch
    //         console.error('Error during sign-in:', error);
    //     }
    // }

    return (
        <div className={cx('wrapper')} style={{ backgroundColor: headerColor }}>
            <div className={cx('container')}>
                <div className={cx('header1')}>
                    <div className='row'>
                        <div className='col-lg-1'></div>
                        <div className={cx('col-lg-10', 'wrap')}>
                            <div className='row'>
                                <div className='col-lg-2 mt-4'>
                                    <img
                                        className={cx('logo')}
                                        src='https://png.pngtree.com/png-vector/20220525/ourmid/pngtree-spa-logo-png-image_4721219.png'
                                        alt="Logo"
                                    />
                                </div>
                                <div className='col-lg-4'></div>
                                <div className={cx('wrap1', 'col-lg-6', 'mt-3')}>
                                    <div className='row'>
                                        <div className='col-lg-6 d-flex flex-row-reverse pe-5'>
                                            <button type="button" className={cx('btn', 'book')}>
                                                Đặt vé ngay
                                            </button>
                                        </div>
                                        <div className={cx('sign', 'col-lg-6','d-none')}>
                                            <div className='row gap-2 '>
                                                <button type="button" className={cx('btn', 'sign-up', 'col-lg-6')} onClick={handlerNavigateSignup}>
                                                    Đăng ký
                                                </button>
                                                <button type="button" className={cx('btn', 'sign-in', 'col-lg-6')} onClick={handlerNavigateSignin}>
                                                    Đăng nhập
                                                </button>
                                            </div>
                                        </div>
                                        <div className={cx('logined', 'col-sm')}>
                                            <div className={cx('wrap-logined','d-flex align-items-center w-100 h-100')}>
                                            <FontAwesomeIcon className={cx('icon-user')} icon={faUser} />
                                                    <h3 className={cx('fullname')}
                                                    value={fullname}
                                                    onChange={(event) => setFullname(event.target.value)}
                                                    > Nguyễn trình chó ngu</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-1'></div>
                    </div>
                </div>

                <div className={cx('header2')}>
                    <div className='row'>
                        <div className='col-lg-1'></div>
                        <div className={cx('wrap2', 'pt-3', 'col-lg-3', 'pb-3')} ref={dropdownRef}>
                            <button
                                type="button"
                                className={cx('btn-choose', 'col-lg-6', 'me-3')}
                                onClick={() => setDropdownVisible((prev) => !prev)} // Toggle dropdown
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
                            <button type="button" className={cx('btn-schedule', 'col-lg-6')}>
                                <FontAwesomeIcon className={cx('icon')} icon={faLocationDot} />
                                Lịch chiếu
                            </button>
                        </div>
                        <div className='col-lg-8'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
