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
    const [vouncherId,setVouncherId]= useState('');
    const [vouncherIdToDelete,setVouncherIdToDelete]=useState(null)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        discount: "",
        end_date: "",
        start_date: "",
        points: "",     
    });
    const [image, setImage] = useState(null);
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === "image") setImage(e.target.files[0]);
    };

const handleAdd = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
    });

    if (image) data.append("image", image);
    
    try { 

        const response = await axios.post("http://localhost:8080/v1/createPoint", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Movie created:", response.data);
        setFormData({
        title: "",
        description: "",
        discount: "",
        end_date: "",
        start_date: "",
        points: "",     
        });
        setImage(null);
        if(response.status === 201){
            alert('Tạo mã thành công');
        window.location.reload();}
    } catch (error) {
        console.error("Error creating movie:", error);
    }
};
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
    const openModalDelete =  (vouncherId) => {
        setVouncherIdToDelete(vouncherId);
        setShowModal(true);
        
      }
      const closeModal = () => {
        setShowModal(false); 
        setVouncherIdToDelete(null);
    };
    const handleDelete = async () =>{
        try{
          if(vouncherIdToDelete){
            setShowModal(false);
            const res = await axios.delete(`http://localhost:8080/v1/deletePoint/${vouncherIdToDelete}`);
            window.location.reload(); 
            alert('Bạn đã xóa rạp thành công!!');
            
          }
        }catch(error){
          throw(error)
        }
      }
    return ( 
    <div className={cx('container')}>
        <div className={cx('top')}>
            <button onClick={handleAddCinem}>
            <FontAwesomeIcon className="fs-3 me-2" icon={faPlus} />Thêm mã giảm giá</button>
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
                        <button onClick={() => openModalDelete(item._id)}>xóa</button>
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
            <h3 className={cx('tyle')}>Thêm mã</h3>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Tên mã</h4>
                <input 
                    type="text" 
                    name="title" 
                    className={cx('voucher-name', 'form-info')}     
                    onChange={handleInputChange}
                />
            </div>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Discount</h4>
                <input 
                    type="text" 
                    name="discount" 
                    className={cx('voucher-name', 'form-info')}     
                    onChange={handleInputChange}
                />
            </div>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Thêm ảnh</h4>
                <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    className={cx('imgvoucher', 'form-info')}     
                    onChange={handleFileChange}

                />
            </div>   
            <div className={cx('content')}>
                <h4 className={cx('title')}>Mô tả</h4>
                <textarea 
                    name="description" 
                    className={cx('description', 'form-info')}  
                    onChange={handleInputChange}
                />
            </div>  
            <div className={cx('content')}>
                <h4 className={cx('title')}>Ngày bắt đầu</h4>
                <input 
                    type="date" 
                    name="start_date" 
                    className={cx('begin-date', 'form-info')}     
                    onChange={handleInputChange}
                />
            </div>  <div className={cx('content')}>
                <h4 className={cx('title')}>Ngày kết thúc</h4>
                <input 
                    type="date" 
                    name="end_date" 
                    className={cx('end-date', 'form-info')}     
                    onChange={handleInputChange}
                />
            </div>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Điểm</h4>
                <input 
                    type="number" 
                    name="points" 
                    className={cx('point', 'form-info')}     
                    onChange={handleInputChange}

                />
            </div>
   
                      <div className={cx('btn-con')}>
                      <button type='button' className={cx('btn-confirm')} onClick={handleAdd}>
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
                <button type="button" onClick={closeModal}>×</button>
            </div>
            <div className={cx('modal-body')}>
                Bạn có chắc chắn muốn xóa mã này?
            </div>
            <div className={cx('modal-footer')}>
                <button type="button" onClick={closeModal}>Hủy</button>
                <button type="button" onClick={handleDelete}>Xóa</button>
            </div>
        </div>
    </div>
)}
    </div>
);
}

export default VoucherList;