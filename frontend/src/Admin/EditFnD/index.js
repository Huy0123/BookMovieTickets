import React , {useState, useEffect}from "react";
import classNames from 'classnames/bind';
import styles from './EditFnD.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const cx = classNames.bind(styles);
const EditFnD = ({ isOpen, onClose,foodId }) => {
    const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    Image: null
    });

    
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const fetchFoodId = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/Food/getFoodById/${id}`);
            console.log("REs",response.data)
            setFormData(prevFormData => ({
                ...prevFormData,
                ...response.data.food,
            }));
            
        } catch (error) {
            console.log("Error fetching movie:", error);
        }
    };
    

    const handleSumbit = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/v1/Food/editFood/${foodId}`, formData, {
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
            fetchFoodId(foodId);
        }
    }, [isOpen, foodId]);


  

  if (!isOpen) return null;

  return (
    <div className={cx("modal-container")}>
        <div className={cx("modal-content")}>
            <h3 className={cx("tyle")}>Chỉnh sửa đồ ăn</h3>
            <div className="row">
                <div className="col d-flex flex-column gap-2">
                    <div className={cx("content")}>
                        <h4 className={cx("title")}>Tên đồ ăn</h4>
                        <input
                            type="text"
                            name="name"
                            className={cx("form-info")}
                            onChange={handleInputChange}
                            value={formData.name}
                        />
                    </div>

                    <div className={cx("content")}>
                        <h4 className={cx("title")}>Loại</h4>
                        <input
                            type="text"
                            name="category"
                            className={cx("form-info")}
                            onChange={handleInputChange}
                            value={formData.category}
                        />
                    </div>

                    <div className={cx("content")}>
                        <h4 className={cx("title")}>Đơn giá</h4>
                        <input
                            type="number"
                            name="price"
                            className={cx("form-info")}
                            onChange={handleInputChange}
                            value={formData.price}
                        />
                    </div>

                    <div className={cx("content")}>
                        <h4 className={cx("title")}>Ảnh đồ ăn</h4>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className={cx("form-info")}
                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        />
                    </div>
                </div>
            </div>

            <div className={cx("btn-con")}>
                <button type="button" className={cx("btn-confirm")} onClick={handleSumbit}>
                    Xác nhận
                </button>
            </div>

            <div className={cx("close-modal")} onClick={onClose}>
                <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
            </div>
        </div>
    </div>
);
};

export default EditFnD;
