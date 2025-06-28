import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

function History() {
    const userId = localStorage.getItem('userId');
    const [order, setOrder] = useState([]);
    const [moreinfo,setMoreinfo] = useState(false);
    const [orderdetail,setOrderdetail] = useState('')
    const [nameMovie, setNameMovie] = useState('');
    const [address, setAddress] = useState('');
    const [room, setRoom] = useState('');
    const [seat, setSeat] = useState([]);
    const [namefood, setNamefood] = useState([]);
    const [timestart,setTimestart] = useState('');
    const [cinemaName, setCinemaName] = useState('');
    const [orderdate, setOrderdate] = useState('');
    const [totalprice, setTotalprice]= useState('')
    const handleAddCinem =async(id) =>{
        setMoreinfo(true);
        try{
            const res = await axios.get(`http://localhost:8080/v1/Booking/getBooking/${id}`);
            console.log("kjkkjk",res.data.orders_infor);
            setNameMovie(res.data.orders_infor.showtime_id.movie_id.title);
            setAddress(res.data.orders_infor.cinema_id.address);
            setRoom(res.data.orders_infor.showtime_id.room_id.name);
            setCinemaName(res.data.orders_infor.cinema_id.name);
            setTimestart(res.data.orders_infor.showtime_id.showtime_start);
            setOrderdate(res.data.orders_infor.order_date);
            setTotalprice(res.data.orders_infor.total_price)
            const seat = res.data.orders_infor.seats_id.map(item => item.seat_number);
            setSeat(seat);
            const food = res.data.orders_infor.FoodAndDrinks_id.map(item => item);
            setNamefood(food);
        }
        catch{

        }
    }
    const handleCloseModal =() =>{
        setMoreinfo(false);
        setNameMovie('');
            setAddress('');
            setRoom('');
            setCinemaName('');
            setTimestart('');
            setOrderdate('');
            setTotalprice('')
            setSeat([]);
            setNamefood([]);

    }
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/v1/Payment/getPaymentByUserId/${userId}`);
                console.log("reajrq",res.data)
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
                        <div className={cx('table-con')} >

                            <table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Stt</th>
                                <th>Order ID</th>
                                <th>Ngày đặt</th>
                                <th>Phương thức</th>
                                <th>Giá tiền</th>
                                <th>Trang thái</th>
                                <th>Chi tiết</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.map((item,index)=>{
                                return(
                                <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.order_id}</td>
                                <td>{new Date(item.payment_date).toLocaleDateString()}</td>
                                <td>{item.payment_method}</td>
                                <td>{item.amount.toLocaleString()}đ</td>
                                <td>{item.resultCode===0 ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                
                                <td>
                                <FontAwesomeIcon className={cx('btn-info')} icon={faCircleInfo} onClick={()=>handleAddCinem(item.order_id)}/>
                                </td>
                               
                                </tr>
                                )
                            })}
                                
                            
                            
                            </tbody>
                        </table>
                        </div>
 
                        <div className={cx('histor-content')}>
                            {order.map((item, index) => (
                                <div key={item._id} className='w-100 row'>
                                    <div className={cx('col-1', 'rower')}>{index + 1}</div>
                                    <div className={cx('col-3', 'rower')}>{new Date(item.payment_date).toLocaleDateString()}</div>
                                    <div className={cx('col-2', 'rower')}>{item.payment_method}</div>
                                    <div className={cx('col-3', 'rower')}>{item.amount.toLocaleString()} VND</div>
                                    <div className={cx('col-3', 'rower')}>{item.resultCode===0 ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {moreinfo &&(
        <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
    <h3 className={cx('tyle')}>Chi tiết</h3>
    <div className="row">
    <div className="col d-flex flex-column gap-2">
   
  
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tên phim: {nameMovie}</h4>
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tên rạp: {cinemaName}</h4>
    </div>

    <div className={cx('content')}>
    <h4 className={cx('title')}>
  Giờ chiếu: {new Date(timestart).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })},{' '}
  {new Date(timestart).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })}
</h4>


    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Ghế: {seat.join(', ')}</h4>
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>
        Tên Món Ăn: 
        <span className='ms-2'>                             
        {namefood.map(item => `${item.item_id.name} (x${item.quantity})`).join(', ')}</span>   
        </h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Ngày đặt: {new Date(orderdate).toLocaleDateString()}</h4>
    </div>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tổng tiền: {totalprice}</h4>
    </div>

    

  
   
  
</div>
    
 </div>
   

    <div className={cx('close-modal')} onClick={handleCloseModal}>
        <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
    </div>
</div>

        </div>
      )}
        </div>
        
    );
}

export default History;
