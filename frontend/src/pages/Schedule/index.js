import React from 'react';
import classNames from 'classnames/bind';
import styles from './Schedule.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { faClock, faClosedCaptioning, faEarthAsia, faTag, faUserCheck } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Schedule() {
    return (  
        <div className={cx('container')}>
            <div className={cx('search','pt-4')}>
                <div className='row'>
                    <div className='col-lg-1'></div>
                    <div className={cx('wrap','d-flex justify-content-between ', 'col-lg-10','pb-5')}>
                            <div className={cx('date')}>
                            <h2>NGÀY</h2>
                                <select className={cx('select1')} aria-label="Select date">
                                    <option value="">Select Date</option>
                                    <option value="1">Date 1</option>
                                    <option value="2">Date 2</option>
                                </select>
                            </div>

                            <div className={cx('movie')}>
                            <h2>PHIM</h2>
                                <select className={cx('select2')} aria-label="Select movie">
                                    <option value="">Select Movie</option>
                                    <option value="1">Movie 1</option>
                                    <option value="2">Movie 2</option>
                                </select>
                            </div>

                            <div className={cx('cinema')}>
                            <h2>RẠP</h2>
                                <select className={cx('select3')} aria-label="Select cinema">
                                    <option value="">Select Cinema</option>
                                    <option value="1">Cinema 1</option>
                                    <option value="2">Cinema 2</option>
                                </select>
                            </div>
                        </div>
                    <div className='col-lg-1'></div>
                    </div>
                    
            </div>          

            {/* Add movie */}
            <div className={cx('content','mt-5')}>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className={cx('wrap-content','col-10')}>
                        <div className='row'>
                            <div className={cx('movie-detail','col-4')}>
                                <img src={images.banner4} className={cx('d-block')} alt="" />
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}>Tên phim: </h1>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faTag} />
                                        <div className={cx('type')}>Thể loại: </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClock} />
                                        <div className={cx('duration')}>Thời gian: </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faEarthAsia} />
                                        <div className={cx('country')}>Quốc gia: </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClosedCaptioning} />
                                        <div className={cx('sub')}>Phụ đề: </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faUserCheck} />
                                        <div className={cx('limit')}>Nhãn phim: </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('time','col-8','ps-5','pt-5','mt-5')}>                  
                                <div className={cx('wrap-line')}>
                                    <div className='row'>
                                        <div className={cx('about','col-2')}>
                                            <h1 className={cx('cinema-name')}>TÊN RẠP: </h1>
                                            <div className={cx('address')}>Địa chỉ: </div>
                                        </div>
                                        <div className='col-2'></div>
                                        <div className={cx('schedule','col-8')}>
                                            <div className={cx('group')}>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*  */}
                                <div className={cx('wrap-line')}>
                                    <div className='row'>
                                        <div className={cx('about','col-2')}>
                                            <h1 className={cx('cinema-name')}>TÊN RẠP: </h1>
                                            <div className={cx('address')}>Địa chỉ: </div>
                                        </div>
                                        <div className='col-2'></div>
                                        <div className={cx('schedule','col-8')}>
                                            <div className={cx('group')}>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('wrap-line')}>
                                    <div className='row'>
                                        <div className={cx('about','col-2')}>
                                            <h1 className={cx('cinema-name')}>TÊN RẠP: </h1>
                                            <div className={cx('address')}>Địa chỉ: </div>
                                        </div>
                                        <div className='col-2'></div>
                                        <div className={cx('schedule','col-8')}>
                                            <div className={cx('group')}>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('wrap-line')}>
                                    <div className='row'>
                                        <div className={cx('about','col-2')}>
                                            <h1 className={cx('cinema-name')}>TÊN RẠP: </h1>
                                            <div className={cx('address')}>Địa chỉ: </div>
                                        </div>
                                        <div className='col-2'></div>
                                        <div className={cx('schedule','col-8')}>
                                            <div className={cx('group')}>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('wrap-line')}>
                                    <div className='row'>
                                        <div className={cx('about','col-2')}>
                                            <h1 className={cx('cinema-name')}>TÊN RẠP: </h1>
                                            <div className={cx('address')}>Địa chỉ: </div>
                                        </div>
                                        <div className='col-2'></div>
                                        <div className={cx('schedule','col-8')}>
                                            <div className={cx('group')}>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                                <button className={cx('btn-schedule')}>8:00</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>                                                                                                                                                                                                                     
                            </div>
                        </div>
                    </div>
                    <div className='col-1'></div>
                </div>
            </div>
            </div>
    );
}

export default Schedule;
