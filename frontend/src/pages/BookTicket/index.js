import classNames from 'classnames/bind';
import styles from './BookTicket.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { useParams, useNavigate   } from 'react-router-dom';
import React, { useEffect,useState} from 'react';
import { faClock, faClosedCaptioning, faEarthAsia, faMinus, faPlus, faTag, faTv, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import TrailerModal from '../Trailer/TrailerModal';

const cx = classNames.bind(styles);
function BookTicket() {
    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const [getMovies,setMovies]=useState([])
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [regularTicketCount, setRegularTicketCount] = useState(0);
    const [vipTicketCount, setVipTicketCount] = useState(0);
    const [FoodCount, setFoodCount] = useState([]);
    const [title,setTitle] = useState("")
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [seats, setSeats] = useState([]);
    const [showTime, setShowTime] = useState('');
    const [showTimeAll, setShowTimeAll] = useState([]);
    const [address,setAddress]=useState('');
    const [nameCinema,setNameCinema]=useState('');
    const [room,setRoom]=useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [Food,setFood]=useState([])   
    const [showTimeId, setShowTimeId] = useState([]);
    const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(''); // Thay đổi thành thời gian chiếu được chọn
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState(''); // State để lưu link trailer

    const navigate = useNavigate();
    let lastDisplayedDate = '';
    const user_id = localStorage.getItem('user_id')
    console.log("user_id: ",user_id)
    const movie_id =useParams().id; 
    console.log(movie_id)
    const openModal = (link) => {
        setTrailerUrl(link);
        setIsModalOpen(true);
        console.log("link",link)
    };
    useEffect(() => {
        const getMovieByID = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/v1/getMovieByID/${movie_id}`);
                setMovies(res.data);
                console.log("Movie Details:", res.data);
                
                const showtimeall = await axios.get('http://localhost:8080/v1/getShowtimes');
                setShowTimeAll(showtimeall.data);
                
                console.log("All Showtimes:", showtimeall.data);

                const showtimeData = showtimeall.data.map(async (st) => {
                    const showtimeRes = await axios.get(`http://localhost:8080/v1/getShowtimeByID/${st._id}`);
                    const seatsRes = await axios.get(`http://localhost:8080/v1/getSeatTimeByShowtimeID/${st._id}`);
                    console.log("Seats for Showtime ID:", st._id, seatsRes.data);
                    return { showtime: showtimeRes.data, seats: seatsRes.data };
                });

                const showtimeDetail = await Promise.all(showtimeData);
                setShowTimeId(showtimeDetail);
                console.log("Individual Showtimes with Seats:", showtimeDetail);
                
                if (showtimeDetail.length > 0) {
                    setAddress(showtimeDetail[0].showtime.cinema_id.address);
                    setNameCinema(showtimeDetail[0].showtime.cinema_id.name);
                    setRoom(showtimeDetail[0].showtime.room_id.name);
                   
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const getFood = async () => {
            try {
                const response = await axios.get('http://localhost:8080/v1/Food/getFood');
                setFood(response.data.Food);
                setFoodCount(Array(response.data.Food.length).fill(0));
                console.log("Food:", response.data.Food);
            } catch (error) {
                console.error("Error fetching food:", error);
            }
        };

        getFood();
        getMovieByID();
        
    }, [movie_id]);

    const handleShowtimeClick = async (showtimeId) => {
        setSelectedShowtimeId(showtimeId);
        const seatsRes = await axios.get(`http://localhost:8080/v1/getSeatTimeByShowtimeID/${showtimeId}`);
        setSeats(seatsRes.data);

        // Lưu thời gian chiếu được chọn
        const selectedShowtimeData = showTimeId.find(showtime => showtime.showtime._id === showtimeId);
        if (selectedShowtimeData) {
            const showtimeUTC = new Date(selectedShowtimeData.showtime.showtime_start);
            const formattedTime = showtimeUTC.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
            setSelectedShowtime(formattedTime); // Lưu thời gian chiếu
        }
    };
    
    const handleBooking = () => {
        const orderDetails = {
            title: getMovies.title,
            address,
            room,
            selectedSeats,
            selectedShowtime,   
            totalFoodCount,
            totalPrice
        };
        console.log(orderDetails);
        navigate('/payment', { state: orderDetails }); // 
    };
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
    

   
    const increaseFood = (index) => {
        setFoodCount((prevCounts) => {
            const newCounts = [...prevCounts];
            newCounts[index] += 1; // Tăng số lượng cho món ăn cụ thể
            return newCounts;
        });
    };

    
    const closeModal = () => setIsModalOpen(false);
    const decreaseFood = (index) => {
        setFoodCount((prevCounts) => {
            const newCounts = [...prevCounts];
            if (newCounts[index] > 0) {
                newCounts[index] -= 1; // Giảm số lượng cho món ăn cụ thể
            }
            return newCounts;
        });
    };

    const totalFoodCount = FoodCount.reduce((total, count) => total + count, 0);
    
    const getShowTimesByDate = (date) => {
        return showTimeAll.filter(show => {
            const showtimeUTC = new Date(show.showtime_start);
            // showtimeUTC.setHours(showtimeUTC.getHours() + 7);
            const formattedShowtime = showtimeUTC.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                weekday: 'long'
            }).replace(/-/g, '/'); 
            return formattedShowtime === date;
        });
    };
    // Giả sử mỗi hàng có 12 ghế, bạn có thể điều chỉnh số ghế theo nhu cầu
// Tính tổng giá đồ ăn
const totalFoodPrice = Food.reduce((total, food, index) => {
    return total + (FoodCount[index] * food.price); // Tổng giá của tất cả món ăn
}, 0);

// Tính tổng giá ghế
const totalSeatPrice = selectedSeats.reduce((total, seat) => {
    const seatInfo = seats.find(s => s.seat_number === seat); // Tìm ghế trong danh sách
    if (seatInfo && typeof seatInfo.price === 'number') {
        return total + seatInfo.price; // Thêm giá của ghế vào tổng
    }
    return total; // Nếu không tìm thấy ghế, trả lại tổng hiện tại
}, 0);

// Tính tổng tất cả
const totalPrice = totalSeatPrice + totalFoodPrice; // Tổng giá ghế và giá đồ ăn
console.log(totalFoodPrice);

console.log(totalFoodPrice)
        return (
        <div className={cx('container')}>
            <div className={cx('info-movie')}>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className={cx('content-movie','col-10')}>
                        <div className='row'>
                            <img src={getMovies.poster} className={cx('d-block','col-4')} alt="" />
                            <div className={cx('col-8')}>
                                <div className={cx('wrap-info','ms-5','mt-4','pt-1')}>
                                    <h1 id="title"  className={cx('title')}>Tên phim: {getMovies.title}</h1>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faTag} />
                                        <div className={cx('type')}>Thể loại: {getMovies.genre}</div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClock} />
                                        <div className={cx('duration')}>Thời gian: {getMovies.duration} phút </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faEarthAsia} />
                                        <div className={cx('country')}>Quốc gia: {getMovies.country}</div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClosedCaptioning} />
                                        <div className={cx('sub')}>Phụ đề: {getMovies.subtitles}</div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faUserCheck} />
                                        <div className={cx('limit')}>
                                            Nhãn phim: {getMovies.limit ? `${getMovies.limit}+` : ''}
                                        </div>

                                    </div>
                                </div> 
                                                      {/* Thông tin */}
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}> Mô Tả </h1>
                                    <div className='info-group '>
                                        <div className={cx('director')}>Đạo diễn: {getMovies.voice_actors}</div>
                                    </div>
                                    <div className='info-group '>
                                        <div className={cx('performer')}>Diễn viên:  {getMovies.cast}</div>
                                    </div>
                                    <div className='info-group'>
                                        <div className={cx('premiere')}>Khởi chiếu:  { new Date(getMovies.release_date).toLocaleString()}</div>
                                    </div>
                                    
                                </div>  
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}>Nội Dung Phim</h1>
                                    <div className={cx('description')}> {getMovies.description} </div>                                                                     
                                </div>
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <div className='info-group d-flex' >
                                        <FontAwesomeIcon className={cx('icon-trailer','pe-2','pt-1')} icon={faTv} />
                                        <div className={cx('trailer')} style={{ textDecoration: 'underline',cursor:'pointer' }} onClick={() => openModal(getMovies.trailer)}>Xem Trailer</div>
                                                     <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
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
                <div className={cx('wrap', 'col-10')}>
                    <h1 className={cx('show')}>Lịch chiếu</h1>
                    <div className={cx('group-btn')}>
                        <div className={cx('date-show', 'gap-3')}>
                            {showTimeAll.map((show, index) => {
                                const showtimeUTC = new Date(show.showtime_start);
                                {/* showtimeUTC.setHours(showtimeUTC.getHours() + 7); */}
                                const formattedShowtime = showtimeUTC.toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    weekday: 'long'
                                }).replace(/-/g, '/'); 

                                if (formattedShowtime !== lastDisplayedDate) {
                                    lastDisplayedDate = formattedShowtime; // Cập nhật ngày đã hiển thị
                                    return (
                                        <div 
                                            className={cx('btn-date', { active: selectedDate === formattedShowtime })} 
                                            key={show._id} 
                                            onClick={() => setSelectedDate(formattedShowtime)} // Cập nhật trạng thái
                                        >
                                            <h2 className={cx('date', 'pt-1')}>
                                                {formattedShowtime}
                                            </h2>
                                        </div>
                                    );
                                } 
                                return null;
                            })}
                        </div>
                    </div>
                    <div className={cx('about')}>
                        <div className='row'>
                            <div className='col-1'></div>
                            <div className='col-10'>
                                <h2>TÊN RẠP: {nameCinema}</h2>
                                <h3 className={cx('address')}>Địa chỉ: {address}</h3>
                                <div className={cx('time-start')}>
                                    {selectedDate && getShowTimesByDate(selectedDate).map((show, index) => {
                                        const showtimeUTC = new Date(show.showtime_start);
                                        {/* showtimeUTC.setHours(showtimeUTC.getHours() + 7); */}
                                        const formattedHour = showtimeUTC.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        });

                                        return (
                                            <button 
                                                type='button' 
                                                className={cx('btn-time', { active: index === 0 })} 
                                                key={show._id}
                                                onClick={() => handleShowtimeClick(show._id)}

                                            >
                                                {formattedHour}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className='col-1'></div>
                        </div>
                    </div>
                </div>
                <div className='col-1'></div>
            </div>
        </div>
          
            {/* ghe */}
            
            {selectedShowtimeId && (
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
                            // Find seats in the current row
                            const availableSeatsInRow = seats.filter(seat => seat.seat_number.startsWith(rowName));

                            return (
                                <div key={rowIndex} className={cx('group-seat')}>
                                    <div className={cx('seat-name', 'me-4')}>{rowName}</div>
                                    <div className={cx('group-btn-seat')}>
                                        {availableSeatsInRow.map((seatInfo) => {
                                            const seatNumber = seatInfo.seat_number;

                                            return (
                                                <button
                                                    key={seatNumber}
                                                    type="button"
                                                    className={cx('num-seat', {
                                                        'vip-seat': seatInfo.seat_type.toLowerCase() === 'vip',
                                                        'selected-seat': selectedSeats.includes(seatNumber),
                                                        'occupied': seatInfo.seat_status,
                                                    })}
                                                    style={{
                                                        backgroundColor: selectedSeats.includes(seatNumber)
                                                            ? '#F9E400' // Yellow for selected seats
                                                            : seatInfo.seat_status
                                                                ? '#f5004f' // Red for occupied seats
                                                                : '', // Default color
                                                        color: seatInfo.seat_status ? '#000' : '',
                                                    }}
                                                    onClick={() => {
                                                        if (!seatInfo.seat_status) {
                                                            handleSeatClick(seatNumber);
                                                        }
                                                    }}
                                                    disabled={seatInfo.seat_status} // Disable button for occupied seats
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
        
        {/* Seat type legend */}
        <div className={cx('type-seat')}>
            <div className='row'>
                <div className='col-1'></div>
                <div className={cx('wrap-type', 'col-10')}>
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
)}

            <div className={cx('food')}>
                <h1>CHỌN BẮP NƯỚC</h1>

                <div className={cx('wrap-food'  )}>
                    <h2 className={cx('name-food')}>TÊN LOẠI HÀNG</h2>
                    <div className={cx('wrap-item')}>
                    <div className='row'>
                        <div className='col-1'></div>
                        <div className={cx('item-food','col-10')}>  
                        {Food.length > 0 ? (
                            Food.map((Element, index) => (
                                <div key={Element._id} className={cx('item-detail')}>
                                    <img src={Element.Image} className={cx('img-food')} alt={Element.name} />
                                    <div className={cx('food-info', 'ms-3')}>
                                        <h3 className={cx('food-name')}>TÊN ĐỒ ĂN: {Element.name}</h3>
                                        <div className={cx('des')}>Loại: {Element.category}</div>
                                        <div className={cx('price')}>Giá: {Element.price.toLocaleString()} VNĐ</div>
                                        <div className={cx('wrap-quantity')}>
                                            <div className={cx('wrap-icon-food')} onClick={() => decreaseFood(index)}>
                                                <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                            </div>
                                            <div className={cx('count')}>{FoodCount[index]}</div>
                                            <div className={cx('wrap-icon-food')} onClick={() => increaseFood(index)}>
                                                <FontAwesomeIcon className={cx('icon-plus')} icon={faPlus} />
                                            </div>
                                        </div>
                                        <div className={cx('total-price')}>Tổng giá: {(FoodCount[index] * Element.price).toLocaleString()} VNĐ</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Đang tải dữ liệu món ăn...</p>
                        )}

                       
                            
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
                <h1 className={cx('title')}>Tên phim: {getMovies.title}</h1>
                <div className={cx('address-type', 'd-flex')}>
                    <div className={cx('address', 'me-5')}>Địa chỉ rạp: {address}</div>
                </div>
                <div className={cx('room-seat-time', 'd-flex')}>
                    <div className={cx('room', 'me-5')}>Phòng chiếu: {room}</div>
                    <div className={cx('number-seat', 'me-5')}>Số ghế: {selectedSeats.join(', ')}</div>
                    <div className={cx('time')}>Thời gian chiếu: {selectedShowtime || 'Chưa chọn'}</div>
                    </div>
                <div className={cx('food-order')}>Đồ ăn: {totalFoodCount} món</div>
            </div>
        </div>
        <div className='col-4'>
            <div className={cx('total', 'me-5')}>
            <h2 className={cx('total-price')}>Tạm tính: {totalPrice.toLocaleString()} VNĐ</h2>
            <button type='button' className={cx('booking-btn')} onClick={handleBooking}>
                Đặt vé
            </button>
            </div>
        </div>
        <div className='col-1'></div>

    </div>
            </div>
        </div>
    );
}

export default BookTicket;




