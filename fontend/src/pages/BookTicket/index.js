import classNames from 'classnames/bind';
import styles from './BookTicket.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { useParams } from 'react-router-dom';
import React, { useEffect,useState} from 'react';
import { faClock, faClosedCaptioning, faEarthAsia, faMinus, faPlus, faTag, faTv, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const cx = classNames.bind(styles);
function BookTicket() {
    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const [getMovies,setMovies]=useState([])
    const user_id = localStorage.getItem('user_id')
    console.log("user_id: ",user_id)
    const movie_id =useParams().id; 
    console.log(movie_id)
    useEffect(()=>{
        const getMovieByID = async()=>{
            try {
                const res = await axios.get(
                    `http://localhost:8080/v1/getMovieByID/${movie_id}`
                )
                console.log(res.data)
                setMovies(res.data); 
              
            } catch (error) {
                
            }
        }
        const getShowtime = async () => {
            try {
                const res = await axios.get(
                    
                )
            } catch (error) {
                
            }
        }
        getMovieByID();
    },[])
    
    
    // Giả sử mỗi hàng có 12 ghế, bạn có thể điều chỉnh số ghế theo nhu cầu
    const seatsPerRow = 12;

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
                                        <div className={cx('limit')}>Nhãn phim: </div>
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
                                <div className={cx('wrap-icon')}>
                                    <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                </div>                                            
                                <div className={cx('count')}>0</div>
                                <div className={cx('wrap-icon')}>
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
                            <div className={cx('wrap-icon')}>
                                    <FontAwesomeIcon className={cx('icon-minus')} icon={faMinus} />
                                </div>                                            
                                <div className={cx('count')}>0</div>
                                <div className={cx('wrap-icon')}>
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
                                {seatRows.map((rowName, rowIndex) => (
                                    <div key={rowIndex} className={cx('group-seat')}>
                                        <div className={cx('seat-name')}>{rowName}</div>
                                        <div className={cx('group-btn-seat')}>
                                            {Array.from({ length: seatsPerRow }, (_, seatIndex) => (
                                                <button 
                                                    key={seatIndex} 
                                                    type="button" 
                                                    className={cx('num-seat', {
                                                        'vip-seat': rowName >= 'D' && rowName <= 'J'
                                                    })}
                                                >
                                                    {rowName}{seatIndex + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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
            <div className={cx('order')}>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-6'>
                        <div className={cx('order-detail')}>
                            <h1 className={cx('title')}>Tên phim: Qủy đá ăn tạng</h1>
                            <div className={cx('address-type','d-flex')}>
                                <div className={cx('address','me-5')}>Địa chỉ rạp: Q8, HCM</div>
                                <div className={cx('type-ticket')}>Loại vé: VIP</div>
                            </div>
                            <div className={cx('room-seat-time','d-flex')}>
                                <div className={cx('room','me-5')}>Phòng chiếu: 2</div>
                                <div className={cx('number-seat','me-5')}>Số ghế: E1</div>
                                <div className={cx('time')}>Thời gian chiếu: 8:00</div>
                            </div>
                            <div className={cx('food-order')}>Đồ ăn: 1 con bò</div>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className={cx('total','me-5')}>
                            <h2 className={cx('total-price')}>Tạm tính: 1.000.000 VNĐ</h2>
                            <button type='button'className={cx('booking-btn')}>Đặt vé</button>
                        </div>
                    </div>
                    <div className='col-1'></div>
                </div>
            </div>
        </div>
    );
}

export default BookTicket;