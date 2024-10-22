import classNames from 'classnames/bind';
import styles from './ResetPassword.module.scss';
import images from '~/assets/img';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams(); // Get the token from URL params
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleResetPassword = async (event) => {
        event.preventDefault();
    
        // Ensure both passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setSuccess(null); 
            return;
        }
    
        try {
            console.log('Sending request to reset password:', {
                token,
                newPassword,
            });
            const userData = {
                token, 
                newpassword: newPassword,
            }
            const response = await axios.put('http://localhost:8080/v1/Users/reset-password',userData  );
    
            if (response.status === 200) {
                navigate('/signIn'); 
            } else {
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
    

    return (
        <div
            className={cx('container')}
            style={{ backgroundImage: `url(${images.backgroundlog})` }}
        >
            <div className={cx('filter')}>
                <div className={cx('sign-in')}>
                    <h1 className={cx('title', 'py-4')}>Đặt lại mật khẩu</h1>
                    {/* Display error or success messages */}
                    {error && <p className={cx('error-message')}>{error}</p>}
                    {success && <p className={cx('success-message')}>{success}</p>}
                    <form className={cx('form')} onSubmit={handleResetPassword}>
                        <div className={cx('form-group')}>
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword">Nhập lại mật khẩu mới</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className={cx('submit-btn', 'mt-2', 'mb-4')}
                        >
                            Xác nhận
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
