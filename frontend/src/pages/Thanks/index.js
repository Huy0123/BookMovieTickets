import classNames from 'classnames/bind';
import styles from './Thanks.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { faEnvelope, faSackDollar, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const cx = classNames.bind(styles);

function Thanks() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    if(params.has('resultCode')){
        var orderId = params.get('orderId');      
        var resultCode = params.get('resultCode');
    }else if(params.has('vnp_TransactionStatus')){
        var vnp_TransactionStatus = params.get('vnp_TransactionStatus'); 
        var orderId = params.get('vnp_TxnRef')
       console.log("param",params)
        // Lấy các giá trị của từng tham số
    }else if(params.has('appid')){
        var status = params.get('status'); 
        const app_trans_id = params.get('apptransid')
        var orderId =app_trans_id.split('_')[1];
    }

   
    const [nameMovie, setNameMovie] = useState('');
    const [address, setAddress] = useState('');
    const [room, setRoom] = useState('');
    const [seat, setSeat] = useState([]);
    const [namefood, setNamefood] = useState([]);
    const [movieid,setMovieid] = useState('')
    const [hasFetchedTransactionStatus, setHasFetchedTransactionStatus] = useState(false);
    const token = localStorage.getItem('userToken')
    const navigate = useNavigate();
   
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/v1/Booking/getBooking/${orderId}`);
                // Cập nhật các trạng thái với dữ liệu nhận được
                setNameMovie(res.data.orders_infor.showtime_id.movie_id.title);
                setAddress(res.data.orders_infor.cinema_id.address);
                setRoom(res.data.orders_infor.showtime_id.room_id.name);
                setMovieid(res.data.orders_infor.showtime_id.movie_id);
                const seat = res.data.orders_infor.seats_id.map(item => item.seat_number);
                setSeat(seat);
                const food = res.data.orders_infor.FoodAndDrinks_id.map(item => item);
                setNamefood(food);
                const status =res.data.orders_infor.status
                
                // Kiểm tra trạng thái giao dịch chỉ nếu chưa gọi trước đó
                if(!status){
                    if (vnp_TransactionStatus && !hasFetchedTransactionStatus) {
                        await axios.get(`http://localhost:8080/v1/Payment/vnpay-return/${params}`,{
                            withCredentials: true,
                            headers: {
                            'Authorization': `Bearer ${token}`

                        }
                        });
                        setHasFetchedTransactionStatus(true); // Đánh dấu là đã gọi
                    }
                }
                
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchBooking();
    }, [vnp_TransactionStatus, hasFetchedTransactionStatus]); // Thêm hasFetchedTransactionStatus vào dependency
     // Thêm một mảng rỗng để chỉ log một lần khi component mount
    const handleback=()=>{

        navigate('/history')  }
    
    const handleback2=()=>{

        navigate('/'); 
     }
    // Kiểm tra resultCode với kiểu dữ liệu chuỗi
    if (resultCode === "0"||vnp_TransactionStatus==="00"||status==="1") {
        return (
            <div className={cx('container')}>
                <div className='row'>
                    <div className='col-4'></div>
                    <div className={cx('wrap','col-4')}>
                    <div className={cx('thank')}>
                        <img className={cx('img-tks')} src={images.comple} />
                        <h1>Bạn đã thanh toán thành công!</h1>
                    </div>
                    <div className={cx('movie')}>
                        <div className={cx('in4')}>
                            <h1>Thông Tin Thanh Toán</h1>
                            <h3>TÊN PHIM: <span>{nameMovie}</span></h3>
                            <h3>ĐỊA CHỈ RẠP: {address}</h3>
                            <h3>PHÒNG CHIẾU: {room}</h3>
                            <h3 >SỐ GHẾ: {seat.join(', ')} </h3>  
                            
                            <div className={cx('food')}>
                                <h3>
                                    Tên Món Ăn: 
                                    <span className='ms-2'>                             
                                    {namefood.map(item => `${item.item_id.name} (x${item.quantity})`).join(', ')}</span>   
                                </h3>
                            </div>
                            <div className={cx('wrap-btn')}>
                            <button type='button' className={cx('btn-back')} onClick={handleback}>Quay lại</button>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>
        );
    } else {
        return (
            <div className={cx('container')}>
                <div className='row'>
                    <div className='col-4'></div>
                    <div className={cx('wrap','col-4')}>
                    <div className={cx('thank')}>
                        <img className={cx('img-tks')} src={images.fail} />
                        <h1>Thanh Toán Thất Bại!</h1>
                    </div>
                    <div className={cx('movie')}>
                        <div className={cx('in4')}>                          
                            <div className={cx('wrap-btn')}>
                            <button type='button' className={cx('btn-back2')} onClick={handleback2}>Quay lại</button>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className='col-4'></div>
                </div>
            </div>
        );
    }
}   

export default Thanks;
    