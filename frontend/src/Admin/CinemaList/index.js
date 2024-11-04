import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CinemaList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditCinema from '../EditCinema';
import axios from 'axios';

const cx = classNames.bind(styles);

function CinemaList() {
  const [showModal, setShowModal] = useState(false);
  const [addCinema, setAddCinema] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [Cinemas, setSinemas] = useState([]);
    
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const openModalEdit = (cinemaId) => {
    setSelectedCinemaId(cinemaId); // Set the selected cinema ID
    setIsModalOpen(true);
  };

  

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
      setSinemas(getCinemaList.data);
      setSelectedCinemaId('')
    };
    get();
  }, []);
  const closeModalEdit = () => {
    setIsModalOpen(false);
    setSelectedCinemaId(null); // Reset the selected cinema ID
    
  };
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
          <div className={cx('filter')}>
            <FontAwesomeIcon className="fs-3" icon={faFilter} />
            <select id="options" value={selectedOption}>
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
              <th>ID</th>
              <th>Tên Rạp</th>
              <th>Tên Tài Khoản</th>
              <th>Số Điện Thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {Cinemas.map((item, index) => {
              return (
                <tr >
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.user_id?.username || "no"}</td>
                  <td>{item.user_id?.num || "no"}</td>
                  <td>{item.user_id?.email || "no"}</td>
                  <td>{item.address || "no"}</td>
                  <td>
                    <button onClick={() => openModalEdit(item._id)}>chỉnh sửa</button>
                    <EditCinema
                      isOpen={isModalOpen}
                      onClose={closeModalEdit}
                      cinemaId={selectedCinemaId} // Pass selected cinema ID
                    />
                    <button>xóa</button>
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
            <h3 className={cx('tyle')}>Chỉnh sửa rạp </h3>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Tên rạp</h4>
              <input type="text" name="cinemaname" className={cx('cinema-name', 'form-info')} />
            </div>
            <div className={cx('content')}>
              <h4 className={cx('title')}>Địa chỉ</h4>
              <input type="text" name="address" className={cx('address', 'form-info')} />
            </div>
            <div className={cx('btn-con')}>
              <button type="button" className={cx('btn-confirm')}>
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
              Bạn có chắc chắn muốn xóa người dùng này?
            </div>
            <div className={cx('modal-footer')}>
              <button type="button">Hủy</button>
              <button type="button">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CinemaList;
