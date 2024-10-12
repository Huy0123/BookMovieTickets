import React from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/dist/tippy.css'; // Import CSS for Tippy
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function Header() {
  
    const navigate = useNavigate();
    const handlerNavigateSignin = () => {
        navigate('/signIn');
    };
    const handlerNavigateSignup = () => {
        navigate('/signUp');
    };
    return (
        <div className={cx('wrapper')}>
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
                                <div className={cx('wrap1', 'col-lg-6', 'mt-5')}>
                                    <div className='row'>
                                        <div className='col-lg-6 d-flex flex-row-reverse pe-5'>
                                            <button type="button" className={cx('btn', 'book')}>Đặt vé ngay</button>
                                        </div>
                                        <div className={cx('sign', 'col-lg-6')}>
                                            <div className='row gap-2'>
                                                <button type="button" className={cx('btn', 'sign-up', 'col-lg-6')} onClick={handlerNavigateSignup}>Đăng ký</button>
                                                <button type="button" className={cx('btn', 'sign-in', 'col-lg-6')} onClick={handlerNavigateSignin}>Đăng nhập</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-1'></div>
                    </div>
                </div>

                {/* Sử dụng Tippy cho dropdown chọn rạp */}
                <div className={cx('header2')}>
                    <div className='row'>
                        <div className='col-lg-1'></div>
                        <div className={cx('wrap2', 'pt-3', 'col-lg-3', 'pb-3')}>
                                <button type="button" className={cx('btn-choose', 'col-lg-6', 'me-3')}>
                                    <FontAwesomeIcon className={cx('icon')} icon={faLocationDot} />
                                    Chọn rạp
                                </button>
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
