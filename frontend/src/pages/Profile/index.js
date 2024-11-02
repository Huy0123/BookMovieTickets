import React, { useState,useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faStar, faCartShopping, faArrowsRotate, faLock} from '@fortawesome/free-solid-svg-icons';
import axios
 from 'axios';


const cx = classNames.bind(styles);



function Profile() {

    const [fullname,setFullname] = useState('');
    const [num, setNum] = useState('');
    const [email, setEmail] = useState('')

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');
 

  
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
                    setFullname(response.data.userFound.fullname);
                    setNum(response.data.userFound.num);
                    setEmail(response.data.userFound.email);
                   
                    console.log("bb",response.data.userFound.promotions_id)
                   
                    const resvouncher = await axios.get(`http://localhost:8080/v1/getPoints`);
                  
                    
                    console.log(resvouncher.data)
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
       
    
        fetchUserData();
    }, []);
    const handlesubmit = async (event) => {
        event.preventDefault();
        const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('userToken')
            console.log(userId);
        try {
            
            const datasubmit= {
                fullname : fullname,
                num: num,
                email: email,
            }
            
            const response= await axios.put(`http://localhost:8080/v1/Users/updateUser/${userId}`, 
                datasubmit,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true, 
                }
            
            
                
            )
            console.log(response.data);
            if (!fullname || !num){
                alert('Bạn cần nhập đầy đủ các trường');
                return

            }
            alert('Cập nhật người dùng thành công');
            window.location.reload();
        }catch(error){
            throw(error)
        }
    }
   
  

    // Handle voucher redemption (dummy example)
   
     
  
  
  
   
    return (
        <div className={cx('container')}>
            <div className={cx('wrap-profile', 'row justify-content-center')}>
            

                <div className="col">
              
                    <div className={cx('modal-info','infomation', ' p-4 ')}>
                        <h3 className={cx('title-info')}>THÔNG TIN TÀI KHOẢN</h3>
                        {/* Add additional user information content here */}
                      <div className={cx('wrap-info-user')}>
                      <h4 className={cx('info-user-etc')}>TÊN ĐẦY ĐỦ</h4>
                      <input 
                        type="text" 
                        id="fullname" 
                        name="fullname" 
                        value={fullname}
                        onChange={(event) => setFullname(event.target.value)} 

                        // value={fullname}

                        className={cx('fulname','form-info')}     
                      />
                      </div>
                      <div className={cx('wrap-info-user')}>
                      <h4 className={cx('info-user-etc')}>SỐ ĐIỆN THOẠI</h4>
                      <input 
                        type="text" 
                        id="number" 
                        name="number" 
                        value={num}
                        className={cx('number','form-info')} 
                        onChange={(event) => setNum(event.target.value)} 
                      />
                      </div>
                      <div className={cx('wrap-info-user')}>
                      <h4 className={cx('info-user-etc')}>EMAIL</h4>
                   
                      <div 
                        type="text" 
                        id="Email" 
                        className={cx('number','form-info')}
                      >{email}    
                      </div>
                      </div>
                      <button className={cx('save-change')} onClick={handlesubmit}>Lưu những thay đổi</button>
                    </div>
               
             
                </div>
            </div>
           
         
      
          
          
            
        </div>
    );
}

export default Profile;
