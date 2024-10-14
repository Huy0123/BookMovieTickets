import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/img';
import TrailerModal from '../Trailer/TrailerModal';
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
const movies = [
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
    const [moviesPerPage, setMoviesPerPage] = useState(4); // Default to 4 movies per page

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

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial call to set movies per page
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const totalPages = Math.ceil(movies.length / moviesPerPage);
    const comingTotalPages = Math.ceil(comingMovies.length / moviesPerPage);

 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (link) => {
        setTrailerUrl(link);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const [trailerUrl, setTrailerUrl] = useState(''); // State để lưu link trailer

  
    return (
        <div className={cx('container')}>
            {/* Main Carousel */}
            <div id="carouselExampleIndicators" className={cx('carousel', 'slide')} data-bs-ride="carousel" data-bs-interval="3000">
           
            
            <div className={cx('carousel-indicators')}>
                {banners.map((_, index) => (
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
                    {banners.map((banner, index) => (
                        <div className={cx('carousel-item', { active: index === 0 })} key={banner.id}>
                            <div className={cx('wrap-banner', 'w-100')}>
                                <img src={banner.image} className={cx('d-block')} alt={`Slide ${index + 1}`} />
                                <div className={cx('overlay', 'row')}>
                                    <div className={cx('wrap-banner-con', 'col-6 d-flex flex-column justify-content-end gap-4')}>
                                        <p className={cx('datetime')}>{banner.datetime}</p>
                                        <h1 className={cx('title')} data-text={banner.title}>{banner.title}</h1>
                                        <div className={cx('wrap-decr')}>
                                            <p className={cx('decribetion')}>{banner.description}</p>
                                        </div>
                                        <div className={cx('wrap-btn-banner')}>
                                        <button type='button' className={cx('bookin')}>Đặt vé ngay</button>
                                        <button onClick={() => openModal(banner.trailerLink)} type='button' className={cx('trailer-ban')}>Xem trailer
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
                                        {movies.slice(index * moviesPerPage, (index + 1) * moviesPerPage).map(movie => (
                                            <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12', 'd-flex flex-column   ')} key={movie.id}>
                                                <img src={movie.image} className={cx('img-movie', 'd-block', 'w-100')} alt={movie.title} />
                                                <h2 className={cx('title-movie', 'text-center')}>{movie.title}</h2>
                                                <div className={cx('btn-gr', 'd-flex justify-content-center')}>
                                                    <button onClick={() => openModal(movie.trailerLink)} type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                                     <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
                                                    <button type='button' className={cx('bookin', 'rounded-4')}>Đặt vé</button>
                                                </div>
                                                <div className={cx('wrap-hover')}>
                                                    <div>
                                                        <h1 className='py-3'>Dóc Cơ Bến Tre</h1>
                                                        <h3>Thể loại:</h3>
                                                        <h3>Thời lượng:</h3>
                                                        <h3>Quốc gia:</h3>
                                                        <h3>Phiên bản:</h3>
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
                                        {comingMovies.slice(index * moviesPerPage, (index + 1) * moviesPerPage).map(movie => (
                                            <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12', 'd-flex flex-column p-3')} key={movie.id}>
                                                <img src={movie.image} className={cx('img-movie', 'd-block', 'w-100')} alt={movie.title} />
                                                <h2 className={cx('title-movie', 'text-center')}>{movie.title}</h2>
                                                <div className={cx('btn-gr', 'd-flex  justify-content-center')}>
                                                <button onClick={() => openModal(movie.trailerLink)} type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                                <TrailerModal isOpen={isModalOpen} onClose={closeModal}trailerUrl={trailerUrl} />
                                                    <button type='button' className={cx('bookin', 'rounded-4')}>Đặt vé</button>
                                                </div>
                                                <div className={cx('wrap-hover')}>
                                                    <div>
                                                        <h1 className='py-3'>Dóc Cơ Bến Tre</h1>
                                                        <h3>Thể loại:</h3>
                                                        <h3>Thời lượng:</h3>
                                                        <h3>Quốc gia:</h3>
                                                        <h3>Phiên bản:</h3>
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
