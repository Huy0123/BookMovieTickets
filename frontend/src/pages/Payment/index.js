import classNames from 'classnames/bind';
import styles from './Payment.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '~/assets/img';
import { faClock, faClosedCaptioning, faEarthAsia, faTag, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Select from 'react-select';
import React  from 'react';
const cx = classNames.bind(styles);
function Payment(){
    
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
       
    ];

    const optionMGG = [ 
        {
            value: 'ma giam gia 1',
            label:(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={images.prom}
                        alt="Icon"
                        style={{ width: '20px', height: '20px', marginRight: '8px' }}
                    />
                    Ma Giam Gia 1
                </div>
            )
        }
    ]

    return (
       <div className={cx('container')}>
            <section className={cx('movie')}>
                <div className={cx('in4')}>
                    <h1>Tên Phim: </h1>
                    <h3>Địa Chỉ Rạp: </h3>
                    <h3>Loại Vé: </h3>
                    <h3>Phong chiếu: </h3>
                    <h3>số ghế: </h3>
                    <h3>đồ ăn: </h3>
                </div>
                <div>
                    <label for="discount-code">Mã Giảm Giá</label>
                    <Select options={optionMGG} placeholder="Mã Giảm Giá"></Select>                  
                </div>
                <div>
                    
                    <label for="method-payment">Phương Thức Thanh Toán</label>
                    <Select options={options} placeholder="Phương Thức Thanh Toán" />
                                      
                </div>
            </section>
            <section className={cx('user')}>
                <div>
                    <h1>Thông Tin Người Đặt</h1>
                    <h3>Tên Người Đặt: <span>Phan Văn Tấn</span></h3>
                    <h3>Số Điện Thoại: <span>0123456789</span></h3>
                    <h3>Email: <span>123456@gmal.com</span></h3>
                </div>
                <div>
                    <h3>Tổng Tiền: <span>150.000</span> VNĐ</h3>
                </div>  
                <button>Thanh Toán</button>
            </section>
       </div>
    )
}


export default Payment