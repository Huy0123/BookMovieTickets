import React , {useState, useEffect}from "react";
import classNames from 'classnames/bind';
import styles from './EditMovie.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const cx = classNames.bind(styles);
const EditMovie = ({ isOpen, onClose, movieId }) => {
    const [formData, setFormData] = useState({
        title: "",
    genre: "",
    duration: "",
    release_date: "",
    description: "",
    director: "",
    cast: "",
    trailer: "",
    subtitles: "",
    voice_actors: "",
    country: "",
    limit: "",
    poster1: null,
    poster2: null
    });

    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const fetchMoiveId = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/getMovieByID/${id}`);
            setFormData(prevFormData => ({
                ...prevFormData,
                ...response.data,
                release_date: response.data.release_date.split("T")[0],
            }));
            
        } catch (error) {
            console.log("Error fetching movie:", error);
        }
    };
    

    const handleSumbit = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/v1/updateMovie/${movieId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if(response.status === 200){
                onClose();
                window.location.reload();
            }
            console.log("Movie updated:", response.data);
        } catch (error) {
            console.log("Error updating movie:", error);
        }
    };


    useEffect( () => {
        if (isOpen) {
            fetchMoiveId(movieId);
        }
    }, [isOpen, movieId]);

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
            className={cx('cinema-name', 'form-info')} name="title" onChange={handleInputChange} value={formData.title}    
        />
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thể loại</h4>
        <input 
            type="text" 
            name="genre" 
            className={cx('genre', 'form-info')}  onChange={handleInputChange} value={formData.genre} 
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Thời lượng (phút)</h4>
        <input 
            type="number" 
            name="duration" 
            className={cx('duration', 'form-info')} onChange={handleInputChange} value={formData.duration}
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Ngày ra mắt</h4>
        <input 
            type="date" 
            name="release_date" 
            className={cx('release-date', 'form-info')} onChange={handleInputChange} value={formData.release_date}
        />
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Phụ đề</h4>
        <input 
            type="text" 
            name="subtitles" 
            className={cx('subtitles', 'form-info')}  onChange={handleInputChange} value={formData.subtitles}  
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Nhãn phim</h4>
        <input 
            type="text" 
            name="limit" 
            className={cx('rating', 'form-info')} onChange={handleInputChange} value={formData.limit}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Poster 1</h4>
        <input 
            type="file" 
            name="poster1" 
            accept="image/*" 
            className={cx('poster1', 'form-info')} onChange={(e) => setFormData({...formData,poster1: e.target.files[0]})}
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Poster 2</h4>
        <input 
            type="file" 
            name="poster2" 
            accept="image/*" 
            className={cx('poster2', 'form-info')} onChange={(e) => setFormData({...formData,poster2: e.target.files[0]})}    
        />
    </div>
</div>
    <div className="col d-flex flex-column gap-2">
    <div className={cx('content')}>
        <h4 className={cx('title')}>Trailer</h4>
        <input 
            type="url" 
            name="trailer" 
            className={cx('trailer', 'form-info')} onChange={handleInputChange} value={formData.trailer}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Quốc gia</h4>
        <input 
            type="text" 
            name="country" 
            className={cx('country', 'form-info')}  onChange={handleInputChange} value={formData.country}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Đạo diễn</h4>
        <input 
            type="text" 
            name="director" 
            className={cx('director', 'form-info')} onChange={handleInputChange} value={formData.director}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên</h4>
        <input 
            type="text" 
            name="cast" 
            className={cx('actors', 'form-info')} onChange={handleInputChange} value={formData.cast}     
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên lồng tiếng</h4>
        <input 
            type="text" 
            name="voice_actors" 
            className={cx('voice-actors', 'form-info')} onChange={handleInputChange} value={formData.voice_actors}  
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Mô tả</h4>
        <textarea 
            name="description" 
            className={cx('description', 'form-info')}  onChange={handleInputChange} value={formData.description}  
        />
    </div>
</div>
 </div>
    <div className={cx('btn-con')}>
        <button type='button' className={cx('btn-confirm')} onClick={handleSumbit}>
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
