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
            console.log(response); // Check the response for more details
            if (response.status === 200) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    ...response.data.food,                   
                }));
            } else {
                console.log("Error: Failed to fetch food", response);
            }
        } catch (error) {
            console.log("Error fetching food:", error);
        }
    };
    
    

    const handleSubmit = async () => {
        console.log("formData", formData);
        try {
            const response = await axios.put(`http://localhost:8080/v1/Food/editFood/${foodId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.status === 200) {
                alert('Cập nhật thành công');
                window.location.reload(); 
            }
            console.log("Voucher updated:", response.data);
        } catch (error) {
            console.log("Error updating voucher:", error);
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
                        <select
                            type="text"
                            name="category"
                            className={cx("form-info")}
                            onChange={handleInputChange}
                            value={formData.category}
                        >
                             <option value="" disabled>Chọn loại</option>
                    <option value="food">food</option>
                    <option value="drink">drink</option>
                        </select>
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
                            name="Image"
                            accept="image/*"
                            className={cx("form-info")}
                            onChange={(e) => setFormData({...formData,Image: e.target.files[0]})}
                            />
                    </div>
                </div>
            </div>

            <div className={cx("btn-con")}>
                <button type="button" className={cx("btn-confirm")} onClick={handleSubmit}>
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
