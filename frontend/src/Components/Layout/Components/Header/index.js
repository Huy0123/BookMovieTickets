import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '~/assets/img';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Import Tippy styles

const cx = classNames.bind(styles);

function Header() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [headerColor, setHeaderColor] = useState('#FFB84C');
    const [fullname, setFullname] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dropdownRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");  // State to hold error message
    const [cinemas, setCinemas] = useState([]); // State to hold fetched cinemas

    const navigate = useNavigate();
    const location = useLocation();
    localStorage.setItem('previousPage', location.pathname);
    

    const handleNavigateSignin = () => navigate('/signIn');
    const handleNavigateSignup = () => navigate('/signUp');
   

    const handleScroll = () => {
        setHeaderColor(window.scrollY > 50 ? ' rgba(255, 184, 77, 0.375)' : '#FFB84C');
    };
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchCinema = async () => {
            try {
                const resCinema = await axios.get('http://localhost:8080/v1/getCinemas');
                    setCinemas(resCinema.data);
                    console.log(resCinema);
            }catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('userToken')
            console.log("tk",token)
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
       
        const fetchData = async () => {
            await Promise.all([fetchUserData(), fetchCinema()]);
        };
    
        fetchData();
    }, []);

    const renderUserDropdown = () => (
        <div className={cx('user-dropdown')}>
            <div className={cx('dropdown-item')} onClick={() => navigate('/profile')}>
                Thông tin cá nhân
            </div>
            <div className={cx('dropdown-item')} onClick={() => navigate('/history')}>
                Lịch sử giao dịch
            </div>
            <div className={cx('dropdown-item')} onClick={() => navigate('/voucher')}>
                Đổi mã ưu đãi
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
    const handleBooking = (cinemaId) => {
        console.log(cinemaId)
        navigate(`/chooseCinema/${cinemaId}`); 
    };
    return (
        <div className={cx('wrapper')} style={{ backgroundColor: headerColor }}>
            <div className={cx('container')}>
                <div className={cx('header1')}>
                    <div className="row">
                        <div className="col-lg-1"></div>
                        <div className={cx('col-lg-10', 'wrap')}>
                            <div className="row">
                                <div className="col-lg-2 pb-3 pt-3" >
                                    <img
                                        className={cx('logo')}
                                        src={images.logos}
                                        alt="Logo"
                                        onClick={() => navigate('/')}
                                    />
                                </div>
                               
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
                                        <div key={index} className={cx('dropdown-item')} onClick={()=>handleBooking(cinema._id)}>
                                            {cinema.name} {/* Adjust based on the structure of your cinema data */}
                                        </div>
                                    ))}
                                        </div>
                                    )}
                                        <button type="button" className={cx('btn-schedule', 'col-lg-6')} onClick={() => navigate('/schedule')}>
                                        <FontAwesomeIcon className={cx('icon')} icon={faLocationDot} />
                                        Lịch chiếu
                                    </button>
                                </div>

                                <div className={cx('wrap1', 'col-lg-7')}>
                                    <div className="row d-flex justify-content-end">
                                       
                                        {!isLoggedIn ? (
                                            <div className={cx('sign','d-flex gap-3 justify-content-end pb-3 pt-3' )}>
                                               
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
                                        ) : (
                                         
                                                <div className={cx('logined', 'col-sm-2')}>
                                                <Tippy
                                                content={renderUserDropdown()}
                                                interactive={true}
                                                trigger="click"
                                                arrow={false}
                                                placement="bottom-start" // Đặt vị trí dưới và căn về bên trái
                                                offset={[100, 10]} // Điều chỉnh khoảng cách giữa Tippy và thẻ logined
                                            >
                                                    <div className={cx('wrap-logined', 'd-flex justify-content-center align-items-center w-100 h-100')} >
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

                <div className={cx('header2')} >
                    <div className="row">
                        <div className="col-lg-1"></div>
                   
                        <div className="col-lg-8"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;