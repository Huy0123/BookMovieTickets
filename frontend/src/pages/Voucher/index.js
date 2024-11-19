import React, { useState,useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Voucher.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faStar, faCartShopping, faArrowsRotate, faLock} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';



const cx = classNames.bind(styles);

function Voucher() {
    const [points, setPoints] = useState(''); // Initial points
  
    const [activeTabVoucher, setActiveTabVoucher] = useState('left');
    const [showModal, setShowModal] = useState(false);
    const [showYN, setShowYNModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
 
    const [promotion, setPromotion] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
    const [allVouncher, setAllVouncher] = useState('')
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);
    const [pointvoun,setPointvoun]= useState('')
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
                   
                    setPoints(response.data.userFound.point);
                    setPromotion(response.data.userFound.promotions_id);
                    setIsLoggedIn(true);
    
                    const resvouncher = await axios.get(`http://localhost:8080/v1/getPoints`);
                    console.log('Voucher data:', resvouncher.data);
                    setAllVouncher(Array.isArray(resvouncher.data) ? resvouncher.data : []);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
        fetchUserData();
    }, []);
    
  
    const handleSwichvouvher = (tabVouher) => {
        setActiveTabVoucher(tabVouher); // Update active section
    };

    // Handle voucher redemption (dummy example)
    const handleYNClick = (voucher) => {
        setModalContent(`Bạn có đồng ý  đổi mã ${voucher} không`);
        setShowYNModal(true);
        
      };
     
    const handleVoucherClick = async (pointId) => {
        setSelectedVoucherId(pointId);
        
        console.log(pointId);
        const data = {
            pointId:pointId,
            userId: userId
        }
       try{
        const res = await axios.post(`http://localhost:8080/v1/exchange`,data);
            console.log(res.data);
           
            if (res.status === 200) {
                const pointTitle = res.data.point ? res.data.point.title : 'Voucher';
                setModalContent(`Bạn đẫ đổi mã ${pointTitle} thành công`);
                setPoints(res.data.remainingPoints);
                console.log(res.data.remainingPoints);
                setShowModal(true);
                
            } else {
                alert(res.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
       } catch(error)  {
        console.log("error",error)
            if(error.response.data.message==="A"){
                alert('Số điểm của bạn không đủ để đổi điểm');
            }
       }
        
      };
  
      const closeModal = () => {
        if (showModal===true){
            window.location.reload();
        }
        setShowModal(false);
        setShowYNModal(false);
        
      };
    
    
    return (
        <div className={cx('container')}>
            <div className={cx('wrap-profile', 'row justify-content-center')}>
              

                <div className="col">
              
             
                
                    <div className={cx('modal-info','traid-point' ,'border p-4 ')}>
                        <h3 className={cx('title-info')}>ĐỔI ĐIỂM</h3>
                        {/* Add additional user information content here */}
                        <div className={cx('side','row')}>
                        { activeTabVoucher=== 'left' &&( 
                            <div className={cx('left')}>
                            <div className={cx('modal-voucher')}>
                                {Array.isArray(allVouncher) && allVouncher.map((item, index)  => {
                                    if(item.points!=0 && new Date(item.start_date) <= new Date()){
                                        return(
                                            <div key={index} className={cx('voucher')}>
                                                                                    <div className={cx('wrap-img')}>
                                                                                        <img 
                                                                                            className={cx('img-vou')} 
                                                                                            src={item.image || 'https://th.bing.com/th/id/OIP.SttmDc21xA1TN35hJZiNewHaHa?rs=1&pid=ImgDetMain'} 
                                                                                            alt={`Voucher ${item.title || 'Giảm 20%'}`}
                                                                                        />
                                                                                    </div>
                                                                                    <div className={cx('vou-info')}>
                                                                                        <div>
                                                                                            <h4 className={cx('ten-ma')}>{item.title || 'Giảm 20%'}</h4>
                                                                                            <p className={cx('mota')}>{item.description || 'Mô tả voucher không có sẵn'}</p>
                                                                                        </div>
                                                                                        <div className='fs-5'>
                                                                                            <p className={cx('datestart')}>Ngày bắt đầu: {new Date (item.start_date).toLocaleDateString() }</p>
                                                                                            <p className={cx('dateend')}>Ngày kết thúc: {new Date (item.end_date).toLocaleDateString() }</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <button
                                                                                            className={cx('btn-poi')} 
                                                                                        onClick={() => {
                                                                                            handleYNClick(item.title || 'Giảm 20%');
                                                                                            setSelectedVoucherId(item._id);
                                                                                            setPointvoun(item.points)
                                                                                        }}
                                                                                    >
                                                                                        <FontAwesomeIcon className="fs-3 me-2" icon={faArrowsRotate} />
                                                                                        {item.points }
                                                                                    </button>
                                                                                </div>
                                                                                )
                                    }
                                   
                                   
                                    
                                })}
                            </div>

                            </div>
                        )}
                        {activeTabVoucher === 'right' && (
                            <div className={cx('right')}>
                            <div className={cx('modal-voucher')}>
                            {promotion.map((item, index) => (
                                <div key={index} className={cx('voucher','for-right')}>
                                        <div className={cx('wrap-img')}>
                                            <img 
                                                className={cx('img-vou')} 
                                                src={item.image || 'https://th.bing.com/th/id/OIP.SttmDc21xA1TN35hJZiNewHaHa?rs=1&pid=ImgDetMain'} 
                                                alt={`Voucher ${item.title || 'Giảm 20%'}`}
                                            />
                                        </div>
                                        <div className={cx('vou-info')}>
                                            <div>
                                                <h4 className={cx('ten-ma')}>{item.title || 'Giảm 20%'}</h4>
                                                <p className={cx('mota')}>{item.description || 'Mô tả voucher không có sẵn'}</p>
                                            </div>
                                            <div className='fs-5'>
                                                <p className={cx('datestart')}>Ngày bắt đầu: {new Date (item.start_date).toLocaleDateString() }</p>
                                                <p className={cx('dateend')}>Ngày kết thúc: {new Date (item.end_date).toLocaleDateString() }</p>
                                            </div>
                                        </div>
                                        
                                </div>
                                ))}
                            </div>  
                            
                            </div>
                            
                        )}
                            <div className={cx('mid')}>
                                 <button className={cx('btn-traid-code')} onClick={() => handleSwichvouvher('left')}>Đổi mã</button>
                                <button className={cx('btn-my-code')} onClick={() => handleSwichvouvher('right')}>Mã của tôi</button>
                            </div>
                        </div>
                     
                    </div>
               
                </div>
            </div>
           
         
      
            {showModal && (
                <div className={cx('modal-wrapper')}>
                    <div className={cx('modal-content')}>
                     
                        <h4>{modalContent}</h4>
                        <button className={cx('btn-cancel')} onClick={closeModal} >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            
            {/* Modal xác nhận */}
            {showYN && (
                <div className={cx('modal-wrapper')}>
                    <div className={cx('modal-content')}>

                        <h4>{modalContent}</h4>
                        <button className={cx('btn-confirm')} onClick={() => {closeModal();handleVoucherClick(selectedVoucherId); }}>
                            Đồng ý
                        </button>
                        <button className={cx('btn-cancel')} onClick={closeModal}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default Voucher;