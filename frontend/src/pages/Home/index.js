import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons'
import TrailerModal from '../Trailer/TrailerModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    const newmovie = (movies.sort((a,b)=> new Date(b.release_date) - new Date(a.release_date))).slice(0,3)
    console.log("newmovie",newmovie)
    const movieshowing =movies.filter(movies=>new Date(movies.release_date)< new Date())
    console.log("movieshowing",movieshowing)
    const upcomingmovie =movies.filter(movies=>new Date(movies.release_date)> new Date())
    const totalPages = Math.ceil(movieshowing.length / moviesPerPage);
    const comingTotalPages = Math.ceil(upcomingmovie.length / moviesPerPage);

   

    const openModal = (link) => {
        setTrailerUrl(link);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const [trailerUrl, setTrailerUrl] = useState(''); // State để lưu link trailer
    const handleBooking = (movieId) => {
        console.log("modđ",movieId)
        navigate(`/bookticket/${movieId}`); 
    };
  
    useEffect(() => {
        const handleScroll = () => {
            const rowers = document.querySelectorAll(`.${styles.rower}`);
            rowers.forEach(rower => {
                const rect = rower.getBoundingClientRect();
                // Kiểm tra nếu phần tử đã vào khung hình (không nằm quá xa khung hình từ phía trên hoặc dưới)
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    rower.classList.add(styles['float-in']);
                } else {
                    rower.classList.remove(styles['float-in']); // Nếu ra khỏi khung hình thì gỡ bỏ hiệu ứng
                }
            });
        };
    
        // Kích hoạt sự kiện scroll
        window.addEventListener('scroll', handleScroll);
    
        // Kiểm tra lần đầu khi component mount
        handleScroll();
    
        // Dọn dẹp sự kiện khi component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    
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
                                                     <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
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

            {/* Upcoming Movies Carousel */}
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
                                        {upcomingmovie.slice(index * upcomingmovie, (index + 1) * moviesPerPage).map(upcomingmovie => (
                                            <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12', 'd-flex flex-column p-3')} key={upcomingmovie._id}>
                                                <img src={upcomingmovie.poster2} className={cx('img-movie', 'd-block', 'w-100')} alt={upcomingmovie.title} />
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
