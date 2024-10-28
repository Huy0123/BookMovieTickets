import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/img';
import TrailerModal from '../Trailer/TrailerModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const banners = [
    {
        id: 1,
        datetime: "4 THÁNG 10, 2024",
        title: "DÓC CƠ BẾN TRE VÀ MÃ LỆ QUYÊN",
        description: "Bộ phim do nam diễn viên đến từ bến tre trong vai hề chúa phải lòn một cô gái mang tên Mã Lệ Quyên aka Thiên An single mom. Liệu anh có thể làm tròntrách nhiệm của một người cha hay trở thành một chúa hề. muốn biết thì hãy ra rạp",
        image: images.banner1,
        trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,
    },
    {
        id: 2,
        datetime: "5 THÁNG 11, 2024",
        title: "PHIM KINH DỊ MỚI",
        description: "Một bộ phim kinh dị đáng sợ sắp ra mắt...",
        image: images.banner2,
        trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,
    },
    {
        id: 2,
        datetime: "5 THÁNG 11, 2024",
        title: "PHIM KINH DỊ MỚI",
        description: "Một bộ phim kinh dị đáng sợ sắp ra mắt...",
        image: images.banner3,
        trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1",
    },


   
];

// Sample movie data
const movie = [
    { id: 1, image: images.banner1, title: "Phim Thứ Nhất", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" , },
    { id: 2, image: images.banner4, title: "Phim Thứ Hai" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 3, image: images.banner4, title: "Phim Thứ Ba" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 4, image: images.banner4, title: "Phim Thứ Tư" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 5, image: images.banner4, title: "Phim Thứ Năm" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 6, image: images.banner4, title: "Phim Thứ Sáu" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 7, image: images.banner4, title: "Phim Thứ Bảy" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 8, image: images.banner4, title: "Phim Thứ Tám" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 9, image: images.banner4, title: "Phim Thứ Chín" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 10, image: images.banner4, title: "Phim Thứ Mười" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
];

// Sample upcoming movie data
const comingMovies = [
    { id: 11, image: images.banner5, title: "Phim Sắp Chiếu 1" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 12, image: images.banner5, title: "Phim Sắp Chiếu 2", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" , },
    { id: 13, image: images.banner5, title: "Phim Sắp Chiếu 3" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 14, image: images.banner5, title: "Phim Sắp Chiếu 4" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
    { id: 15, image: images.banner5, title: "Phim Sắp Chiếu 5" , trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" ,},
];

function Home() {
    const [movies,setMovie]= useState([])
    const newmovie = (movies.sort((a,b)=> new Date(b.release_date) - new Date(a.release_date))).slice(0,3)
    const movieshowing =movies.filter(movies=>new Date(movies.release_date)< new Date())
    const upcomingmovie =movies.filter(movies=>new Date(movies.release_date)> new Date())
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
        
            const setmovie=setMovie(response.data)
            console.log(setmovie)
            
        }
        getHome();
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set movies per page
        return () => {
            window.removeEventListener('resize', handleResize);
            
        };

       
    }, []);

    const totalPages = Math.ceil(movieshowing.length / moviesPerPage);
    const comingTotalPages = Math.ceil(upcomingmovie.length / moviesPerPage);

 

    const openModal = (link) => {
        setTrailerUrl(link);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const [trailerUrl, setTrailerUrl] = useState(''); // State để lưu link trailer
    const handleBooking = (movieId) => {
        console.log(movieId)
        navigate(`/bookticket/${movieId}`); 
    };
  
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
                                <img src={movie.poster} className={cx('d-block')} alt={`Slide ${index + 1}`} />
                                <div className={cx('overlay', 'row')}>
                                    <div className={cx('wrap-banner-con', 'col-6 d-flex flex-column justify-content-end gap-4')}>
                                        
                                        <h1 className={cx('title')} data-text={movie.title}>{movie.title}</h1>
                                        <h2 >Thời Gian Khởi Chiếu</h2>
                                        <p className={cx('datetime')}> {new Date(movie.release_date).toLocaleDateString()}</p>
                                        <div className={cx('wrap-decr')}>
                                            <p className={cx('decribetion')}>{movie.description}</p>
                                        </div>
                                        <div className={cx('wrap-btn-banner')}>
                                        <button type='button' className={cx('bookin')} onClick={()=>handleBooking(movie._id)}> Đặt vé ngay</button>
                                        <button onClick={() => openModal(movie.trailer)} type='button' className={cx('trailer-ban')}>Xem trailer
                                            <FontAwesomeIcon className={cx('icon-play')} icon={faPlay} />
                                        </button>
                                                     <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
                                                     
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                 
           
                </div>
           

            {/* Currently Showing Movies Carousel */}
            <div className={cx('box-shadow-movie')}>
            <div id="carouselCurrentlyShowing" className={cx('carousel', 'slide')}>
                <h1 className={cx('showing-title', 'text-center', 'text-light')}>PHIM ĐANG CHIẾU</h1>
                <div className="row">
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
                                    <div className="row d-flex justify-content-center gap-2">
                                        {movieshowing.slice(index * moviesPerPage, (index + 1) * moviesPerPage).map(movieshowing => (
                                            <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12', 'd-flex flex-column   ')} key={movieshowing._id}>
                                                <img src={movieshowing.poster} className={cx('img-movie', 'd-block', 'w-100')} alt={movieshowing.title} />
                                                <h2 className={cx('title-movie', 'text-center')}>{movieshowing.title}</h2>
                                                <div className={cx('btn-gr', 'd-flex justify-content-center')}>
                                                    <button onClick={() => openModal(movieshowing.trailer)} type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                                     <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
                                                    <button type='button' className={cx('bookin', 'rounded-4')}onClick={()=>handleBooking(movieshowing._id)}>Đặt vé</button>
                                                </div>
                                                <div className={cx('wrap-hover')}>
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

            {/* Upcoming Movies Carousel */}
            <div id="carouselUpcomingMovies" className={cx('carousel', 'slide')}>
                <h1 className={cx('showing-title', 'text-center', 'text-light')}>PHIM SẮP CHIẾU</h1>
                <div className="row">
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
                                        {upcomingmovie.slice(index * upcomingmovie, (index + 1) * moviesPerPage).map(upcomingmovie => (
                                            <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12', 'd-flex flex-column p-3')} key={upcomingmovie._id}>
                                                <img src={upcomingmovie.poster} className={cx('img-movie', 'd-block', 'w-100')} alt={upcomingmovie.title} />
                                                <h2 className={cx('title-movie', 'text-center')}>{upcomingmovie.title}</h2>
                                                <div className={cx('btn-gr', 'd-flex  justify-content-center')}>
                                                <button onClick={() => openModal(upcomingmovie.trailer)} type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                                <TrailerModal isOpen={isModalOpen} onClose={closeModal}trailerUrl={trailerUrl} />
                                                    <button type='button' className={cx('bookin', 'rounded-4')}onClick={()=>handleBooking(upcomingmovie._id)}>Đặt vé</button>
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
                            
        </div>
        
    );
}

export default Home;
