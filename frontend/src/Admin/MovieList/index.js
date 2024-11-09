import React,{ useEffect, useState }  from 'react';
import classNames from 'classnames/bind';
import styles from './MovieList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditMovie from '../EditMovie';
import AddMovie from '../AddMovie';
import axios from 'axios';

const cx = classNames.bind(styles);
function MovieList() {
  const [showModal, setShowModal] = useState(false);
    const [moreinfo,setMoreinfo] = useState(false);
    const [isModalOpen, setIsModalOpen,] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen,] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [isImageOpen, setImageOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [movieId, setMovieId] = useState('');
    const [moviedt,setMoviedt]=useState('');
    const [getmovies,setGetmovies] = useState([]);

    useEffect (()=> {
        const fetchMovie = async() => {
            try{
                const res = await axios.get('http://localhost:8080/v1/getMovies');
            setGetmovies(res.data)
            }catch(error){
                throw error
            }
            
        }
        fetchMovie();
    }, [])

    
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

  const openModalAdd = () => setIsAddModalOpen(true);
  const closeModalAdd = () => setIsAddModalOpen(false);
  const openModalEdit = (id) => {setIsModalOpen(true);
    setMovieId(id);
    };
  const closeModalEdit = () => {setIsModalOpen(false);
    setMovieId('');
    };
    const handleAddCinem =async(id) =>{
        setMoreinfo(true);
        try{
            const res = await axios.get(`http://localhost:8080/v1/getMovieByID/${id}`);
            setMoviedt(res.data);
            console.log(res.data);
        }
        catch{

        }
    }
    const handleCloseModal =() =>{
        setMoreinfo(false)
    }
    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
        setImageOpen(true);
    };
    
    const handleCloseImage = () => {
        setImageOpen(false);
    };
    return ( 
    <div className={cx('container')}>
        <div className={cx('top')}>
            <button onClick={openModalAdd}>
            <FontAwesomeIcon className="fs-3 me-2" icon={faPlus} />Thêm phim </button><AddMovie isOpen={isAddModalOpen} onClose={closeModalAdd} />
        </div>
        <h2>Danh sách phim</h2>   
        <div className={cx('table-con')} >
        <div className={cx('finding')}>
                <div className={cx('search')}>
                  <FontAwesomeIcon  className="fs-3 me-2" icon={faSearch} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                  />
                </div>
              <div className={cx('filter')} ><FontAwesomeIcon className="fs-3 " icon={faFilter} /> 
              <select id="options" value={selectedOption} >
                <option value="">--Chọn mục--</option>
                <option value="option1">Email</option>
                <option value="option2">Số điện thoại</option>
                <option value="option3">role</option>
                <option value="option4">Tài Khoản</option>
              </select>
              </div>
              </div>
        <table striped bordered hover>
        <thead>
          <tr>
          <th>Stt</th>
            <th>Tên phim</th>
            <th>Thể loại</th>
            <th>Thời Lượng</th>
            <th>Phụ đề</th>
            <th>nhãn phim</th>
            <th>Ngày khởi chiếu</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
        {getmovies.map((item, index) => {
            return(
            <tr key={index}>
              <td>{index+1}</td>
              <td>{item.title}</td>
              <td>{item.genre}</td>
              <td>{item.duration}</td>
              <td>{item.subtitles}</td>
              <td>{item.limit ? `${item.limit}+` : ''}</td>
              <td>{new Date(item.release_date).toLocaleDateString()}</td>
              <td>
              <button  onClick={()=>handleAddCinem(item._id)}> Chi tiết</button>
            <button onClick={() => openModalEdit(item._id)}>Sửa</button> <EditMovie isOpen={isModalOpen} movieId={movieId} onClose={closeModalEdit} />
                <button>xóa</button>
              </td>
            </tr>
        )
    })}
        
        </tbody>
      </table>
      </div>
      {moreinfo &&(
        <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
    <h3 className={cx('tyle')}>Chi tiết</h3>
    <div className="row">
    <div className="col d-flex flex-column gap-2">
   
  
    <div className={cx('content')}>
        <h4 className={cx('title')}>Tên phim:{moviedt.title}</h4>
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thể loại:{moviedt.genre}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Thời lượng (phút):{moviedt.duration}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Ngày ra mắt:{moviedt.release_date}</h4>
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Phụ đề:{moviedt.subtitles}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Nhãn phim:{moviedt.limit}</h4>
    </div>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Trailer:{moviedt.trailer}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Quốc gia:{moviedt.country}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Đạo diễn:{moviedt.director}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên:{moviedt.cast}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên lồng tiếng:{moviedt.voice_actors}</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Mô tả:{moviedt.description}</h4>
    </div>
  
</div>
    <div className="col d-flex flex-column gap-2">
    <div className={cx('content',' flex-column')} onClick={() => handleImageClick(moviedt.poster1)}>
        <h4 className={cx('title')}>Poster 1</h4>
        <img  src={moviedt.poster1} className={cx('poster-1')} />
    </div>

    <div className={cx('content',' flex-column')} onClick={() => handleImageClick(moviedt.poster2)}>
        <h4 className={cx('title')}>Poster 2</h4>
        <img  src={moviedt.poster2} className={cx('poster-2')} />
    </div>
   
</div>
 </div>
   

    <div className={cx('close-modal')} onClick={handleCloseModal}>
        <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
    </div>
</div>

        </div>
      )}

      {isImageOpen && (
    <div className={cx('image-modal')}>
        <div className={cx('image-modal-content')}>
            <span className={cx('close-image')} onClick={handleCloseImage}>&times;</span>
            <img className={cx('large-image')} src={currentImage} alt="Phóng to" />
        </div>
    </div>
)}
      {showModal && (
                <div className={cx('modal')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h4>Xác nhận xóa</h4>
                            <button type="button" >×</button>
                        </div>
                        <div className={cx('modal-body')}>
                            Bạn có chắc chắn muốn xóa người dùng này?
                        </div>
                        <div className={cx('modal-footer')}>
                            <button type="button" >Hủy</button>
                            <button type="button" >Xóa</button>
                        </div>
                    </div>
                </div>
            )}
    </div>
);
}

export default MovieList;