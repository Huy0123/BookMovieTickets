import classNames from 'classnames/bind';
import styles from './BookTicket.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import React, { useEffect,useState} from 'react';
import { faClock, faClosedCaptioning, faEarthAsia, faMinus, faPlus, faTag, faTv, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const cx = classNames.bind(styles);
function BookTicket() {
    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [regularTicketCount, setRegularTicketCount] = useState(0);
    const [vipTicketCount, setVipTicketCount] = useState(0);
    const [FoodCount, setFoodCount] = useState(0);
    const [title,setTitle] = useState("")
    const [release_date,setReleaseDate] = useState("")
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [seats, setSeats] = useState([]);

    const user_id = localStorage.getItem('user_id')
    console.log("user_id: ",user_id)
    const movie_id = "670277154afb418b89120b85";
    useEffect(()=>{
        const getMovieByID = async()=>{
            try {
                const res = await axios.get(
                    `http://localhost:8080/v1/getMovieByID/${movie_id}`
                )
                console.log(res.data)
                setTitle(res.data.title); 
                const date = new Date(res.data.release_date).toLocaleString();
                setReleaseDate(date)    
                
                console.log(setTitle)
                // Gọi API để lấy thông tin ghế
                const seatsRes = await axios.get('http://localhost:8080/v1/getSeats');
                setSeats(seatsRes.data);
                console.log(seatsRes.data);

            } catch (error) {
                console.error('Error fetching data:', error);

            }
        }
        getMovieByID();
    },[])
    
    const handleSeatClick = (seat) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seat)
                ? prevSelectedSeats.filter((s) => s !== seat) // Bỏ chọn nếu đã chọn
                : [...prevSelectedSeats, seat] // Thêm nếu chưa chọn
        );
    
        // Cập nhật showOrderDetail
        if (selectedSeats.includes(seat)) {
            // Nếu ghế đang được bỏ chọn, kiểm tra xem có ghế nào còn chọn không
            if (selectedSeats.length === 1) {
                setShowOrderDetail(false); // Nếu không còn ghế nào được chọn, ẩn order
            }
        } else {
            // Nếu ghế mới được chọn
            setShowOrderDetail(true); // Luôn hiển thị order khi có ghế được chọn
        }
    };
    
    const increaseRegularTicket = () => {
        setRegularTicketCount(regularTicketCount + 1);
        setShowOrderDetail(true); 
    };

    // Function to decrease regular ticket count
    const decreaseRegularTicket = () => {
        if (regularTicketCount > 0) {
            setRegularTicketCount(regularTicketCount - 1);
            // Kiểm tra xem có còn vé không
            if (regularTicketCount - 1 === 0 && vipTicketCount === 0) {
                setShowOrderDetail(false); // Ẩn order nếu không còn vé
            }
        }
    };

    // Function to increase VIP ticket count
    const increaseVipTicket = () => {
        setVipTicketCount(vipTicketCount + 1);
        setShowOrderDetail(true); 
    };

    // Function to decrease VIP ticket count
    const decreaseVipTicket = () => {
        if (vipTicketCount > 0) {
            setVipTicketCount(vipTicketCount - 1);
            // Kiểm tra xem có còn vé không
            if (vipTicketCount - 1 === 0 && regularTicketCount === 0) {
                setShowOrderDetail(false); // Ẩn order nếu không còn vé
            }
        }
    };

    const increaseFood = () => {
        setFoodCount(FoodCount + 1);
        setShowOrderDetail(true); 
    };

    const decreaseFood = () => {
        if (FoodCount > 0) {
            setFoodCount(FoodCount - 1);
            // Kiểm tra xem có còn thực phẩm không
            if (FoodCount - 1 === 0 && regularTicketCount === 0 && vipTicketCount === 0) {
                setShowOrderDetail(false); // Ẩn order nếu không còn thực phẩm và vé
            }
        }
    };
    // Giả sử mỗi hàng có 12 ghế, bạn có thể điều chỉnh số ghế theo nhu cầu
    const seatsPerRow = 12;
    const totalPrice = selectedSeats.reduce((total, seat) => {
        const seatInfo = seats.find(s => s.seat_number === seat); // Tìm ghế trong danh sách
        if (seatInfo) {
            return total + seatInfo.price; // Thêm giá của ghế vào tổng
        }
        return total; // Nếu không tìm thấy ghế, trả lại tổng hiện tại
    }, 0) + (FoodCount * 50000); // Thêm giá đồ ăn
        return (
        <div className={cx('container')}>
            <div className={cx('info-movie')}>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className={cx('content-movie','col-10')}>
                        <div className='row'>
                            <img src={images.banner4} className={cx('d-block','col-4')} alt="" />
                            <div className={cx('col-8')}>
                                <div className={cx('wrap-info','ms-5','mt-4','pt-1')}>
                                    <h1 id="title"  className={cx('title')}>Tên phim: {title}</h1>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faTag} />
                                        <div className={cx('type')}>Thể loại: </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClock} />
                                        <div className={cx('duration')}>Thời gian: {release_date} </div>
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
                                                      {/* Thông tin */}
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}>Mô tả </h1>
                                    <div className='info-group '>
                                        <div className={cx('director')}>Đạo diễn: </div>
                                    </div>
                                    <div className='info-group '>
                                        <div className={cx('performer')}>Diễn viên: </div>
                                    </div>
                                    <div className='info-group'>
                                        <div className={cx('premiere')}>Khởi chiếu: </div>
                                    </div>
                                    
                                </div>  
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}>Mô tả </h1>
                                    <div className={cx('description')}>Phim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấnPhim này là joker trịnh trần anh tuấn </div>                                                                     
                                </div>
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-trailer','pe-2','pt-1')} icon={faTv} />
                                        <div className={cx('trailer')} style={{ textDecoration: 'underline',cursor:'pointer' }}>Xem Trailer</div>
                                    </div>                                                                     
                                </div>                                       
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='col-1'></div>
                </div>
            </div>
            {/* Lich chieu */}
            <div className={cx('schedule')}>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className={cx('wrap','col-10')}>
                        <h1 className={cx('show')}>Lịch chiếu</h1>
                        <div className={cx('group-btn')}>
                            <div className={cx('date-show','gap-3')}>
                                <div className={cx('btn-date')}>
                                    <h2 className={cx('date','pt-1')}>10/10</h2>
                                    <div className={cx('dow')}>THỨ 2</div>
                                </div>
                                <div className={cx('btn-date','pt-1')}>
                                    <h2 className={cx('date','pt-1')}>10/10</h2>
                                    <div className={cx('dow')}>THỨ 2</div>
                                </div>
                                <div className={cx('btn-date','pt-1')}>
                                    <h2 className={cx('date')}>10/10</h2>
                                    <div className={cx('dow')}>THỨ 2</div>
                                </div>
                                <div className={cx('btn-date','pt-1')}>
                                    <h2 className={cx('date')}>10/10</h2>
                                    <div className={cx('dow')}>THỨ 2</div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('about')}>
                            <div className='row'>
                            <div className='col-1'></div>
                            <div className='col-10 '>
                                <h2>TÊN RẠP:</h2>
                                <h3 className={cx('address')}>Địa chỉ:</h3>
                                <div className={cx('time-start')}>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                    <button type='button' className={cx('btn-time')}>8:00</button>
                                </div>
                            </div>
                            <div className='col-1'></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-1'></div>

                </div>
            </div>
            <div className={cx('choose-ticket')}>
                <h1>CHỌN LOẠI VÉ</h1>
                <div className={cx('wrap-ticket','gap-5')}>
                    <div className={cx('ticket','regular')}>
                        <h2>VÉ THƯỜNG</h2>
                        <div className={cx('price-quantity')}>
                            <h3 className={cx('price')}>Giá vé: </h3>
                            <div className={cx('wrap-quantity')}>
                                <div className={cx('wrap-icon')} onClick={decreaseRegularTicket}>
                                    <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                </div>                                            
                                <div className={cx('count')}>{regularTicketCount}</div>
                                <div className={cx('wrap-icon')} onClick={increaseRegularTicket}>
                                <FontAwesomeIcon className={cx('icon-plus', )} icon={faPlus} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('ticket','vip')}>
                        <h2>VÉ VIP</h2>
                        <div className={cx('price-quantity')}>
                            <h3 className={cx('price')}>Giá vé: </h3>
                            <div className={cx('wrap-quantity')}>
                            <div className={cx('wrap-icon')} onClick={decreaseVipTicket}>
                                    <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                </div>                                            
                                <div className={cx('count')}>{vipTicketCount}</div>
                                <div className={cx('wrap-icon')} onClick={increaseVipTicket}>
                                <FontAwesomeIcon className={cx('icon-plus', )} icon={faPlus} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ghe */}
            <div className={cx('seat')}>
                <div className={cx('wrap-seat')}>
                    <div className={cx('screen')}>
                        <img src={images.screen} className={cx('screen-img')} alt="Screen" />
                        <h2>MÀN HÌNH</h2>
                    </div>
                    <div className={cx('all-seat')}>
                        <div className='row'>
                            <div className='col-2'></div>
                            <div className='col-8'>
    {seatRows.map((rowName, rowIndex) => {
        // Tìm các ghế trong hàng hiện tại
        const availableSeatsInRow = seats.filter(seat => seat.seat_number.startsWith(rowName));

        return (
            <div key={rowIndex} className={cx('group-seat')}>
                <div className={cx('seat-name', 'me-4')}>{rowName}</div>
                <div className={cx('group-btn-seat')}>
                    {availableSeatsInRow.map((seatInfo) => {
                        const seatNumber = seatInfo.seat_number; // Số ghế từ seatInfo

                        return (
                            <button
                                key={seatNumber}
                                type="button"
                                className={cx('num-seat', {
                                    'vip-seat': seatInfo.seat_type === 'vip' || seatInfo.seat_type === 'Vip',
                                    'selected-seat': selectedSeats.includes(seatNumber),
                                    'occupied': seatInfo.seat_status, // Thêm lớp cho ghế đã được đặt
                                })}
                                style={{
                                    backgroundColor: selectedSeats.includes(seatNumber)
                                        ? '#F9E400' // Màu vàng cho ghế đã chọn
                                        : seatInfo.seat_status // Nếu ghế đã được đặt
                                            ? '#f5004f' // Màu cho ghế đã đặt
                                            : '', // Màu mặc định
                                    color: (seatInfo.seat_status) ? '#000' : '',
                                }}
                                onClick={() => {
                                    // Chỉ cho phép chọn ghế chưa được đặt
                                    if (!seatInfo.seat_status) {
                                        handleSeatClick(seatNumber);
                                    }
                                }}
                                disabled={seatInfo.seat_status} // Vô hiệu hóa nút cho ghế đã đặt
                            >
                                {seatNumber}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    })}
</div>

                            <div className='col-2'></div>
                        </div>
                    </div>

                </div>
                <div className={cx('type-seat')}>
                    <div className='row'>
                        <div className='col-1'></div>
                            <div className={cx('wrap-type','col-10')}>
                                <div className={cx('status-seat')}>
                                    <div className={cx('btn-casual')} style={{ backgroundColor: '#d9d9d9' }}></div>
                                    <h3>Ghế thường</h3>
                                </div>
                                <div className={cx('status-seat')}>
                                    <div className={cx('btn-vip')} style={{ backgroundColor: '#FFAF00' }}></div>
                                    <h3>Ghế VIP</h3>
                                </div>
                                <div className={cx('status-seat')}>
                                    <div className={cx('btn-choose')} style={{ backgroundColor: '#F9E400' }}></div>
                                    <h3>Ghế chọn</h3>
                                </div>
                                <div className={cx('status-seat')}>
                                    <div className={cx('btn-placed')} style={{ backgroundColor: '#F5004F' }}></div>
                                    <h3>Ghế đã đặt</h3>
                                </div>
                            </div>
                        <div className='col-1'></div>
                    </div>
                </div>
            </div>
            <div className={cx('food')}>
                <h1>CHỌN BẮP NƯỚC</h1>
                <div className={cx('wrap-food'  )}>
                    <h2 className={cx('name-food')}>TÊN LOẠI HÀNG</h2>
                    <div className={cx('wrap-item')}>
                    <div className='row'>
                        <div className='col-1'></div>
                        <div className={cx('item-food','col-10')}>  
                            
                            <div className={cx('item-detail')}>
                                <img src={images.food} className={cx('img-food')} alt="" />
                                <div className={cx('food-info','ms-3')}>
                                    <h3 className={cx('food-name')}>TÊN ĐỒ ĂN: </h3>
                                    <div className={cx('des')}>Mô tả (nếu có): </div>
                                    <div className={cx('price')}>Giá: </div>
                                    <div className={cx('wrap-quantity')}>
                                        <div className={cx('wrap-icon-food')}>
                                            <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                        </div>                                            
                                        <div className={cx('count')}>0</div>
                                        <div className={cx('wrap-icon-food')}>
                                            <FontAwesomeIcon className={cx('icon-plus', )} icon={faPlus} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('item-detail')}>
                                <img src={images.food} className={cx('img-food')} alt="" />
                                <div className={cx('food-info','ms-3')}>
                                    <h3 className={cx('food-name')}>TÊN ĐỒ ĂN: </h3>
                                    <div className={cx('des')}>Mô tả (nếu có): </div>
                                    <div className={cx('price')}>Giá: </div>
                                    <div className={cx('wrap-quantity')}>
                                        <div className={cx('wrap-icon-food')} onClick={decreaseFood}>
                                            <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                        </div>                                            
                                        <div className={cx('count')}>{FoodCount}</div>
                                        <div className={cx('wrap-icon-food')} onClick={increaseFood}>
                                            <FontAwesomeIcon className={cx('icon-plus', )} icon={faPlus} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('item-detail')}>
                                <img src={images.food} className={cx('img-food')} alt="" />
                                <div className={cx('food-info','ms-3')}>
                                    <h3 className={cx('food-name')}>TÊN ĐỒ ĂN: </h3>
                                    <div className={cx('des')}>Mô tả (nếu có): </div>
                                    <div className={cx('price')}>Giá: </div>
                                    <div className={cx('wrap-quantity')}>
                                        <div className={cx('wrap-icon-food')}>
                                            <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                        </div>                                            
                                        <div className={cx('count')}>0</div>
                                        <div className={cx('wrap-icon-food')}>
                                            <FontAwesomeIcon className={cx('icon-plus', )} icon={faPlus} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className='col-1'></div>
                    </div>

                    </div>
                </div>             
            </div>
            <div className={cx('order', { 'fixed': showOrderDetail })}>
            <div className='row'>
                <div className='col-1'></div>
                <div className='col-6'>
        

            <div className={cx('order-detail')}>
                <h1 className={cx('title')}>Tên phim: {title}</h1>
                <div className={cx('address-type', 'd-flex')}>
                    <div className={cx('address', 'me-5')}>Địa chỉ rạp: Q8, HCM</div>
                    <div className={cx('type-ticket')}>Loại vé: {vipTicketCount > 0 ? 'VIP' : 'Thường'}</div>
                </div>
                <div className={cx('room-seat-time', 'd-flex')}>
                    <div className={cx('room', 'me-5')}>Phòng chiếu: 2</div>
                    <div className={cx('number-seat', 'me-5')}>Số ghế: {selectedSeats.join(', ')}</div>
                    <div className={cx('time')}>Thời gian chiếu: 8:00</div>
                </div>
                <div className={cx('food-order')}>Đồ ăn: {FoodCount} món</div>
            </div>
        </div>
        <div className='col-4'>
            <div className={cx('total', 'me-5')}>
            <h2 className={cx('total-price')}>Tạm tính: {totalPrice.toLocaleString()} VNĐ</h2>
            <button type='button' className={cx('booking-btn')}>Đặt vé</button>
            </div>
        </div>
        <div className='col-1'></div>

    </div>
            </div>
        </div>
    );
}

export default BookTicket;




