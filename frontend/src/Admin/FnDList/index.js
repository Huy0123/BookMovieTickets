import React,{ useEffect, useState }  from 'react';
import classNames from 'classnames/bind';
import styles from './FnDList.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditFnD from '../EditFnD';
import images from '~/assets/img';
import axios from 'axios';
const cx = classNames.bind(styles);
function FnDList() {
  const [showModal, setShowModal] = useState(false);
    const [addCinema,setAddCinema] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [currentImage, setCurrentImage] = useState('');
    const [isImageOpen, setImageOpen] = useState(false);
    const [food,setFood] = useState([]);
    const [foodId,setFoodId] = useState('')
    const [foodIdToDelete,setFoodIdToDelete]=useState('');
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      discount: "",
      end_date: "",
      start_date: "",
      points: "",     
  });
  const [Image, setImage] = useState(null);
  const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
      if (e.target.name === "Image") setImage(e.target.files[0]);
  };

const handleAdd = async () => {
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
  });

  if (Image) data.append("Image", Image);
  
  try { 

      const response = await axios.post("http://localhost:8080/v1/Food/createrFood", data, {
          headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Movie created:", response.data);
      setFormData({
      name: "",
      category: "",
      price: "",
      });
      setImage(null);
      if(response.status === 201){
          alert('Tạo F&D thành công');
      window.location.reload();}
  } catch (error) {
      console.error("Error creating movie:", error);
  }
};
    useEffect(()=>{
      const fetchFood= async()=>{
        try{
          const res = await axios.get('http://localhost:8080/v1/Food/getFood');
          setFood(res.data.Food);
          console.log("Res",res.data)
        }catch{

        }
      }
      fetchFood()
    },[])
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };
  const openModalEdit = (id) => 
    {setIsModalOpen(true);
      setFoodId(id)
    }
  const closeModalEdit = () => {
    setIsModalOpen(false);
    setFoodId('')

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
    const openModalDelete =  (foodId) => {
      setFoodIdToDelete(foodId);
      setShowModal(true);
      
    }
    const closeModal = () => {
      setShowModal(false); 
      setFoodIdToDelete('');
  };
  const handleDelete = async () =>{
    try{
      if(foodIdToDelete){
        setShowModal(false);
        const res = await axios.delete(`http://localhost:8080/v1/Food/deleteFood/${foodIdToDelete}`);
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
            <FontAwesomeIcon className="fs-3 me-2" icon={faPlus} />Thêm đồ ăn </button>
        </div>
        <h2>Danh sách đồ ăn</h2>   
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
            <th>Tên đồ ăn</th>
            <th>Loại</th>
            <th>ảnh</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {food.map((item,index)=>{
            return(
              <tr key={index}>
              <td>{index+1}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              
              <td onClick={() => handleImageClick(item.Image)}><img className={cx('img-food')} src={item.Image}/></td>
              <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
              <td>
              <button onClick={() => openModalEdit(item._id)}>Sửa</button> <EditFnD isOpen={isModalOpen} onClose={closeModalEdit}  foodId={foodId}/>
                <button type='button' onClick={() => openModalDelete(item._id)}>xóa</button>
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
            <h3 className={cx('tyle')}>Thêm đồ ăn</h3>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Tên đồ ăn</h4>
                <input 
                    type="text" 
                    name="name" 
                    className={cx('food-name', 'form-info')}     
                    onChange={handleInputChange}
                            value={formData.name}
                />
            </div>
            <div className={cx('content')}>
                <h4 className={cx('title')}>Loại</h4>
                <input 
                    type="text" 
                    name="category" 
                    className={cx('type', 'form-info')}    
                    onChange={handleInputChange}
                            value={formData.category} 
                />
            </div>            
            <div className={cx('content')}>
                <h4 className={cx('title')}>Thêm ảnh</h4>
                <input 
                    type="file" 
                    name="Image" 
                    accept="image/*" 
                    className={cx('imgFood', 'form-info')}     
                    onChange={handleFileChange}

                />
            </div>   
            
            <div className={cx('content')}>
                <h4 className={cx('title')}>Đơn giá</h4>
                <input 
                    type="number" 
                    name="price" 
                   
                    className={cx('price', 'form-info')}   
                    onChange={handleInputChange}
                            value={formData.price}   
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

export default FnDList;