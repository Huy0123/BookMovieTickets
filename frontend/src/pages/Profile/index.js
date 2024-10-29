import React, { useState,useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faStar, faCartShopping, faArrowsRotate, faLock} from '@fortawesome/free-solid-svg-icons';
import axios
 from 'axios';
import ResetPassword from '../ResetPassword';

const cx = classNames.bind(styles);

function Profile() {
    const [points, setPoints] = useState(''); // Initial points
    const [activeTab, setActiveTab] = useState('info');
    const [activeTabVoucher, setActiveTabVoucher] = useState('left');
    const [showModal, setShowModal] = useState(false);
    const [showYN, setShowYNModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [fullname,setFullname] = useState('');
    const [num, setNum] = useState('');
    const [email, setEmail] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userId'));
    const [allVouncher, setAllVouncher] = useState('')
 
    // Handle point redemption
    // const handleRedeem = () => {
    //     if (points >= 6000) {
    //         setPoints(points - 6000);
    //         alert('Bạn đã đổi 1000 điểm thành công!');
    //     } else {
    //         alert('Không đủ điểm để đổi!');
    //     }
    // };
    useEffect(() => {
        
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('userToken')
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
                    setPoints(response.data.userFound.point);
                    setIsLoggedIn(true);
                    const resvouncher = await axios.get(`http://localhost:8080/v1/getPoints`);
                    setAllVouncher(resvouncher.data)
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
            console.log(userId)
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
            console.log(response.data)
            alert('Cap nhat tahnh cong cong')
        }catch(error){
            throw(error)
        }
    }
    const handleTabSwitch = (tab) => {
        setActiveTab(tab); // Update active section
    };
    const handleSwichvouvher = (tabVouher) => {
        setActiveTabVoucher(tabVouher); // Update active section
    };

    // Handle voucher redemption (dummy example)
    const handleYNClick = (voucher) => {
        setModalContent(`Bạn có đồng ý đổi mã không`);
        setShowYNModal(true);
      };
    
    const handleVoucherClick = (voucher) => {
        if (points >= 1000) {
            setPoints(points - 1000);
          setModalContent(`Đổi mã ${voucher} thành công!`);
        } else {
          setModalContent(`Đổi mã ${voucher} thất bại. Bạn không đủ điểm.`);
        }
        setShowModal(true);
      };
    
      const closeModal = () => {
        setShowModal(false);
        setShowYNModal(false);
      };

    return (
        <div className={cx('container', 'py-4')}>
            <div className={cx('wrap-profile', 'row justify-content-center')}>
                <div className="col-3">
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
                                        style={{ width: `${(points / 100000) * 100}%` }}
                                        aria-valuenow={points}
                                        aria-valuemin="0"
                                        aria-valuemax="10000"
                                    ></div>
                                </div>

                                {/* <button 
                                    onClick={handleRedeem} 
                                    className={cx('btn',' mt-3')}
                                   
                                >
                                    Đổi 1000 điểm
                                </button> */}
                            </div>

                            <div className={cx('nav-container')}>
                                <div className={cx('info', 'nav', 'd-flex')}  onClick={() => handleTabSwitch('info')}>
                                    <FontAwesomeIcon className="fs-3 me-2" icon={faUser} />
                                    <h5>THÔNG TIN CÁ NHÂN</h5>
                                </div>

                                <div className={cx('SCORE', 'nav', 'd-flex')}  onClick={() => handleTabSwitch('redeem')}>
                                    <FontAwesomeIcon className="fs-3 me-2" icon={faStar} />
                                    <h5>ĐỔI ĐIỂM</h5>
                                </div>

                                <div className={cx('histor', 'nav', 'd-flex')} onClick={() => handleTabSwitch('history')}>
                                    <FontAwesomeIcon className="fs-3 me-2" icon={faCartShopping} />
                                    <h5>LỊCH SỬ GIAO DỊCH</h5>
                                </div>
                            </div>
                        </div>
                        <div className={cx('reset-pass','row')}>
                            <div className={cx('wrap-pass')}>
                                    <button className= {cx('btn-reset-pass')}>
                                    <FontAwesomeIcon className="fs-3 me-2" icon={faLock} />Đổi mật khẩu</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-7">
                {activeTab === 'info' && (
                    <div className={cx('modal-info','infomation', 'border p-4 ')}>
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
                        // value={fullname}
                        className={cx('number','form-info')}     
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
                )}
                {activeTab === 'history' && (
                    <div className={cx('modal-info','modal-histor', 'border p-4')}>
                    <h3 className={cx('title-info')}>THÔNG TIN THANH TOÁN</h3>

                        <div className={cx('histor-contain','main-contain')}>
                            <div className='w-100 row'>

                          
                            <div className={cx('col-1','rower')}>
                                Stt
                            </div>
                            <div className={cx('col-2','rower')}>
                                Tên phim
                            </div>
                            <div className={cx('col-2','rower')}>
                                Ngày dặt
                            </div>
                            <div className={cx('col-1','rower')}>
                                Phòng
                            </div>
                            <div className={cx('col-1','rower')}>
                                Số ghế
                            </div>
                            <div className={cx('col-1','rower')}>
                                Bắp nước
                            </div>  
                            <div className={cx('col-2','rower')}>
                                Giá tiền
                            </div>
                            <div className={cx('col-2','rower')}>
                               Trạng thái
                            </div>
                            </div>
                        </div>
                        
                        <div className={cx('histor-content')}>
                        <div className='w-100 row'>
                            <div className={cx('col-1','rower')}>
                               1
                            </div>
                            <div className={cx('col-2','rower')}>
                               ten phim that la dai qua la dai luon
                            </div>
                            <div className={cx('col-2','rower')}>
                              12/3/2020
                            </div>
                            <div className={cx('col-1','rower')}>
                               P02
                            </div>
                            <div className={cx('col-1','rower')}>
                               A5
                            </div>
                            <div className={cx('col-1','rower')}>
                                Bắp nước
                            </div>  
                            <div className={cx('col-2','rower')}>
                               1.352.000
                            </div>
                            <div className={cx('col-2','rower')}>
                              đã thanh toán
                            </div>
                            </div>
                            
                        </div>
                        
                       
                    </div>
                )}
                {activeTab === 'redeem' && (
                    <div className={cx('modal-info','traid-point' ,'border p-4 ')}>
                        <h3 className={cx('title-info')}>ĐỔI ĐIỂM</h3>
                        {/* Add additional user information content here */}
                        <div className={cx('side','row')}>
                        { activeTabVoucher=== 'left' &&( 
                            <div className={cx('left')}>
                            <div className={cx('modal-voucher')}>
                                {allVouncher.map((item, index) => (
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
                                            onClick={() => handleYNClick(item.title || 'Giảm 20%')}
                                        >
                                            <FontAwesomeIcon className="fs-3 me-2" icon={faArrowsRotate} />
                                            {item.points || 1000}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            </div>
                        )}
                        {activeTabVoucher === 'right' && (
                            <div className={cx('right')}>
                            <div className={cx('modal-voucher')}>
                            <div className={cx('voucher')}>
                                        <div className={cx('wrap-img')}>
                                            <img 
                                                className={cx('img-vou')} 
                                                src={'https://th.bing.com/th/id/OIP.SttmDc21xA1TN35hJZiNewHaHa?rs=1&pid=ImgDetMain'} 
                                                alt={`Voucher ${'Giảm 20%'}`}
                                            />
                                        </div>
                                        <div className={cx('vou-info')}>
                                            <div>
                                                <h4 className={cx('ten-ma')}>{ 'Giảm 20%'}</h4>
                                                <p className={cx('mota')}>{ 'Mô tả voucher không có sẵn'}</p>
                                            </div>
                                            <div className='fs-5'>
                                                <p className={cx('datestart')}>Ngày bắt đầu: {new Date ().toLocaleDateString() }</p>
                                                <p className={cx('dateend')}>Ngày kết thúc: {new Date ().toLocaleDateString() }</p>
                                            </div>
                                        </div>
                                     
                                    </div>
                            </div>  
                            </div>
                        )}
                            <div className={cx('mid')}>
                                 <button className={cx('btn-traid-code')} onClick={() => handleSwichvouvher('left')}>Đổi mã</button>
                                <button className={cx('btn-my-code')} onClick={() => handleSwichvouvher('right')}>Mã của tôi</button>
                            </div>
                        </div>
                     
                    </div>
                )}
                </div>
            </div>
            {showModal && (
                <div className={cx('modal-wrapper')}>
                    <div className={cx('modal-content')}>
                        <p>{modalContent}</p>
                        <button className={cx('btn-cancel')} onClick={closeModal}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            
            {/* Modal xác nhận */}
            {showYN && (
                <div className={cx('modal-wrapper')}>
                    <div className={cx('modal-content')}>
                        <p>{modalContent}</p>
                        <button className={cx('btn-confirm')} onClick={() => {closeModal();handleVoucherClick('da'); }}>
                            Đồng ý
                        </button>
                        <button className={cx('btn-cancel')} onClick={closeModal}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}
            {resetPass && (
                <div>
            )}
        </div>
    );
}

export default Profile;
