import React,{ useEffect, useState }  from 'react';
import classNames from 'classnames/bind';
import styles from './VoucherList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditVoucher from '../EditVoucher';
import images from '~/assets/img';
import axios from 'axios';
const cx = classNames.bind(styles);
function VoucherList() {
  const [showModal, setShowModal] = useState(false);
    const [addCinema,setAddCinema] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [currentImage, setCurrentImage] = useState('');
    const [isImageOpen, setImageOpen] = useState(false);
    const [vouncher,setVouncher] = useState([]);
    const [vouncherId,setVouncherId]= useState('')
    useEffect(()=>{
        const vouncherData = async () =>{
            try{
                const res = await axios('http://localhost:8080/v1/getPoints');
                console.log("sres",res.data);
                setVouncher(res.data);
            }catch{

            }
            
        }
        vouncherData();
    },[])
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  const openModalEdit = (id) => 
    {
        setIsModalOpen(true);
        setVouncherId(id);
        console.log("id",id)
    }
  const closeModalEdit = () => {
    setIsModalOpen(false);
    setVouncherId('');

        }

    const handleAddCinem =() =>{
        setAddCinema(true)
    }
    const handleCloseModal =() =>{
        setAddCinema(false)
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
            <button onClick={handleAddCinem}>
            <FontAwesomeIcon className="fs-3 me-2" icon={faPlus} />Thêm đồ ăn </button>
        </div>
        <h2>Danh sách mã giảm giá</h2>   
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
            <th>Tên mã</th>
            <th>Ảnh</th>
            <th>Mô tả</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Điểm đổi</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
            {vouncher.map((item,index)=>{
                return(
                    <tr key={index}>
                        <td>{index+1}</td>
                        <td>{item.title}</td>  
                        <td onClick={() => handleImageClick(item.image)}><img className={cx('img-food')} src={item.image}/></td>
                        <td className={cx('decript')}>{item.description}</td>
                        <td>{item.start_date}</td>
                        <td>{item.end_date}</td>
                        <td>{item.points}</td>
                        <td>
                        <button onClick={() => openModalEdit(item._id)}>Sửa</button> <EditVoucher isOpen={isModalOpen} vouncherId={vouncherId} onClose={closeModalEdit} />
                        <button>xóa</button>
                    </td>
            </tr>
                )
            })}
            
          
        
        </tbody>
      </table>
      </div>
      {addCinema &&(
        <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
            <h3 className={cx('tyle')}>Thêm mã </h3>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Tên mã</h4>
                <input 
                    type="text" 
                    name="vouchername" 
                    className={cx('voucher-name', 'form-info')}     
                />
            </div>
                    
            <div className={cx('content')}>
                <h4 className={cx('title')}>Thêm ảnh</h4>
                <input 
                    type="file" 
                    name="imgvoucher" 
                    accept="image/*" 
                    className={cx('imgvoucher', 'form-info')}     
                />
            </div>   
            <div className={cx('content')}>
                <h4 className={cx('title')}>Mô tả</h4>
                <textarea 
                    name="description" 
                    className={cx('description', 'form-info')}     
                />
            </div>  
            <div className={cx('content')}>
                <h4 className={cx('title')}>Ngày bắt đầu</h4>
                <input 
                    type="date" 
                    name="beginDate" 
                    className={cx('begin-date', 'form-info')}     
                />
            </div>  <div className={cx('content')}>
                <h4 className={cx('title')}>Ngày kết thúc</h4>
                <input 
                    type="date" 
                    name="endDate" 
                    className={cx('end-date', 'form-info')}     
                />
            </div>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Điểm</h4>
                <input 
                    type="number" 
                    name="point" 
                    className={cx('point', 'form-info')}     
                />
            </div>
   
                      <div className={cx('btn-con')}>
                      <button type='button' className={cx('btn-confirm')} >
                           Xác nhận
                        </button>
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
                            Bạn có chắc chắn muốn xóa món này?
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

export default VoucherList;