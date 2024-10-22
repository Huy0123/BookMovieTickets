import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss'; // Tạo file này cho styles
import images from '~/assets/img';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const cx = classNames.bind(styles);

function ForgotPassword() {
    // const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        console.log('forgot password', email);
        const emailData = {email} ;
        console.log(typeof emailData)
        try {
            const response = await axios.post('http://localhost:8080/v1/Users/forgotpassword', emailData);
            console.log(response.data);
        } catch (error) {
            console.error('Error during password reset request:', error);
        }
    };

    return (
        <div
            className={cx('container')}
            style={{ backgroundImage: `url(${images.backgroundlog})` }}
        >
            <div className={cx('filter')}>
                <div className={cx('forgot-password')}>
                    <h1 className={cx('title', 'py-4')}>QUÊN MẬT KHẨU</h1>
                    <form className={cx('form')} onSubmit={handleForgotPassword}>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder='Nhập địa chỉ email'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className={cx('submit-btn', 'mt-2', 'mb-4')}
                        >Xác Nhận</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
