import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CinemaList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPenToSquare, faPlus, faSearch, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditCinema from '../EditCinema';
import axios from 'axios';
import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle.min';

const cx = classNames.bind(styles);

function CinemaList() {
  const [showModal, setShowModal] = useState(false);
  const [addCinema, setAddCinema] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [Cinemas, setCinemas] = useState([]);
  const [cinemaIdToDelete,setCinemaIdToDelete] = useState(null);
  const [nameCinema, setNameCinema] = useState('');
  const [username, setUsername] = useState('');
  const [num, setNum] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [cfpassword,setCfpassword]= useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModalEdit = (cinemaId) => {
    setSelectedCinemaId(cinemaId); // Set the selected cinema ID
    setIsModalOpen(true);
  };
  const openModalDelete =  (cinemaId) => {
    setCinemaIdToDelete(cinemaId);
    setShowModal(true);
    
  }
  

  const handleAddCinem = () => {
    setAddCinema(true);
  };

  const handleCloseModal = () => {
    setAddCinema(false);
  };

  useEffect(() => {
    const get = async () => {
      const getCinemaList = await axios.get('http://localhost:8080/v1/getCinemas');
      console.log(getCinemaList.data);
      setCinemas(getCinemaList.data);
      setSelectedCinemaId('')
    };
    get();
  }, []);
  const handleDelete = async () =>{
    try{
      if(cinemaIdToDelete){
        setShowModal(false);
        const res = await axios.delete(`http://localhost:8080/v1/deleteCinema/${cinemaIdToDelete}`);
        window.location.reload(); 
        alert('Bạn đã xóa rạp thành công!!');
        
      }
    }catch(error){
      throw(error)
    }
  }

  const handleCreate = async () =>{
    const data = {
      nameCinema: nameCinema,
      username: username,
      num:num,
      email:email,
      address:address,
      password,password
    }
    if (password!==cfpassword){
      alert('Mật khẩu nhập lại chưa khớp!!');
      return
    }
    try{
      const res = await axios.post(`http://localhost:8080/v1/createCinema`,data);
      if (res.data.EC ===1){
        alert(`${res.data.EM}`);
        return
      }
      else if(res.data.EC===2){
        alert(`${res.data.EM}`);
        return
      }
      else{
        setAddCinema(false);
      console.log('data',res.data);
      alert('Bạn đã tạo rạp thành công');
      window.location.reload();
    }
      
    }catch(error){
      console.log(error);

    }
  }
  const closeModalEdit = () => {
    setIsModalOpen(false);
    setSelectedCinemaId(null); // Reset the selected cinema ID
    
  };
  const closeModal = () => {
    setShowModal(false); // Đóng modal
    setCinemaIdToDelete(null); // Reset ID
};
const filteredCinemas = Cinemas.filter((user) => {
  return (
    (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.user_id?.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.user_id?.num || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.user_id?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  return (
    <div className={cx('container')}>
      <div className={cx('top')}>
        <button onClick={handleAddCinem}>
          <FontAwesomeIcon className="fs-3 me-2" icon={faPlus} />Thêm rạp
        </button>
      </div>
      <h2>Danh sách Rạp</h2>
      <div className={cx('table-con')}>
        <div className={cx('finding')}>
          <div className={cx('search')}>
            <FontAwesomeIcon className="fs-3 me-2" icon={faSearch} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Rạp</th>
              <th>Tên Tài Khoản</th>
              <th>Số Điện Thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCinemas.map((item, index) => {
              return (
                <tr >
                  <td className={cx('text-container')}>{index + 1}</td>
                  <td className={cx('text-container')} >{item.name}  <span className={cx('tooltip')}>{item.name}</span></td>
                  <td className={cx('text-container')}>{item.user_id?.username || "no"}<span className={cx('tooltip')}>{item.user_id?.username || "no"}</span></td>
                  <td className={cx('text-container')}>{item.user_id?.num || "no"}<span className={cx('tooltip')}>{item.user_id?.num || "no"}</span></td>
                  <td className={cx('text-container')}>{item.user_id?.email || "no"}<span className={cx('tooltip')}>{item.user_id?.email || "no"}</span></td>
                  <td className={cx('text-container')}>{item.address || "no"}<span className={cx('tooltip')}>{item.address || "no"}</span></td>
                  <td className={cx('doing')}>
                  <FontAwesomeIcon className={cx('btn-edit')} icon={faPenToSquare} onClick={() => openModalEdit(item._id)}/> 

                   
                    <FontAwesomeIcon className={cx('btn-del')} icon={faTrash} onClick={() => openModalDelete(item._id)}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Add Cinema Modal */}
      {addCinema && (
        <div className={cx('modal-container')}>
          <div className={cx('modal-content')}>
            <h3 className={cx('tyle')}>Thêm rạp</h3>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Tên rạp</h4>
              <input type="text" name="cinemaname" className={cx('cinema-name', 'form-info')} value={nameCinema} onChange={(event)=>setNameCinema(event.target.value)}/>
            </div>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Địa chỉ</h4>
              <input type="text" name="address" className={cx('address', 'form-info')} value={address} onChange={(event)=>setAddress(event.target.value)}/>
            </div>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Tên tài khoản</h4>
              <input type="text" name="address" className={cx('address', 'form-info')} value={username} onChange={(event)=>setUsername(event.target.value)}/>
            </div>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Email</h4>
              <input type="email" name="address" className={cx('address', 'form-info')} value={email} onChange={(event)=>setEmail(event.target.value)}/>
            </div>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Số điện thoại</h4>
              <input type="text" name="address" className={cx('address', 'form-info')} value={num} onChange={(event)=>setNum(event.target.value)}/>
            </div>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Mật khẩu</h4>
              <input type="password" name="address" className={cx('address', 'form-info')} value={password} onChange={(event)=>setPassword(event.target.value)}/>
            </div>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Nhập lại mật khẩu</h4>
              <input type="password" name="address" className={cx('address', 'form-info')} value={cfpassword} onChange={(event)=>setCfpassword(event.target.value)}/>
            </div>
            <div className={cx('btn-con')}>
              <button type="button" className={cx('btn-confirm')} onClick={()=>handleCreate()}>
                Xác nhận
              </button>
            </div>
            <div className={cx('close-modal')} onClick={handleCloseModal}>
              <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-header')}>
              <h4>Xác nhận xóa</h4>
              <button type="button">×</button>
            </div>
            <div className={cx('modal-body')}>
              Bạn có chắc chắn muốn xóa rạp này?
            </div>
            <div className={cx('modal-footer')}>
              <button type="button"  onClick={closeModal}>Hủy</button>
              <button type="button" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
      <EditCinema
                      isOpen={isModalOpen}
                      onClose={closeModalEdit}
                      cinemaId={selectedCinemaId} // Pass selected cinema ID
                    />
    </div>
  );
}

export default CinemaList;
