import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { faEnvelope, faSackDollar, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import apiClient from "~/services/apiClient";

const cx = classNames.bind(styles);
function Payment(){
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state || {}; // Nếu state không xác định, mặc định là một object rỗng
    const [fullname,setFullname]=useState('');
    const [email,setEmail]=useState('');
    const [totalprice,settotalprice]=useState(order.totalPrice)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [promo,setPromo] = useState([]);
    const [selectMethodPay,setselectMethodPay]=useState(null);   
    const [pointid,setPointid]=useState('')
    const [foodarr,setfoodarr]=useState([])
    const user_id = localStorage.getItem('userId')
    console.log("sss",order)
    
    const options = [
        {
            value: 'momo',
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src="https://s3-alpha-sig.figma.com/img/eece/7805/f6c96f488485adb6316ff593fb7c2cbe?Expires=1731283200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MFs0e4VrkFnv6mXDTmbft5cKd7ZhVROLu48ARs6b8QkIthKcD63ptSAwKKyFMOS4o6rsP3uP3qbzomJn2HDLh9m-Y7wojSs5UxrTaPvZT92NV5vtLAdaTabdQg8wKESmgYaMdhBCe4Zq5JTxZTmSdlvrJMwenHJiAyKEUEKu4k1h3xTwK5dyGhYfXV1nzKvFIJVUGeORM5M3ZgFEh6JFGl~UdTHvke4KUIhNwQOQ3ynf~XeogRrz3CNeZO1dEDSjssP2NPNc0pVK-l5OYoAwHeeaPriBbRBiKBAa5V35qQonuPXchE6eGjvpyj2i9OL698gWCchPfXoyr3iy6W~MGw__"
                        alt="Momo Icon"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                    />
                    Thanh Toán Bằng MoMo
                </div>
            ),
        },
        {
            value: 'vnpay',
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src = {images.vnpay}
                        alt="Momo Icon"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                    />
                    Thanh Toán Bằng Vnpay
                </div>
            ),
        },
        {
            value: 'zalopay',
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src = {images.zalopay}
                        alt="Momo Icon"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                    />
                    Thanh Toán Bằng Zalopay
                </div>
            ),
        },
       
    ];

    
    const handlePromoChange = async (selectedOption) => {
        if (selectedOption) {
            setPointid(selectedOption.value);
            const promotion = await apiClient.get(`getPointByID/${selectedOption.value}`)
                    console.log("promotion",promotion.data.discount) 
                    settotalprice(order.totalPrice-(order.totalPrice*promotion.data.discount)) // Cập nhật pointid từ giá trị đã chọn
            console.log("Selected Point ID:", selectedOption.value); 
        } else {
            setPointid(''); // Nếu không có lựa chọn, đặt lại pointid
          
        }
    };
    

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('userToken')
            if (userId) {
                try {
                    const response = await apiClient.get(`/Users/getUserbyid`, {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                        
                    });
                    console.log("bb",response.data)
                    setFullname(response.data.userFound.fullname);
                    setIsLoggedIn(true);
                    setEmail(response.data.userFound.email)
                   
                    setPromo(response.data.userFound.promotions_id);
                    console.log(response.data.userFound.promotions_id)
                    let Foods=[]
                    for(const food of order.foodId){
                        const foodin4 = await axios.get(`http://localhost:8080/v1/Food/getFoodById/${food.foodid}`)
                        console.log('foodin4',{name:foodin4.data.food.name,quantity:food.count})
                        Foods.push({name:foodin4.data.food.name,quantity:food.count})
                        
                   }
                   console.log("pointid",pointid)
                //    if(pointid!=''){
                    
                //    }
                  
                   
                   setfoodarr(Foods)
                   
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };
       
       
    
        fetchUserData();
    }, []);

    const handleMethod=(data)=>{

        setselectMethodPay(data.value)
        console.log(data.value)
    }
    const optionMGG = promo.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.value === item._id);
        
        if (existingItem) {
            // Nếu đã tồn tại, tăng số đếm
            existingItem.count += 1;
            existingItem.label = (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={item.image} // Thay bằng URL ảnh mã giảm giá nếu có
                        alt="Icon"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                    />
                    {item.title} ({item.description}) x{existingItem.count}
                </div>
            );
        } else {
            // Nếu chưa tồn tại, thêm mới vào acc với số đếm là 1
            acc.push({
                value: item._id,
                count: 1,
                label: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={item.image}
                            alt="Icon"
                            style={{ width: '20px', height: '20px', marginRight: '8px' }}
                        />
                        {item.title} ({item.description})
                    </div>
                ),
            });
        }
    
        return acc;
    }, []);
    
    const handlepay = async (event) => {
        event.preventDefault();
        try {
            if(!selectMethodPay){
                alert("Vui lòng chọn phương Thức thanh toán khi thanh toán.");
                return;
            }
            
           
            const Oder = {
                user_id:user_id,
                showtime_id:order.selectedShowtimeId,
                seats_id:order.seatid,     
                FoodAndDrinks_id: order.foodId.map(foodItem => ({
                    item_id: foodItem.foodid,
                    quantity: foodItem.count
                })),  
                    
            }
            if(pointid){
                Oder.pointid = pointid;
                console.log(Oder)
            
            }
           
            const orderCreater=await apiClient.post('/Booking',Oder)
            console.log("orderCreater",orderCreater.data)
            console.log("orderCreater",orderCreater.data.order_infor)
   
            
                const data = { amount: totalprice ,orderId:orderCreater.data.orders_infor._id};
                console.log("data",data)
            if(selectMethodPay==="momo"){
                const resPay = await apiClient.post('/Payment', data);
                console.log("resPay.data",resPay.data)
                // Chuyển hướng đến URL thanh toán
                if (resPay.data && resPay.data.payUrl) {
                    window.location.href = resPay.data.payUrl; // mở URL trong tab hiện tại
                }
            }
            else if(selectMethodPay==="vnpay"){
                const resPay = await apiClient.post('/Payment/createrVnpay', data);
                if (resPay.data && resPay.data.paymentUrl) {
                    window.location.href = resPay.data.paymentUrl; // mở URL trong tab hiện tại
                }
            }
            else if(selectMethodPay==="zalopay"){
                const resPay = await apiClient.post('/Payment/createrZalopay', data);
                console.log("data",resPay.data.data2)
                if (resPay.data && resPay.data.data2.order_url) {
                    window.location.href = resPay.data.data2.order_url; // mở URL trong tab hiện tại
                }
            }
           
            
        } catch (error) {
            console.error('Error processing payment:', error);
        } 
    };
    console.log("sss",order)

    return (
       <div className={cx('container')}>
            <section className={cx('movie')}>
                <div className={cx('in4')}>
                    <h1>Thông Tin Phim</h1>
                    <h3>TÊN PHIM: <span>{order.title}</span></h3>
                    <h3>ĐỊA CHỈ RẠP: {order.nameCinema}</h3>
                    <h3>PHÒNG CHIẾU: {order.roomid}</h3>
                    <h3>SỐ GHẾ: {order.selectedSeats.join(', ')}</h3>
                    <div className={cx('food')}>
                        <h3>Tên Món Ăn: </h3>
                        <div>
                            {foodarr.length>0?(foodarr.map((food,index) =>(
                        <h3 key={index}><span>{food.quantity}</span>x <span>{food.name}</span></h3> 
                    
                        ))):(
                            <h3>không</h3>
                        )}</div>
                         
                    </div>
                    
                    
                    <h3>ĐỒ ĂN: {order.totalFoodCount ? `${order.totalFoodCount} món` : 'không'}</h3>
                </div>
                <div className={cx('promotion')}>
                    <label for="discount-code">Mã Giảm Giá</label>
                    <Select options={optionMGG} onChange={handlePromoChange} placeholder="Mã Giảm Giá"></Select>                  
                </div>
                <div>
                    
                    <label for="method-payment">Phương Thức Thanh Toán</label>
                    <Select options={options} onChange={handleMethod} placeholder="Phương Thức Thanh Toán" />
                                      
                </div>
            </section>
            <section className={cx('user')}>
                <div className={cx('in4user')}>
                    <h1>Thông Tin Người Đặt</h1>
                    <h3><FontAwesomeIcon className={cx('icon-user')} icon={faUser}/>  <span>{fullname}</span></h3>
                    <h3><FontAwesomeIcon className={cx('icon-email')} icon={faEnvelope}/>  <span>{email}</span></h3>
                </div>
                <div>
                    <h3><FontAwesomeIcon className={cx('icon-total')} icon={faSackDollar}/> Tổng Tiền: <span>{totalprice.toLocaleString()}</span> VNĐ</h3>
                </div>  
                <button className='btn-pay' type='button' onClick={handlepay}>Thanh Toán</button>
            </section>
       </div>
    )
}


export default Payment