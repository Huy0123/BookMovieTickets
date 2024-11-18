import classNames from 'classnames/bind';
import styles from './BookTicket.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { useParams, useNavigate, useLocation   } from 'react-router-dom';
import { useState, useEffect,useRef  } from 'react';
import { faClock, faClosedCaptioning, faEarthAsia, faMinus, faPlus, faTag, faTv, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import TrailerModal from '../Trailer/TrailerModal';
import { useAuth } from '~/contexts/AuthContext';
const cx = classNames.bind(styles);
function BookTicket() {
    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const scheduleRef  = useRef(null); // Create a ref for the seat selection area
    const [hour,setHour] = useState('')
    const [getMovies,setMovies]=useState([])
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [FoodCount, setFoodCount] = useState([]);
    const [title,setTitle] = useState('')
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [seats, setSeats] = useState([]);
    const [showTime, setShowTime] = useState('');
    const [showTimeAll, setShowTimeAll] = useState([]);
    const [address,setAddress]=useState('');
    const [nameCinema,setNameCinema]=useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [Food,setFood]=useState([])   
    const [showTimeId, setShowTimeId] = useState([]);
    const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(''); // Thay đổi thành thời gian chiếu được chọn
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState(''); // State để lưu link trailer
    const [seatid,setSeatid]= useState([])
    const [foodId, setFoodId] = useState([]); 
    const [foodin4, setFoodin4] = useState([]);
    const [cinemaid, setCinemaid]= useState('');
    const [roomid,setRoomId] = useState('')
    const [price,setPrice] = useState('')
    const [genre,setGenre]=useState('')
    const [duration, setDuration] = useState('')
    const [country, setCountry]=useState('');
    const [subtitles,setSubtitles]=useState('');
    const [limit,setLimit]=useState('');
    const [director,setDirector]=useState('');
    const [cast,setCast]=useState('');
    const [releaseDate, setReleaseDate]=useState('');
    const [description, setDescription]=useState('');
    const [trailer,setTrailer] = useState('');
    const [poster,setPoster]= useState('');
    const [movie2,setMovie2]= useState('')
    const navigate = useNavigate();
    let lastDisplayedDate = '';
    const user_id = localStorage.getItem('user_id')
    console.log("user_id: ",user_id)
    const movie_id =useParams().id; 
    const location = useLocation();
    const { showtimeId,cinema_id } = location.state || {}; // Lấy showtimeId từ state
    const { isAuthenticated } = useAuth();
    console.log("showtimeId:", showtimeId);
    console.log(movie_id)
    const openModal = (link) => {
        setTrailerUrl(link);
        setIsModalOpen(true);
        console.log("link",link)
    };
    const handleShowtimeClick = async (showtimeId, cinema_id, price) => {
        console.log("showtimeIdshowtimeId",showtimeId)
        try {
            const seatsRes = await axios.get(`http://localhost:8080/v1/getSeatTimeByShowtimeID/${showtimeId}`);
            console.log("seas",seatsRes.data)  
            setSeats(seatsRes.data.seatTimes);
            setSelectedShowtimeId(showtimeId);
            setCinemaid(cinema_id);
            setPrice(price);
            const show = await axios.get(`http://localhost:8080/v1/getShowtimeByID/${showtimeId}`);
            console.log("show",show.data)
            console.log("show231232132",show.data.cinema_id.name);
            setNameCinema(show.data.cinema_id.name);
            setRoomId(show.data.room_id.name);
            const selectedShowtimeData = seatsRes.data;
            console.log("anhyem",selectedShowtimeData)
            if (selectedShowtimeData) {
                const formattedTime = new Date(selectedShowtimeData.showtime_start).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
                console.log("l1232132132131 l",formattedTime);
                setSelectedShowtime(formattedTime);
            }
        } catch (error) {
            console.error("Error fetching seats data:", error);
        }
    };

    useEffect(() => {
    const getMovieByID = async () => {
        if(cinema_id){
            try{
                const res = await axios.get(`http://localhost:8080/v1/getShowtimeByMovieFromCinemaId/${movie_id}/${cinema_id}`);
                if (res.data.length > 0) {
                console.log("hqewrgeyuqt",res.data)
                setMovies(res.data);
                setTitle(res.data[0].movie_id.title);
                setGenre(res.data[0].movie_id.genre);
                setDuration(res.data[0].movie_id.duration);
                setCountry(res.data[0].movie_id.country);
                setSubtitles(res.data[0].movie_id.subtitles);
                setLimit(res.data[0].movie_id.limit);
                setDirector(res.data[0].movie_id.director);
                setCast(res.data[0].movie_id.cast);
                setReleaseDate(res.data[0].movie_id.release_date);
                setDescription(res.data[0].movie_id.description);
                setTrailer(res.data[0].movie_id.trailer);
                setPoster(res.data[0].movie_id.poster2);      
                }else{
                    getMovie2();
                }       
            }catch (error) {
                console.error("Error fetching data:", error);
            }
        }else{
        try {
            const res = await axios.get(`http://localhost:8080/v1/getShowtimeByMovieID/${movie_id}`);
            
            if (res.data.length > 0) {
                // Nếu có suất chiếu
                const movie = res.data.map(item => item);
                console.log("ggggggggggg",movie)
                setMovies(res.data);
                setTitle(movie[0].movie_id.title);
                setGenre(movie[0].movie_id.genre);
                setDuration(movie[0].movie_id.duration);
                setCountry(movie[0].movie_id.country);
                setSubtitles(movie[0].movie_id.subtitles);
                setLimit(movie[0].movie_id.limit);
                setDirector(movie[0].movie_id.director);
                setCast(movie[0].movie_id.cast);
                setReleaseDate(movie[0].movie_id.release_date);
                setDescription(movie[0].movie_id.description);
                setTrailer(movie[0].movie_id.trailer);
                setPoster(movie[0].movie_id.poster2);
                
            } else {
                // Nếu không có suất chiếu thì gọi hàm getMovie2 để lấy thông tin cơ bản của phim
                getMovie2();
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    };

    const getFood = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/Food/getFood');
            setFood(response.data.Food);
            setFoodCount(Array(response.data.Food.length).fill(0));
        } catch (error) {
            console.error("Error fetching food:", error);
        }
    };

    const getMovie2 = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/v1/getMovieByID/${movie_id}`);
            const movie = res.data;
            console.log("Data from getMovieByID:", movie);
            setMovie2(res.data);
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    };

    getFood();
    getMovieByID();
}, [movie_id]);


    useEffect(() => {
        if (showTimeId) {
            // Scroll to seat selection area when showtimeId exists
            if (scheduleRef.current) {
                scheduleRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If no showtimeId, do not scroll or show seat selection
            console.log("No showtimeId available.");
        }
    }, [showtimeId, cinema_id, price]);

    const handleBooking = () => {
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để tiếp tục.");
            navigate('/signin'); 
            return;
        }

        // Kiểm tra nếu không có ghế nào được chọn
        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế trước khi tiếp tục.");
            return; 
        }

        const orderDetails = {
            title,
            nameCinema,
            roomid,
            selectedSeats,
            selectedShowtime,   
            totalFoodCount,
            totalPrice,
            selectedShowtimeId,
            seatid,
            foodId,
            FoodCount
        };

        console.log(orderDetails);

        // Chuyển qua trang thanh toán với thông tin đơn hàng
        navigate('/payment', { state: orderDetails });
    };

    const handleSeatClick = (seat, seatId) => {
        setSelectedSeats((prevSelectedSeats) => {
const isSelected = prevSelectedSeats.includes(seat);
            const updatedSeats = isSelected
                ? prevSelectedSeats.filter((s) => s !== seat) // Bỏ chọn nếu đã chọn
                : [...prevSelectedSeats, seat]; // Thêm nếu chưa chọn
    
            // Cập nhật showOrderDetail dựa trên updatedSeats
            setShowOrderDetail(updatedSeats.length > 0); // Hiển thị order khi có ghế được chọn
    
            return updatedSeats; // Trả về danh sách ghế cập nhật
        });
    
        // Cập nhật seatIds tương ứng
        setSeatid((prevSeatIds) => {
            const isSeatIdSelected = prevSeatIds.includes(seatId);
            return isSeatIdSelected
                ? prevSeatIds.filter((id) => id !== seatId) // Bỏ chọn nếu đã chọn
                : [...prevSeatIds, seatId]; // Thêm nếu chưa chọn
        });
    };
    
    
   
    const increaseFood = (index, foodid) => {
        setFoodCount((prevCounts) => {
            const newCounts = [...prevCounts];
            newCounts[index] += 1; // Tăng số lượng cho món ăn cụ thể
    
            // Cập nhật foodId
            setFoodId((prevFoodIds) => {
                // Kiểm tra xem foodId đã có trong mảng chưa
                const existingFoodId = prevFoodIds.find(item => item.foodid === foodid);
                if (!existingFoodId) {
                    // Nếu foodId chưa có, thêm mới
                    return [...prevFoodIds, { foodid, count: newCounts[index] }]; // Lưu số lượng
                } else {
                    // Nếu foodId đã có, cập nhật số lượng
                    return prevFoodIds.map(item => 
                        item.foodid === foodid ? { ...item, count: newCounts[index] } : item
                    );
                }
            });
    
            return newCounts; // Trả về mảng số lượng cập nhật
        });
    };
    
    
    
    

    

    
    const closeModal = () => setIsModalOpen(false);
    const decreaseFood = (index, foodid) => {
        setFoodCount((prevCounts) => {
            const newCounts = [...prevCounts];
            if (newCounts[index] > 0) {
                newCounts[index] -= 1; // Giảm số lượng cho món ăn cụ thể
    
                // Cập nhật foodId
                setFoodId((prevFoodIds) => {
                    if (newCounts[index] === 0) {
                        // Nếu số lượng là 0, xóa foodId
                        return prevFoodIds.filter(item => item.foodid !== foodid);
                    }
                    // Nếu số lượng > 0, giữ nguyên foodId
                    return prevFoodIds.map(item => 
                        item.foodid === foodid ? { ...item, count: newCounts[index] } : item
                    );
                });
            }
            return newCounts; // Trả về mảng số lượng đã cập nhật
        });
    };
    

    const totalFoodCount = FoodCount.reduce((total, count) => total + count, 0);
    
    const getShowTimesByDate = (date) => {
        return getMovies.filter(show => {
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
    const seatInfo = seats.find(s => s.seat_id.seat_number === seat); // Tìm ghế trong danh sách
    console.log("seat",seatInfo);
    if (seatInfo && typeof seatInfo.seat_id.price === 'number') {
        return total + seatInfo.seat_id.price; // Thêm giá của ghế vào tổng
    }
    return total; // Nếu không tìm thấy ghế, trả lại tổng hiện tại
}, 0);

// Tính tổng tất cả
const totalPrice = totalSeatPrice + totalFoodPrice; // Tổng giá ghế và giá đồ ăn
console.log(totalFoodPrice);   
if(title!==''){
        return (
        <div className={cx('container')}>
            <div className={cx('info-movie')}>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className={cx('content-movie','col-10')}>
                        <div className='row'>
                            <img src={poster} className={cx('d-block','col-4')} alt="" />
                            <div className={cx('col-8')}>
                                <div className={cx('wrap-info','ms-5','mt-4','pt-1')}>
                                    <h1 id="title"  className={cx('title')}>Tên phim: {title}</h1>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faTag} />
                                        <div className={cx('type')}>Thể loại: {genre}</div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClock} />
                                        <div className={cx('duration')}>Thời gian: {duration} phút </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faEarthAsia} />
                                        <div className={cx('country')}>Quốc gia: {country}</div>
                                    </div>
                                    <div className='info-group d-flex'>
<FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClosedCaptioning} />
                                        <div className={cx('sub')}>Phụ đề: {subtitles}</div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faUserCheck} />
                                        <div className={cx('limit')}>
                                            Nhãn phim: {limit ? `${limit}+` : ''}
                                        </div>

                                    </div>
                                </div> 
                                                      {/* Thông tin */}
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}> Mô Tả </h1>
                                    <div className='info-group '>
                                        <div className={cx('director')}>Đạo diễn: {director}</div>
                                    </div>
                                    <div className='info-group '>
                                        <div className={cx('performer')}>Diễn viên:  {cast}</div>
                                    </div>
                                    <div className='info-group'>
                                        <div className={cx('premiere')}>Khởi chiếu:  { new Date(releaseDate).toLocaleString()}</div>
                                    </div>
                                    
                                </div>  
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}>Nội Dung Phim</h1>
                                    <div className={cx('description')}> {description} </div>                                                                     
                                </div>
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <div className='info-group d-flex' >
                                        <FontAwesomeIcon className={cx('icon-trailer','pe-2','pt-1')} icon={faTv} />
                                        <div className={cx('trailer')} style={{ textDecoration: 'underline',cursor:'pointer' }} onClick={() => openModal(trailer)}>Xem Trailer</div>
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
            <div className={cx('schedule')} ref={scheduleRef}>
    <div className="row">
        <div className="col-1"></div>
        <div className={cx('wrap', 'col-10')}>
            <h1 className={cx('show')}>Lịch chiếu</h1>
            <div className={cx('group-btn')}>
                <div className={cx('date-show', 'gap-3')}>
                {getMovies.length === 0 ? (
                    <h2>HIỆN TẠI KHÔNG CÓ LỊCH CHIẾU</h2>
                ) : (
                    getMovies
                        // Lọc lịch chiếu từ hôm nay trở về sau
                        .filter((show) => {
                            const showtimeDate = new Date(show.showtime_start);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Đặt giờ của hôm nay về 0:00:00
                            return showtimeDate >= today; // Chỉ lấy lịch chiếu từ hôm nay trở về sau
                        })
                        // Sắp xếp lịch chiếu theo thời gian tăng dần
                        .sort((a, b) => new Date(a.showtime_start) - new Date(b.showtime_start))
                        .map((show, index) => {
                            const showtimeUTC = new Date(show.showtime_start);
                            const formattedShowtime = showtimeUTC
                                .toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    weekday: 'long',
                                })
                                .replace(/-/g, '/');

                            if (formattedShowtime !== lastDisplayedDate) {
                                lastDisplayedDate = formattedShowtime;
                                return (
                                    <div
                                        className={cx('btn-date', {
                                            active: selectedDate === formattedShowtime,
                                        })}
                                        key={show._id}
                                        onClick={() => setSelectedDate(formattedShowtime)}
                                    >
                                        <h2 className={cx('date', 'pt-1')}>{formattedShowtime}</h2>
                                    </div>
                                );
                            }
                            return null;
                        })
                )}

                </div>
            </div>
            <div className={cx('about')}>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10">
                        <div className={cx('time-start')}>
                            {selectedDate && !Array.isArray(getShowTimesByDate(selectedDate)) ? (
                                <div>HIỆN TẠI KHÔNG CÓ LỊCH CHIẾU</div>
                            ) : (
                                selectedDate &&
                                (Array.isArray(getShowTimesByDate(selectedDate))
                                    ? Object.values(
                                          getShowTimesByDate(selectedDate).reduce((acc, show) => {
                                              const key = show.cinema_id._id; // Lấy ID của rạp làm key
                                              if (!acc[key]) {
                                                  acc[key] = {
                                                      cinema: show.cinema_id,
                                                      showtimes: [],
                                                  };
                                              }
                                              acc[key].showtimes.push(show);
                                              return acc;
                                          }, {})
                                      ).map((cinemaGroup, index) => {
                                          return (
                                              <div key={cinemaGroup.cinema._id}>
                                                  <h4>Tên Rạp: {cinemaGroup.cinema.name}</h4>
                                                  <h4>Địa chỉ: {cinemaGroup.cinema.address}</h4>
                                                  <div>
                                                      {cinemaGroup.showtimes.map((show, index) => {
                                                          const showtimeUTC = new Date(show.showtime_start);
                                                          const formattedHour = showtimeUTC.toLocaleTimeString('vi-VN', {
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                              hour12: false,
                                                          });

                                                          return (
                                                              <button
                                                                  key={show._id}
                                                                  type="button"
                                                                  className={cx('btn-time', {
                                                                      active: index === 0,
                                                                  })}
                                                                  onClick={() => {
                                                                      handleShowtimeClick(
                                                                          show._id,
                                                                          show.cinema_id,
                                                                          show.room_id
                                                                      );
                                                                      setHour(formattedHour);
                                                                  }}
                                                              >
                                                                  {formattedHour}
                                                              </button>
                                                          );
                                                      })}
                                                  </div>
                                              </div>
                                          );
                                      })
                                    : <div>Hiện không có suất chiếu cho ngày này.</div>)
                            )}
                        </div>
                    </div>
                    <div className="col-1"></div>
                </div>
            </div>
        </div>
        <div className="col-1"></div>
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
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-8">
                            {seatRows.map((rowName, rowIndex) => {
                                const availableSeatsInRow = seats.filter(seat => 
                                    seat.seat_id && 
                                    seat.seat_id.seat_number.startsWith(rowName) 
                                );

                                return (
                                    <div key={rowIndex} className={cx('group-seat')}>
                                        <div className={cx('seat-name', 'me-4')}>{rowName}</div>
                                        <div className={cx('group-btn-seat')}>
                                            {availableSeatsInRow.map(seatInfo => {
                                                const seatNumber = seatInfo.seat_id.seat_number;
                                                const seatId = seatInfo.seat_id._id;
                                                const seatPrice = seatInfo.seat_id.price;

                                                return (
                                                    <button
                                                        key={seatNumber}
                                                        type="button"
                                                        className={cx('num-seat', {
                                                            'vip-seat': seatInfo.seat_id.seat_type.toLowerCase() === 'vip',
                                                            'selected-seat': selectedSeats.includes(seatNumber),
                                                            'occupied': seatInfo.seat_status,
                                                        })}
                                                        style={{
                                                            backgroundColor: selectedSeats.includes(seatNumber) ? '#F9E400' : seatInfo.seat_status ? '#f5004f' : '',
                                                            color: seatInfo.seat_status ? '#000' : '',
                                                        }}
                                                        onClick={() => {
                                                            if (!seatInfo.seat_status) {
                                                                handleSeatClick(seatNumber, seatId, seatPrice);
                                                            }
                                                        }}
                                                        disabled={seatInfo.seat_status}
                                                        aria-label={`Seat ${seatNumber} ${seatInfo.seat_status ? 'occupied' : 'available'}`}
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
                        <div className="col-2"></div>
                    </div>
                </div>
            </div>

            {/* Seat type legend */}
            <div className={cx('type-seat')}>
                <div className="row">
                    <div className="col-1"></div>
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
                    <div className="col-1"></div>
                </div>
            </div>
        </div>
    )}

            <div className={cx('food')}>
                <h1>CHỌN BẮP NƯỚC</h1>

                <div className={cx('wrap-food')}>
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
                                            <div className={cx('wrap-icon-food')} onClick={() => {decreaseFood(index,Element._id)} }>
                                                <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                            </div>
                                            <div className={cx('count')}>{FoodCount[index]}</div>
                                            <div className={cx('wrap-icon-food')} onClick={() => increaseFood(index,Element._id)}>
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
                <h1 className={cx('title')}>Tên phim: {title}</h1>
                <div className={cx('address-type', 'd-flex')}>
                    <div className={cx('address', 'me-5')}>Tên rạp: {nameCinema}</div>
                </div>
                <div className={cx('room-seat-time', 'd-flex')}>
                    <div className={cx('room', 'me-5')}>Phòng chiếu: {roomid}</div>
                    <div className={cx('number-seat', 'me-5')}>Số ghế: {selectedSeats.join(', ')}</div>
<div className={cx('time')}>Thời gian chiếu: {hour || 'Chưa chọn'}</div>
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
else{
    return (
        <div className={cx('container')}>
            <div className={cx('info-movie')}>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className={cx('content-movie','col-10')}>
                        <div className='row'>
                            <img src={movie2.poster2} className={cx('d-block','col-4')} alt="" />
                            <div className={cx('col-8')}>
                                <div className={cx('wrap-info','ms-5','mt-4','pt-1')}>
                                    <h1 id="title"  className={cx('title')}>Tên phim: {movie2.title}</h1>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faTag} />
                                        <div className={cx('type')}>Thể loại: {movie2.genre}</div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClock} />
                                        <div className={cx('duration')}>Thời gian: {movie2.duration} phút </div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faEarthAsia} />
                                        <div className={cx('country')}>Quốc gia: {movie2.country}</div>
                                    </div>
                                    <div className='info-group d-flex'>
<FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={faClosedCaptioning} />
                                        <div className={cx('sub')}>Phụ đề: {movie2.subtitles}</div>
                                    </div>
                                    <div className='info-group d-flex'>
                                        <FontAwesomeIcon className={cx('icon-info','pe-2','pt-1')} icon={movie2.faUserCheck} />
                                        <div className={cx('limit')}>
                                            Nhãn phim: {movie2.limit ? `${movie2.limit}+` : ''}
                                        </div>

                                    </div>
                                </div> 
                                                      {/* Thông tin */}
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}> Mô Tả </h1>
                                    <div className='info-group '>
                                        <div className={cx('director')}>Đạo diễn: {movie2.director}</div>
                                    </div>
                                    <div className='info-group '>
                                        <div className={cx('performer')}>Diễn viên:  {movie2.cast}</div>
                                    </div>
                                    <div className='info-group'>
                                        <div className={cx('premiere')}>Khởi chiếu:  {new Date(movie2.release_date).toLocaleDateString()}</div>
                                    </div>
                                    
                                </div>  
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <h1 className={cx('title')}>Nội Dung Phim</h1>
                                    <div className={cx('description')}> {movie2.description} </div>                                                                     
                                </div>
                                <div className={cx('wrap-info','ms-5','mt-4')}>
                                    <div className='info-group d-flex' >
                                        <FontAwesomeIcon className={cx('icon-trailer','pe-2','pt-1')} icon={faTv} />
                                        <div className={cx('trailer')} style={{ textDecoration: 'underline',cursor:'pointer' }} onClick={() => openModal(movie2.trailer)}>Xem Trailer</div>
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
                        <h2>HIỆN TẠI CHƯA CÓ LỊCH CHIẾU</h2>
                  
                </div>
            </div>
        </div>
        <div className='col-1'></div>
    </div>
</div>


          
            {/* ghe */}
   

          
           
        </div>
    );
}
}

export default BookTicket;