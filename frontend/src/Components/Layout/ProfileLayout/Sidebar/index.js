import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faStar, faCartShopping, faArrowsRotate, faLock} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Import Tippy styles
import CryptoJS from 'crypto-js';


const cx = classNames.bind(styles);
function Sidebar(){
    const [points, setPoints] = useState(''); // Initial points
    const [promotion, setPromotion] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');
    const [resetModal, setResetModal] = useState(false); 
    const [currentpass, setCurrentpass] = useState('');
    const [newpass, setNewpass] = useState('');
    const [confirmpass, setConfirmpass] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const hashedCurrentPass = CryptoJS.SHA256(currentpass).toString();

    useEffect(() => {
        
        const fetchUserData = async () => {
            
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:8080/v1/Users/getUserbyid`, {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`

                        }
                        
                    });
                    console.log(response.data)
                   
                    setPoints(response.data.userFound.point);
                    setPromotion(response.data.userFound.promotions_id);
                    console.log("bb",response.data.userFound.promotions_id)
                    setIsLoggedIn(true);
                    setPassword(response.data.userFound.password)
                    
                
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
       
    
        fetchUserData();
    }, []);
  
    const handleChange = async (event) => {
        event.preventDefault();
        if (!currentpass || !newpass || !confirmpass) {
            setError('Vui lòng nhập đầy đủ các trường');
            setSuccess(null); 
            return;
        }
        // Ensure both passwords match
        if (newpass !== confirmpass) {
            setError('Mật khẩu nhập lại không đúng');
            setSuccess(null); 
            return;
        }
    
        try {
            console.log('Sending request to reset password:', {
                token,
                newpass,
            });
            const userData = {
                currentpassword:currentpass,
                newpassword: newpass,
            }
            const response = await axios.put('http://localhost:8080/v1/Users/password',userData,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            }  );
            console.log("loi passs",response)
            if (response.data.code === 200) {
                alert('Mật khẩu đã được đổi thành công')
                setResetModal(false) ;
                setCurrentpass('');
                setNewpass('');
                setConfirmpass('');
            }
            else if(response.data.code===400){
                setError('Mật Khẩu Cũ Không Đúng');
                setSuccess(null); 
            return;
            }
            else {
                setError(response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            } else {
                setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        }
    };
    
     const updatePoints = (newPoints) => {
        setPoints(newPoints);
    };
      const closeModal = () => {
     
        setResetModal(false);
      };
      const handleModalReset = () => {
        setResetModal(true);
    };
    
    return (  
         <div className={cx('tool-bar')}>
    <div className={cx('tool', 'row')}>
    
        <div className={cx('point-bar-container')}>
            <div className={cx('point-display')}>
                <p>Điểm của bạn: {points} </p>
            </div>

            <div className={cx('progress')}>
                <div
                    className={cx('progress-bar')}
                    role="progressbar"
                    style={{ width: `${(points / 10000000) * 100}%` }}
                    aria-valuenow={points}
                    aria-valuemin="0"
                    aria-valuemax="10000"
                ></div>
            </div>

      
        </div>

        <div className={cx('nav-container')}>
            <div className={cx('info', 'nav', 'd-flex')}   onClick={() => navigate('/profile')}>
                <FontAwesomeIcon className="fs-3 me-2" icon={faUser} />
                <h5>THÔNG TIN CÁ NHÂN</h5>
            </div>

            <div className={cx('SCORE', 'nav', 'd-flex')}    onClick={() => navigate('/voucher')}>
                <FontAwesomeIcon className="fs-3 me-2" icon={faStar} />
                <h5>ĐỔI ĐIỂM</h5>
            </div>

            <div className={cx('histor', 'nav', 'd-flex')} onClick={() => navigate('/history')}>
                <FontAwesomeIcon className="fs-3 me-2" icon={faCartShopping} />
                <h5>LỊCH SỬ GIAO DỊCH</h5>
            </div>
        </div>
    </div>
    <div className={cx('reset-pass','row')}>
        <div className={cx('wrap-pass')} onClick={handleModalReset} >
                <button className= {cx('btn-reset-pass')} >
                <FontAwesomeIcon className="fs-3 me-2" icon={faLock} />Đổi mật khẩu</button>
        </div>
      
    </div>
    
    {resetModal && (
                <div className={cx('modal-wrapper')}>
                    <div className={cx('modal-content')}>
                    <div className={cx('wrap-pass')}>
                    
                      <h4 className={cx('title-pass')}>MẬT KHẨU CŨ</h4>
                      <input 
                        type="password" 
                        name="currentpass" 
                        value={currentpass}
                        onChange={(event) => setCurrentpass(event.target.value)} 
                       

                        className={cx('fulname','from-pass')}     
                      />
                      </div>  
                      <div className={cx('wrap-pass')}>
                      <h4 className={cx('title-pass')}>MẬT KHẨU MỚI</h4>
                      <input 
                        type="password" 
                        name="newpass" 
                        value={newpass}
                        onChange={(event) => setNewpass(event.target.value)} 

                       

                        className={cx('fulname','form-info')}     
                      />
                      </div>  
                      <div className={cx('wrap-pass')}>
                      <h4 className={cx('title-pass')}>NHẬP LẠI MẬT KHẨU MỚI</h4>
                      <input 
                        type="password" 
                        name="confirmpass" 
                        value={confirmpass}
                        onChange={(event) => setConfirmpass(event.target.value)} 

                       

                        className={cx('fulname','form-pass')}     
                      />
                      </div>  
                      {error && <p className={cx('error-message')}>{error}</p>}
                    {success && <p className={cx('success-message')}>{success}</p>}
                        <button type='button' className={cx('btn-confirm')} onClick={handleChange}>
                            Đồng ý
                        </button>
                        <button className={cx('btn-cancel')} onClick={closeModal}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}
</div>

)

}
export default Sidebar