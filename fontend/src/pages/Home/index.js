import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/img';

const cx = classNames.bind(styles);

// Sample movie data
const movies = [
    
    { id: 2, image: images.banner4, title: "Phim Thứ Hai" },
    { id: 3, image: images.banner4, title: "Phim Thứ Ba" },
    { id: 4, image: images.banner4, title: "Phim Thứ Tư" },
    { id: 5, image: images.banner4, title: "Phim Thứ Năm" },
    { id: 6, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 7, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 8, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 9, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 10, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 11, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 12, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
];





// Sample movie data
const comingMovies = [
    
    { id: 2, image: images.banner5, title: "Phim Thứ Hai" },
    { id: 3, image: images.banner4, title: "Phim Thứ Ba" },
    { id: 4, image: images.banner4, title: "Phim Thứ Tư" },
    { id: 5, image: images.banner4, title: "Phim Thứ Năm" },
    { id: 6, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 7, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 8, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 9, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 10, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 11, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
    { id: 12, image: images.banner4, title: "Phim Thứ Sáu" }, // More movies
];




function Home() {
    const [moviesPerPage, setMoviesPerPage] = useState(4); // Default to 4 movies per page

    useEffect(() => {
        const handleResize = () => {
            // If the screen width is less than or equal to 768px (mobile devices), set moviesPerPage to 1
            if (window.innerWidth < 576) {
                setMoviesPerPage(1);
            }
            else if(window.innerWidth < 992 &&window.innerWidth >= 576) {
                setMoviesPerPage(2);
            }
            else {
                setMoviesPerPage(4);
            }
        };

        // Add event listener on window resize
        window.addEventListener('resize', handleResize);

        // Call the function initially to set the correct number of moviesPerPage on load
        handleResize();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const totalPages = Math.ceil(movies.length / moviesPerPage); // Calculate total pages
    const comingTotalPages = Math.ceil(comingMovies.length / moviesPerPage); // Calculate total pages
    return (
        <div className={cx('container')}>
            <div
                id="carouselExampleIndicators"
                className={cx('carousel', 'slide')}
                data-bs-ride="carousel"
                data-bs-interval="3000" // Chuyển ảnh sau mỗi 4 giây
            >
                <div className={cx('carousel-indicators')}>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className={cx('active')} aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className={cx('row')}>
                    <div className={cx('col-lg-1','d-none d-lg-flex justify-content-center align-items-center')}>
                        <button className={cx('carousel-control-prev', 'btn-np')} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <FontAwesomeIcon className={cx('icon-pre')} icon={faChevronLeft} />
                            <span className="visually-hidden">Previous</span>
                        </button>
                    </div>
                    <div className={cx('col-lg-10')}>
                        <div className={cx('carousel-inner')}>
                            <div className={cx('carousel-item', 'active')}>
                                <img src={images.banner1} className={cx('d-block', 'w-100', 'h-100')} alt="Slide 1" />
                            </div>
                            <div className={cx('carousel-item')}>
                                <img src={images.banner2} className={cx('d-block', 'w-100', 'h-100')} alt="Slide 2" />
                            </div>
                            <div className={cx('carousel-item')}>
                                <img src={images.banner3} className={cx('d-block', 'w-100', 'h-100')} alt="Slide 3" />
                            </div>
                        </div>
                    </div>
                    <div className={cx('col-lg-1','d-none d-lg-flex justify-content-center align-items-center')}>
                        <button className={cx('carousel-control-next', 'btn-np')} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <FontAwesomeIcon className={cx('icon-next')} icon={faChevronRight} />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
            <div id="carouselExampleIndicators2"
                className={cx('carousel', 'slide')}
              >
                <div className={cx('showing')}>
                    <h1 className={cx('showing-title',' text-center text-light py-5  ')}>PHIM ĐANG CHIẾU</h1>
                    <div className='row'>
                        <div className={cx('col-lg-1 col-2',' d-flex justify-content-center align-items-center')}>
                            <button className={cx('carousel-control-prev', 'btn-np')} type="button" data-bs-target="#carouselExampleIndicators2" data-bs-slide="prev">
                                <FontAwesomeIcon className={cx('icon-pre')} icon={faChevronLeft} />
                                <span className="visually-hidden">Previous</span>
                            </button>
                        </div>
                        <div className={cx(' col-8 col-lg-10  ')}>
                            <div className={cx('carousel-inner')}>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <div className={cx('carousel-item', { active: index === 0 })} key={index}>
                                        <div className='row'>
                                            {movies.slice(index * moviesPerPage, index * moviesPerPage + moviesPerPage).map(movie => (
                                                <div className={cx('wrap', 'col-lg-3 col-sm-6 col-12','d-flex flex-column p-3')} key={movie.id}>
                                                   
                                                        <img src={movie.image} className={cx('img-movie','d-block', 'w-70', 'h-70')} alt={movie.title} />
                                                        <h2 className={cx('title-movie', 'text-center')}>{movie.title}</h2>
                                                        <div className={cx('btn-gr', 'd-flex gap-2 justify-content-center')}>
                                                            <button type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                                            <button type='button' className={cx('bookin', 'rounded-4')}>Đặt vé</button>
                                                        </div>
                                                   
                                                    <div className={cx('wrap-hover')}>
                                                         <div>
                                                         <h1 className='py-3'> dóc cơ bến tre</h1>
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
                        <div className={cx('col-2 col-lg-1 ',' d-flex justify-content-center align-items-center  ')}>
                            <button className={cx('carousel-control-next', 'btn-np')} type="button" data-bs-target="#carouselExampleIndicators2" data-bs-slide="next">
                                <FontAwesomeIcon className={cx('icon-next')} icon={faChevronRight} />
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="carouselExampleIndicators3"
                className={cx('carousel', 'slide')}
              >
                <div className={cx('coming')}>
                    <h1 className='showing-title text-center text-light py-5'>PHIM SẮP CHIẾU</h1>
                    <div className='row'>
                        <div className={cx('col-lg-1 col-2',' d-flex justify-content-center align-items-center')}>
                            <button className={cx('carousel-control-prev', 'btn-np')} type="button" data-bs-target="#carouselExampleIndicators3" data-bs-slide="prev">
                                <FontAwesomeIcon className={cx('icon-pre')} icon={faChevronLeft} />
                                <span className="visually-hidden">Previous</span>
                            </button>
                        </div>
                        <div className={cx('col-8 col-lg-10 ')}>
                            <div className={cx('carousel-inner')}>
                                {Array.from({ length: comingTotalPages }, (_, index) => (
                                    <div className={cx('carousel-item', { active: index === 0 })} key={index}>
                                        <div className='row'>
                                            {comingMovies.slice(index * moviesPerPage, index * moviesPerPage + moviesPerPage).map(movie => (
                                                <div className={cx('wrap','col-lg-3 col-sm-6 col-12','d-flex flex-column p-3')} key={movie.id}>
                                                   
                                                        <img src={movie.image} className={cx('img-movie','d-block', 'w-70', 'h-70')} alt={movie.title} />
                                                        <h2 className={cx('title-movie', 'text-center')}>{movie.title}</h2>
                                                        <div className={cx('btn-gr', 'd-flex gap-2 justify-content-center')}>
                                                            <button type='button' className={cx('trailer', 'rounded-4')}>Xem trailer</button>
                                                            <button type='button' className={cx('bookin', 'rounded-4')}>Đặt vé</button>
                                                        </div>
                                                   
                                                    <div className={cx('wrap-hover')}>
                                                         <div>
                                                            <h1 className='py-3'> dóc cơ bến tre</h1>
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
                        <div className={cx('col-lg-1 col-2',' d-flex justify-content-center align-items-center')}>
                            <button className={cx('carousel-control-next', 'btn-np')} type="button" data-bs-target="#carouselExampleIndicators3" data-bs-slide="next">
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
