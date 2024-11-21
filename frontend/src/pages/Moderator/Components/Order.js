import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import classNames from 'classnames/bind';
import styles from './style.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
const cx = classNames.bind(styles);
const Order = ({ cinema_id }) => {
    const [order, setOrder] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getOrders = useCallback(async () => {
        if(!cinema_id) return;
        try {
            const response = await axios.get(`http://localhost:8080/v1/Payment/getPaymentByCinemaId/${cinema_id}`);
            setOrder(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, [cinema_id]);

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    console.log(selectedOrder);
    return (
        <>
            <h1>Lịch sử giao dịch</h1>
            <div className={cx('table-container')}>
                <table className="table table-hover">
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Tên khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Phương thức</th>
                            <th>Giá tiền</th>
                            <th>Trạng thái</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((item, index) => (
                            <tr key={index} className="text-center">
                                <td>{item._id}</td>
                                <td>{item.user_id.fullname}</td>
                                <td>{new Date(item.payment_date).toLocaleString()}</td>
                                <td>{item.payment_method}</td>
                                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}</td>
                                <td>
                                    <span className={item.resultCode === 0 ? "badge bg-success rounded-pill" : "badge bg-danger rounded-pill"}>
                                        {item.resultCode === 0 ? "Thành công" : "Thất bại"}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#OrderDetail" onClick={() => setSelectedOrder(item)}>Xem chi tiết</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="modal" id="OrderDetail">
    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <h3 className="text-center">Thông tin chi tiết</h3>
                {selectedOrder && selectedOrder.order_id? (
                    <div>
                    <p style={{ color: 'black' }}><strong>Tên phim:</strong> {selectedOrder.order_id.showtime_id.movie_id?.title || 'Không có thông tin'}</p>
                    <p style={{ color: 'black' }}><strong>Số phòng:</strong> {selectedOrder.order_id.showtime_id.room_id?.name || 'Không có thông tin'}</p>
                    <p style={{ color: 'black' }}><strong>Số ghế: </strong> 
                        {selectedOrder.order_id.seats_id && selectedOrder.order_id.seats_id.map((seat, index) => (
                            <span key={index}>{seat.seat_number}{index < selectedOrder.order_id.seats_id.length - 1 ? ', ' : ''}</span>
                        ))}
                    </p>
                
                    <p style={{ color: 'black' }}><strong>Đồ ăn:</strong>
                        
                    </p>
                    {selectedOrder.order_id.FoodAndDrinks_id && selectedOrder.order_id.FoodAndDrinks_id.map((item, index) => (
                            <div key={index}>
                                <p style={{ color: 'black' }}>{item.item_id.name} x {item.quantity}</p>
                            </div>
                        ))}
                </div>
                
                ): null}
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>



        </>
    );

}

export default Order;