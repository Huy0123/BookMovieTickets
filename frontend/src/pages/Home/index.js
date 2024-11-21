import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons'
import TrailerModal from '../Trailer/TrailerModal';
import axios from 'axios';
import images from '~/assets/img';
import { useNavigate } from 'react-router-dom';
import apiClient from "../../services/apiClient";
const cx = classNames.bind(styles);



function Home() {
    const [movies,setMovie]= useState([])
   
    const [moviesPerPage, setMoviesPerPage] = useState(4); // Default to 4 movies per page
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 576) {
                setMoviesPerPage(1);
            } else if (window.innerWidth < 992) {
                setMoviesPerPage(2);
            } else {
                setMoviesPerPage(4);
            }
        };
        const getHome = async()=>{
            const response = await axios.get('http://localhost:8080/v1/getMovies')
        
            setMovie(response.data)
            console.log(response.data)
            
        }
        getHome();
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set movies per page
        return () => {
            window.removeEventListener('resize', handleResize);
            
        };

       
    }, []);
    
    const movieshowing =movies.filter(movies=>new Date(movies.release_date)< new Date())
    console.log("movieshowing",movieshowing)
    const upcomingmovie =movies.filter(movies=>new Date(movies.release_date)> new Date())
    const totalPages = Math.ceil(movieshowing.length / moviesPerPage);
    const comingTotalPages = Math.ceil(upcomingmovie.length / moviesPerPage);
    const newmovie = (movieshowing.sort((a,b)=> new Date(b.release_date) - new Date(a.release_date))).slice(0,3)
    console.log("newmovie",newmovie)

   

    const openModal = (link) => {
        setTrailerUrl(link);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const [trailerUrl, setTrailerUrl] = useState(''); // State để lưu link trailer
    const handleBooking = (movieId) => {
        console.log("modđ",movieId)
        navigate(`/bookticket/${movieId}`); 
        window.scrollTo(0, 0);
    };
  
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (isModalOpen) return;  // Nếu modal mở thì không làm gì cả

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rowers = document.querySelectorAll(`.${cx('rowerr')}`);
                    rowers.forEach(rowerr => {
                        const rect = rowerr.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            rowerr.classList.add(cx('float-in'));
                        } else {
                            rowerr.classList.remove(cx('float-in'));
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Thêm event listener cho scroll
        window.addEventListener('scroll', handleScroll);

        // Gọi scroll khi component render lần đầu
        handleScroll(); 

        // Cleanup khi component unmount hoặc thay đổi
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isModalOpen]);
    
    
    
    console.log("Tổng số phim:", upcomingmovie.length);
console.log("Danh sách phim:", upcomingmovie);
    
    return (
        <div className={cx('container')}>
            {/* Main Carousel */}
            <div id="carouselExampleIndicators" className={cx('carousel', 'slide')} data-bs-ride="carousel" data-bs-interval="3000">
           
            
            <div className={cx('carousel-indicators')}>
                {newmovie.map((_, index) => (
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={index}
                        className={cx({ active: index === 0 })}
                        aria-current={index === 0 ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                        key={index}
                    ></button>
                ))}
            </div>

           
                <div className={cx('carousel-inner')}>
                    {newmovie.map((movie, index) => (
                        <div className={cx('carousel-item', { active: index === 0 })} key={movie._id}>
                            <div className={cx('wrap-banner', 'w-100')}>
                                <img src={movie.poster1} className={cx('d-block')} alt={`Slide ${index + 1}`} />
                                <div className={cx('overlay', 'row')}>
                                    <div className={cx('wrap-banner-con', 'col-6 d-flex flex-column justify-content-end gap-4')}>
                                        
                                        <h1 className={cx('title')} data-text={movie.title}>{movie.title}</h1>
                                        <div className={cx('timeset')}>
                                        <h2 >Thời Gian Khởi Chiếu</h2>
                                        <p className={cx('datetime')}> {new Date(movie.release_date).toLocaleDateString()}</p>
                                        </div>
                                        <div className={cx('wrap-decr')}>
                                            <p className={cx('decribetion')}>{movie.description}</p>
                                        </div>
                                        <div className={cx('wrap-btn-banner')}>
                                        <button type='button' className={cx('bookin')} onClick={()=>handleBooking(movie._id)}> Đặt vé ngay</button>
                                        <button onClick={() => openModal(movie.trailer)} type='button' className={cx('trailer-ban')}>Xem trailer
                                            <FontAwesomeIcon className={cx('icon-play')} icon={faPlay} />
                                        </button>
                                      
                                                     
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                 
           
                </div>
           
           

            {/* Currently Showing Movies Carousel */}
            <div className={cx('box-shadow-movie','rowerr')}>
            <div id="carouselCurrentlyShowing" className={cx('carousel', 'slide')}>
                <h1 className={cx('showing-title', 'text-center')}>PHIM ĐANG CHIẾU</h1>
                <div className={cx('row','rower')}>
                    <div className={cx('col-1 d-flex justify-content-center align-items-center')}>
                        <button className={cx('carousel-control-prev')} type="button" data-bs-target="#carouselCurrentlyShowing" data-bs-slide="prev">
                            <FontAwesomeIcon className={cx('icon-pre')} icon={faChevronLeft} />
                            <span className="visually-hidden">Previous</span>
                        </button>
                    </div>
                    <div className={cx('col-10','wrap-showing')}>
                        <div className={cx('carousel-inner')}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <div className={cx('carousel-item', { active: index === 0 })} key={index}>
                                    <div className="row d-flex justify-content-center     gap-2">
                                        {movieshowing.slice(index * moviesPerPage, (index + 1) * moviesPerPage).map(movieshowing => (
                                            <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12', 'd-flex flex-column   ')} key={movieshowing._id}>
                                                <img src={movieshowing.poster2} className={cx('img-movie', 'd-block', 'w-100')} alt={movieshowing.title} />
                                                <h2 className={cx('title-movie', 'text-center')}>{movieshowing.title}</h2>
                                                <div className={cx('btn-gr', 'd-flex justify-content-center')}>
                                                    <button onClick={() => openModal(movieshowing.trailer)} type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                                   
                                                    <button type='button' className={cx('bookin', 'rounded-4')}onClick={()=>handleBooking(movieshowing._id)}>Đặt vé</button>
                                                </div>
                                                <div className={cx('wrap-hover')}onClick={()=>handleBooking(movieshowing._id)}>
                                                    <div>
                                                        <h1 className='py-3'>{movieshowing.title}</h1>
                                                        <h3>Thể loại: {movieshowing.genre}</h3>
                                                        <h3>Thời lượng: {movieshowing.duration} phút</h3>                                                       
                                                        <h3>Quốc gia: {movieshowing.country}</h3>
                                                        <h3>Phiên bản: {movieshowing.subtitles}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={cx('col-1 d-flex justify-content-center align-items-center')}>
                        <button className={cx('carousel-control-next')} type="button" data-bs-target="#carouselCurrentlyShowing" data-bs-slide="next">
                            <FontAwesomeIcon className={cx('icon-next')} icon={faChevronRight} />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
</div>  
            {/* Upcoming Movies Carousel */}
            <div className={cx('rowerr')}>
            <div id="carouselUpcomingMovies" className={cx('carousel', 'slide')}>
                <h1 className={cx('showing-title', 'text-center')}>PHIM SẮP CHIẾU</h1>
                <div className={cx('row','rower')}>
                    <div className={cx('col-1 d-flex justify-content-center align-items-center')}>
                        <button className={cx('carousel-control-prev')} type="button" data-bs-target="#carouselUpcomingMovies" data-bs-slide="prev">
                            <FontAwesomeIcon className={cx('icon-pre')} icon={faChevronLeft} />
                            <span className="visually-hidden">Previous</span>
                        </button>
                    </div>
                    <div className={cx('col-10','wrap-coming')}>
                        <div className={cx('carousel-inner')}>
                            {Array.from({ length: comingTotalPages }, (_, index) => (
                                <div className={cx('carousel-item', { active: index === 0 })} key={index}>
                                    <div className="row d-flex justify-content-center gap-2">
                                        {upcomingmovie.slice(index * moviesPerPage, (index + 1) * moviesPerPage).map(upcomingmovie => (
                                            <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12', 'd-flex flex-column p-3')} key={upcomingmovie._id}>
                                                <img src={upcomingmovie.poster2} className={cx('img-movie', 'd-block', 'w-100')} alt={upcomingmovie.title} />
                                                <h2 className={cx('title-movie', 'text-center')}>{upcomingmovie.title}</h2>
                                                <h3 className={cx('daterelese','text-center')}>Ngày ra mắt: {new Date(upcomingmovie.release_date).toLocaleDateString() }</h3>
                                                <div className={cx('btn-gr', 'd-flex  justify-content-center')}>
                                                <button onClick={() => openModal(upcomingmovie.trailer)} type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                              
                                                    <button type='button' className={cx('bookin', 'rounded-4')}onClick={()=>handleBooking(upcomingmovie._id)}>Chi tiết</button>
                                                </div>
                                                <div className={cx('wrap-hover')}>
                                                <div>
                                                        <h1 className='py-3'>{upcomingmovie.title}</h1>
                                                        <h3>Thể loại: {upcomingmovie.genre}</h3>
                                                        <h3>Thời lượng: {upcomingmovie.duration} phút</h3>                                                       
                                                        <h3>Quốc gia: {upcomingmovie.country}</h3>
                                                        <h3>Phiên bản: {upcomingmovie.subtitles}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={cx('col-1 d-flex justify-content-center align-items-center')}>
                        <button className={cx('carousel-control-next')} type="button" data-bs-target="#carouselUpcomingMovies" data-bs-slide="next">
                            <FontAwesomeIcon className={cx('icon-next')} icon={faChevronRight} />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className={cx('about-cine','rowerr','row')}>
                <div className='col-1'></div>
               <div className={cx('col-10')}>
               <h1 className={cx('showing-title', 'text-center')}>THÔNG TIN RẠP</h1>
               <div className={cx('info')}>
               <img className={cx('logo')} src={images.logos} alt="Logo" />
               <div className={cx('para')}>
                <p>
                Chào mừng đến với ANTI ANTI MOVIE CINEMA – Thế giới phim không giới hạn!
                Bạn là người yêu phim? ANTI ANTI MOVIE CINEMA là nơi bạn tìm thấy mọi điều bạn cần:
                </p>
                <p>
                🎬 Hàng ngàn bộ phim đa thể loại: Từ hành động, kinh dị đến lãng mạn, hài hước.
                </p>
                <p>
                🔥 Cập nhật liên tục: Những bộ phim mới nhất luôn sẵn sàng.
                </p>
                <p>
                🌟 Chất lượng hoàn hảo: Hình ảnh sắc nét, âm thanh sống động.
                </p>
                <p>
                📱 Hỗ trợ mọi thiết bị: Xem phim dễ dàng trên máy tính, điện thoại hay Smart TV.
                </p>
                <p>
                Điểm nổi bật của chúng tôi
                Phim đa dạng:
                </p>
                <p>
                Phim điện ảnh bom tấn.
                Series phim truyền hình hấp dẫn.
                Phim ngắn nghệ thuật độc đáo.
                Giao diện thân thiện:
                </p>
                <p>
                Tìm kiếm dễ dàng theo thể loại, quốc gia hoặc năm phát hành.
                Đề xuất phim theo sở thích của bạn.
                Trải nghiệm không gián đoạn:
                </p>
                <p>
                Tốc độ load nhanh.
                Xem phim mượt mà, không quảng cáo phiền phức.
                </p>
                <p>
                Hãy bắt đầu hành trình điện ảnh của bạn!
                Nhấn vào [Đăng ký miễn phí] hoặc [Xem ngay] để tận hưởng hàng ngàn bộ phim hay mọi lúc, mọi nơi.
                </p>
                </div>
                </div>
                </div>
                <div className='col-1'></div>
            </div>
        <TrailerModal isOpen={isModalOpen} onClose={closeModal}trailerUrl={trailerUrl} />         
        </div>
        
    );
    
}

export default Home;
