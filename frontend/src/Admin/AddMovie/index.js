import React, { useState } from "react";
import classNames from 'classnames/bind';
import styles from './AddMovie.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";


const cx = classNames.bind(styles);
const AddMovie = ({ isOpen, onClose }) => {
    const [title,setTitle]=useState('');
    const [genre,setGenre]=useState('');
    const [duration,setDuration]=useState(0);
    const [releaseDate,setReleaseDate]=useState('');
    const [subtitles,setSubtitles]=useState('');
    const [limit,setLimit] = useState(0);
    const [poster1,setPoster1]=useState('');
    const [poster2,setPoster2]=useState('');
    const [trailer,setTrailer]=useState('');
    const [country,setCountry]=useState('');
    const [director,setDirector]=useState('');
    const [cast,setCast]=useState([]);
    const [voiceActors,setVoiceActors]=useState([]);
    const [description,setDescription]=useState('');
    
    const handleCastChange = (event) => {
        const castInput = event.target.value; // Lấy giá trị từ input
        const castArray = castInput
            .split(',') // Chia chuỗi theo dấu phẩy
            .map(actor => actor.trim()) // Loại bỏ khoảng trắng thừa
            .filter(actor => actor); // Bỏ qua phần tử trống
        setCast(castArray); // Cập nhật state với mảng mới
    };
    
    
    const handleVoiceActorsChange = (event) => {
        const voiceActorsInput = event.target.value;
        const voiceActorsArray = voiceActorsInput
            .split(',') // Chia chuỗi theo dấu phẩy
            .map(actor => actor.trim()) // Loại bỏ khoảng trắng thừa
            .filter(actor => actor); // Bỏ qua phần tử trống nếu có
        setVoiceActors(voiceActorsArray); // Cập nhật state với mảng mới
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        // Ghi dữ liệu vào FormData
        formData.append("title", title);
        formData.append("genre", genre);
        formData.append("duration", duration);
        formData.append("release_date", releaseDate);
        formData.append("subtitles", subtitles);
        formData.append("limit", limit);
        formData.append("trailer", trailer);
        formData.append("country", country);
        formData.append("director", director);
        formData.append("cast", JSON.stringify(cast));
        formData.append("voice_actors", JSON.stringify(voiceActors));
        formData.append("description", description);

        // Gắn các tệp poster
        if (poster1) {
            formData.append("poster1", poster1);
        }
        if (poster2) {
            formData.append("poster2", poster2);
        }
    
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        
        // Hoặc chuyển đổi thành đối tượng thông thường để log
        const obj = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        console.log('Data being sent to the server:', obj);
        try {
            const res = await axios.post(`http://localhost:8080/v1/createMovie`, formData);

            console.log(res.data);
            alert('Tạo phim thành công!!');
        } catch (error) {
            console.error('Error during movie creation:', error.response ? error.response.data : error.message);
        }
    }
    
    if (!isOpen) return null;

  
  return (
    <form onSubmit={handleSubmit}>

    <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
    <h3 className={cx('tyle')}>Thêm phim</h3>
    <div className="row">
    <div className="col d-flex flex-column gap-2">
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tên phim</h4>
        <input 
            type="text" 
            name="cinemaname" 
            className={cx('cinema-name', 'form-info')}
            value={title}    
            onChange={event => setTitle(event.target.value)}
        />
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thể loại</h4>
        <input 
            type="text" 
            name="genre" 
            className={cx('genre', 'form-info')}     
            value={genre}    
            onChange={event => setGenre(event.target.value)}
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Thời lượng (phút)</h4>
        <input 
            type="number" 
            name="duration" 
            className={cx('duration', 'form-info')}  
            value={duration}    
            onChange={event => setDuration(parseInt(e vent.target.value, 10))}
            />
    </div>

    <div className={cx('content')}>
    <h4 className={cx('title')}>Ngày ra mắt</h4>
    <input 
        type='datetime-local'
        name="releaseDate" 
        className={cx('release-date', 'form-info')}   
        value={releaseDate}    
        onChange={event => setReleaseDate(event.target.value)} // Chuyển đổi thành đối tượng Date
    />
</div>

    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Phụ đề</h4>
        <input 
            type="text" 
            name="subtitles" 
            className={cx('subtitles', 'form-info')}     
            value={subtitles}    
            onChange={event => setSubtitles(event.target.value)}
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Nhãn phim</h4>
        <input 
            type="number" 
            name="rating" 
            className={cx('rating', 'form-info')}    
            value={limit}    
            onChange={event => setLimit(parseInt(event.target.value, 10))}
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Poster 1</h4>
        <input 
            type='file'
            name="poster1" 
            className={cx('poster1', 'form-info')}     
            value={poster1}    
            onChange={event => setPoster1(event.target.value)}
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Poster 2</h4>
        <input 
            type='file'
            name="poster2" 
            className={cx('poster2', 'form-info')}     
            value={poster2}    
            onChange={event => setPoster2(event.target.value)}
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
            value={trailer}    
            onChange={event => setTrailer(event.target.value)}
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Quốc gia</h4>
        <input 
            type="text" 
            name="country" 
            className={cx('country', 'form-info')}    
            value={country}    
            onChange={event => setCountry(event.target.value)} 
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Đạo diễn</h4>
        <input 
            type="text" 
            name="director" 
            className={cx('director', 'form-info')} 
            value={director}    
            onChange={event => setDirector(event.target.value)}    
        />
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên</h4>
        <input 
            type="text" 
            name="actors" 
            className={cx('actors', 'form-info')}     
            value={cast.join(', ')} // Hiển thị mảng dưới dạng chuỗi phân cách bởi dấu phẩy
            onChange={handleCastChange} // Sử dụng hàm xử lý thay đổi
        />
    </div>
    

    <div className={cx('content')}>
    <h4 className={cx('title')}>Diễn viên lồng tiếng</h4>
    <input 
        type="text" 
        name="voiceActors" 
        className={cx('voice-actors', 'form-info')}     
        value={voiceActors.join(', ')} // Hiển thị mảng dưới dạng chuỗi phân cách bởi dấu phẩy
        onChange={handleVoiceActorsChange} // Sử dụng hàm xử lý thay đổi
    />
</div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Mô tả</h4>
        <textarea 
            name="description" 
            className={cx('description', 'form-info')}     
            value={description}    
            onChange={event => setDescription(event.target.value)}
        />
    </div>
</div>
 </div>
    <div className={cx('btn-con')}>
        <button type='button' className={cx('btn-confirm')} onClick={handleSubmit}>
            Xác nhận
        </button>
    </div>

    <div className={cx('close-modal')} onClick={onClose}>
        <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
    </div>
</div>

        </div>
        </form>
  );
};

export default AddMovie;
