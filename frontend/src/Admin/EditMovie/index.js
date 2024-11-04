import React from "react";
import classNames from 'classnames/bind';
import styles from './EditMovie.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';


const cx = classNames.bind(styles);
const EditMovie = ({ isOpen, onClose }) => {


  

  if (!isOpen) return null;

  return (
    <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
    <h3 className={cx('tyle')}>Chỉnh sửa phim</h3>
    <div className="row">
    <div className="col d-flex flex-column gap-2">
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tên phim</h4>
        <input 
            type="text" 
            name="cinemaname" 
            className={cx('cinema-name', 'form-info')}     
        />
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thể loại</h4>
        <input 
            type="text" 
            name="genre" 
            className={cx('genre', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Thời lượng (phút)</h4>
        <input 
            type="number" 
            name="duration" 
            className={cx('duration', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Ngày ra mắt</h4>
        <input 
            type="date" 
            name="releaseDate" 
            className={cx('release-date', 'form-info')}     
        />
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Phụ đề</h4>
        <input 
            type="text" 
            name="subtitles" 
            className={cx('subtitles', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Nhãn phim</h4>
        <input 
            type="text" 
            name="rating" 
            className={cx('rating', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Poster 1</h4>
        <input 
            type="file" 
            name="poster1" 
            accept="image/*" 
            className={cx('poster1', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Poster 2</h4>
        <input 
            type="file" 
            name="poster2" 
            accept="image/*" 
            className={cx('poster2', 'form-info')}     
        />
    </div>
</div>
    <div className="col d-flex flex-column gap-2">
    <div className={cx('content')}>
        <h4 className={cx('title')}>Trailer</h4>
        <input 
            type="url" 
            name="trailer" 
            className={cx('trailer', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Quốc gia</h4>
        <input 
            type="text" 
            name="country" 
            className={cx('country', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Đạo diễn</h4>
        <input 
            type="text" 
            name="director" 
            className={cx('director', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên</h4>
        <input 
            type="text" 
            name="actors" 
            className={cx('actors', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên lồng tiếng</h4>
        <input 
            type="text" 
            name="voiceActors" 
            className={cx('voice-actors', 'form-info')}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Mô tả</h4>
        <textarea 
            name="description" 
            className={cx('description', 'form-info')}     
        />
    </div>
</div>
 </div>
    <div className={cx('btn-con')}>
        <button type='button' className={cx('btn-confirm')}>
            Xác nhận
        </button>
    </div>

    <div className={cx('close-modal')} onClick={onClose}>
        <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
    </div>
</div>

        </div>
  );
};

export default EditMovie;
