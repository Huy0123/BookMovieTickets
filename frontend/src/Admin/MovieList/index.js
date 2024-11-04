import React,{ useState }  from 'react';
import classNames from 'classnames/bind';
import styles from './MovieList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditMovie from '../EditMovie';
import AddMovie from '../AddMovie';

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



    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

  const openModalAdd = () => setIsAddModalOpen(true);
  const closeModalAdd = () => setIsAddModalOpen(false);
  const openModalEdit = () => setIsModalOpen(true);
  const closeModalEdit = () => setIsModalOpen(false);
    const handleAddCinem =() =>{
        setMoreinfo(true)
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
       
            <tr >
              <td>01</td>
              <td>bo may bi gay</td>
       
              <td>gay porn</td>
              <td>2phut</td>
              
              <td>lòng tiếng</td>
              <td>phim cho trẻ em</td>
              <td>20/20/2020</td>
              <td>
              <button  onClick={handleAddCinem}> Chi tiết</button>
              <button onClick={openModalEdit}>chỉnh sửa</button> <EditMovie isOpen={isModalOpen} onClose={closeModalEdit} />
                <button>xóa</button>
              </td>
            </tr>
          
        
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
        <h4 className={cx('title')}>Tên phim:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Thể loại:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Thời lượng (phút):</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Ngày ra mắt:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>
    
    <div className={cx('content')}>
        <h4 className={cx('title')}>Phụ đề:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Nhãn phim:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>
    <div className={cx('content')}>
        <h4 className={cx('title')}>Trailer:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Quốc gia:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Đạo diễn:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Diễn viên lồng tiếng:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>

    <div className={cx('content')}>
        <h4 className={cx('title')}>Mô tả:</h4>
        <h4 className={cx('content-of-movie')}>Tên phim</h4>
    </div>
  
</div>
    <div className="col d-flex flex-column gap-2">
    <div className={cx('content',' flex-column')} onClick={() => handleImageClick('https://images.hdqwalls.com/download/venom-the-last-dance-fx-1920x1200.jpg')}>
        <h4 className={cx('title')}>Poster 1</h4>
        <img  src='https://images.hdqwalls.com/download/venom-the-last-dance-fx-1920x1200.jpg' className={cx('poster-1')} />
    </div>

    <div className={cx('content',' flex-column')} onClick={() => handleImageClick('https://cinema.heavymag.com.au/wp-content/uploads/sites/3/2024/06/Venom-The-Last-Dance.jpeg')}>
        <h4 className={cx('title')}>Poster 2</h4>
        <img  src='https://cinema.heavymag.com.au/wp-content/uploads/sites/3/2024/06/Venom-The-Last-Dance.jpeg' className={cx('poster-2')} />
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