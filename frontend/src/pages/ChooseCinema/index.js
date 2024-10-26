import React, { useState,useEffect } from 'react';
import styles from './ChooseCinema.module.scss';
import classNames from 'classnames/bind';
import 'bootstrap/dist/css/bootstrap.min.css';
import images from '~/assets/img';
import TrailerModal from '../Trailer/TrailerModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight,faClock, faClosedCaptioning, faEarthAsia, faTag, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const cx = classNames.bind(styles);

const movies = [ { id: 1, image: images.banner4, title: "Phim Thứ Nhất", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 2, image: images.banner4, title: "Phim Thứ Hai", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 3, image: images.banner4, title: "Phim Thứ Ba", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 4, image: images.banner4, title: "Phim Thứ Tư", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 5, image: images.banner4, title: "Phim Thứ Năm", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 6, image: images.banner4, title: "Phim Thứ Sáu", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 7, image: images.banner4, title: "Phim Thứ Bảy", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 8, image: images.banner4, title: "Phim Thứ Tám", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 9, image: images.banner4, title: "Phim Thứ Chín", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, { id: 10, image: images.banner4, title: "Phim Thứ Mười", trailerLink: "https://www.youtube.com/embed/_OKAwz2MsJs?autoplay=1&mute=1" }, ];

function ChooseCinema() {
  const [visibleMovies, setVisibleMovies] = useState(movies.slice(0, 5)); // Hiển thị 5 phim đầu tiên
  const [startIndex, setStartIndex] = useState(0); // Chỉ số hiện tại
  const [selectedMovie, setSelectedMovie] = useState(null); // Theo dõi thẻ được chọn
  const [allmovie,setAllmovie] = useState([]);
  const cinema_id =useParams().id; 
  console.log(cinema_id)
  const handleBack = () => {
    if (startIndex < movies.length - 5) {
      setStartIndex(startIndex + 1);
      setVisibleMovies(movies.slice(startIndex + 1, startIndex + 6));
    }
  };

  const handleNext = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
      setVisibleMovies(movies.slice(startIndex - 1, startIndex + 4));
    }
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie); // Cập nhật phim được chọn
  
    // Cuộn mượt đến phần tử với id "wrap-content"
    setTimeout(() => {
      const wrapContent = document.getElementById('wrap-content');
      if (wrapContent) {
        wrapContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (link) => {
      setTrailerUrl(link);
      setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const [trailerUrl, setTrailerUrl] = useState(''); // State để lưu link trailer
  useEffect(() => {
    const fetchMoviebyCinemaId = async () => {
        try{
          const res = await axios.get(`http://localhost:8080/v1/getShowtimeByCinemaID/${cinema_id}`)
          setAllmovie(res.data);
          console.log(res.data)
        }catch {

        }
    };

    fetchMoviebyCinemaId();
}, []);
  return (
    <div className={cx('container')}>
      <div className={cx('wrap-card')}>
        {visibleMovies.map((movie) => (
          <div 
            key={movie.id} 
            className={cx('the')} 
            onClick={() => handleSelectMovie(movie)} // Xử lý khi nhấn vào thẻ
          >
            <img src={movie.image} alt={movie.title} className={cx('movie-image')} />
            <div className={cx('content-movie')}>
              <h3 className={cx('movie-title')}>{movie.title}</h3>
              <button  onClick={() => openModal(movie.trailerLink)}  target="_blank" rel="noopener noreferrer" className={cx('trailer-link')}>
                Xem Trailer <TrailerModal isOpen={isModalOpen} onClose={closeModal} trailerUrl={trailerUrl} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={cx('pagination')}>
        <button onClick={handleNext} disabled={startIndex === 0}> <FontAwesomeIcon className={cx('icon-pre')} icon={faChevronLeft} /></button>
        <button onClick={handleBack} disabled={startIndex === movies.length - 5}> <FontAwesomeIcon className={cx('icon-next')} icon={faChevronRight} /></button>
      </div>

      {selectedMovie && ( // Hiển thị nội dung khi có phim được chọn
        <div id="wrap-content" className={cx('wrap-content','my-5')}>
          <div className="row">
            <div className={cx('movie-detail', 'col-4')}>
              <img src={selectedMovie.image} className={cx('d-block')} alt={selectedMovie.title} />
            </div>
            <div className={cx('wrap-line')}>
              <div className={cx('wrap-info', 'mb-5')}>
                <h1 className={cx('title')}>Tên phim: {selectedMovie.title}</h1>
                <div className="info-group d-flex">
                  <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faTag} />
                  <div className={cx('type')}>Thể loại: ...</div>
                </div>
                <div className="info-group d-flex">
                  <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faClock} />
                  <div className={cx('duration')}>Thời gian: ...</div>
                </div>
                <div className="info-group d-flex">
                  <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faEarthAsia} />
                  <div className={cx('country')}>Quốc gia: ...</div>
                </div>
                <div className="info-group d-flex">
                  <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faClosedCaptioning} />
                  <div className={cx('sub')}>Phụ đề: ...</div>
                </div>
                <div className="info-group d-flex">
                  <FontAwesomeIcon className={cx('icon-info', 'pe-2', 'pt-1')} icon={faUserCheck} />
                  <div className={cx('limit')}>Nhãn phim: ...</div>
                </div>
              </div>
              <div className={cx('schedule')}>
                <div className={cx('group')}>
                  {[...Array(3)].map((_, i) => (
                    <button key={i} className={cx('btn-schedule')}>8:00</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChooseCinema;
