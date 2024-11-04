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
                const res = await axios.get(`http://localhost:8080/v1/Payment/getPaymentById/${userId}`);
                const orderData = res.data.res;
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
                                <div className={cx('col-2', 'rower')}>Ngày đặt</div>
                                <div className={cx('col-1', 'rower')}>Phương thức</div>
                                <div className={cx('col-2', 'rower')}>Giá tiền</div>
                                <div className={cx('col-2', 'rower')}>Trạng thái</div>
                            </div>
                        </div>

                        <div className={cx('histor-content')}>
                            {order.map((item, index) => (
                                <div key={item._id} className='w-100 row'>
                                    <div className={cx('col-1', 'rower')}>{index + 1}</div>
                                    <div className={cx('col-2', 'rower')}>{new Date(item.payment_date).toLocaleDateString()}</div>
                                    <div className={cx('col-1', 'rower')}>{item.payment_method}</div>
                                    <div className={cx('col-2', 'rower')}>{item.amount.toLocaleString()} VND</div>
                                    <div className={cx('col-2', 'rower')}>{item.resultCode===0 ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
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
