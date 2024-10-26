import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faStar, faCartShopping} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Profile() {
    const [points, setPoints] = useState(10000); // Initial points

    // Handle point redemption
    const handleRedeem = () => {
        if (points >= 6000) {
            setPoints(points - 6000);
            alert('Bạn đã đổi 1000 điểm thành công!');
        } else {
            alert('Không đủ điểm để đổi!');
        }
    };

    return (
        <div className={cx('container', 'py-4')}>
            <div className={cx('wrap-profile', 'row justify-content-center')}>
                <div className="col-3">
                    <div className={cx('tool-bar')}>
                        <div className={cx('tool', 'row')}>
                            <div className={cx('point-bar-container')}>
                                <div className={cx('point-display')}>
                                    <p>Điểm của bạn: {points} / 10000</p>
                                </div>

                                <div className={cx('progress')}>
                                    <div
                                        className={cx('progress-bar')}
                                        role="progressbar"
                                        style={{ width: `${(points / 10000) * 100}%` }}
                                        aria-valuenow={points}
                                        aria-valuemin="0"
                                        aria-valuemax="10000"
                                    ></div>
                                </div>

                                <button 
                                    onClick={handleRedeem} 
                                    className={cx('btn',' mt-3')}
                                   
                                >
                                    Đổi 1000 điểm
                                </button>
                            </div>

                            <div className={cx('nav-container')}>
                                <div className={cx('info', 'nav', 'd-flex')}>
                                    <FontAwesomeIcon className="fs-3 me-2" icon={faUser} />
                                    <h5>THÔNG TIN CÁ NHÂN</h5>
                                </div>

                                <div className={cx('SCORE', 'nav', 'd-flex')}>
                                    <FontAwesomeIcon className="fs-3 me-2" icon={faStar} />
                                    <h5>TÍCH ĐIỂM</h5>
                                </div>

                                <div className={cx('histor', 'nav', 'd-flex')}>
                                    <FontAwesomeIcon className="fs-3 me-2" icon={faCartShopping} />
                                    <h5>LỊCH SỬ GIAO DỊCH</h5>
                                </div>
                            </div>
                        </div>
                        <div className={cx('reset-pass','row')}>jahahh</div>
                    </div>
                </div>

                <div className="col-7">
                    <div className={cx('modal-info', 'border p-4')}>
                        <h3 className={cx('title-info')}>Thông tin tài khoản</h3>
                        {/* Add additional user information content here */}
                      <div className={cx('wrap-info-user')}>
                      <h4 className={cx('info-user-etc')}>TÊN ĐẦY ĐỦ</h4>
                      <input 
                        type="text" 
                        id="fullname" 
                        name="fullname" 
                        value={"dự nguyễn"}
                        // value={fullname}
                        className={cx('fulname','form-ifor')}     
                      />
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
