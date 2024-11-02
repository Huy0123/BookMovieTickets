import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const cx = classNames.bind(styles);

function History() {
    const userId = localStorage.getItem('userId');
    const [order, setOrder] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/v1/Booking/getUserBooking/${userId}`);
                const orderData = res.data.order_infor;
                console.log(orderData)
                setOrder(orderData);
            } catch (error) {
                console.error("Failed to fetch order data", error);
            }
        };
        getData();
    }, []);

    return (
        <div className={cx('container')}>
            <div className={cx('wrap-profile', 'row justify-content-center')}>
                <div className="col">
                    <div className={cx('modal-info', 'modal-histor', 'border p-4')}>
                        <h3 className={cx('title-info')}>THÔNG TIN THANH TOÁN</h3>
                        <div className={cx('histor-contain', 'main-contain')}>
                            <div className='w-100 row'>
                                <div className={cx('col-1', 'rower')}>Stt</div>
                                <div className={cx('col-2', 'rower')}>Tên phim</div>
                                <div className={cx('col-2', 'rower')}>Ngày đặt</div>
                                <div className={cx('col-1', 'rower')}>Phòng</div>
                                <div className={cx('col-1', 'rower')}>Số ghế</div>
                                <div className={cx('col-1', 'rower')}>Bắp nước</div>
                                <div className={cx('col-2', 'rower')}>Giá tiền</div>
                                <div className={cx('col-2', 'rower')}>Trạng thái</div>
                            </div>
                        </div>

                        <div className={cx('histor-content')}>
                            {order.map((item, index) => (
                                <div key={item._id} className='w-100 row'>
                                    <div className={cx('col-1', 'rower')}>{index + 1}</div>
                                    <div className={cx('col-2', 'rower')}>{item.showtime_id.movie_id.title}</div>
                                    <div className={cx('col-2', 'rower')}>{new Date(item.order_date).toLocaleDateString()}</div>
                                    <div className={cx('col-1', 'rower')}>{item.showtime_id.room_id.name}</div>
                                    <div className={cx('col-1', 'rower')}>{item.seats_id.join(', ')}</div>
                                    <div className={cx('col-1', 'rower')}>{item.FoodAndDrinks_id ? 'Bắp nước' : 'Không'}</div>
                                    <div className={cx('col-2', 'rower')}>{item.total_price.toLocaleString()} VND</div>
                                    <div className={cx('col-2', 'rower')}>{item.status ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;
