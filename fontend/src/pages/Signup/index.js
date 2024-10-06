import classNames from 'classnames/bind';
import styles from './Signup.module.scss';
import images from '~/assets/img';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const cx = classNames.bind(styles);

function Signup() {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [num, setNum] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const handlerNavigateSignin = () => {
        navigate('/signIn');
    };

    const togglePasswordVisibility = () => {
        setIsShowPassword(!isShowPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsShowConfirmPassword(!isShowConfirmPassword);
    };
    
    const handleSignUp = async (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('signup', fullname, username, email, num, password, confirmPassword);
        const userData = {
            fullname,
            username,
            email,
            num,
            password
        };
        try{
            const response = await axios.post('http://localhost:8080/v1/signup', userData);
            console.log(response.data);         
        navigate('/signIn');
        } catch (error){
            console.error('Lỗi khi gửi dữ liệu:', error);

        }
    }

    return (
        <div
            className={cx('container')}
            style={{ backgroundImage: `url(${images.backgroundlog})` }}
        >
            <div className={cx('filter')}>
                <div className={cx('sign-up')}>
                    <h1 className={cx('title', 'py-4')}>ĐĂNG KÝ</h1>
                    <form className={cx('form')} onSubmit={handleSignUp}>
                        <div className={cx('form-group')}>
                            <label htmlFor="fullname">Họ và Tên</label>
                            <input 
                                type="text" 
                                id="fullname" 
                                name="fullname" 
                                required 
                                placeholder='Nhập họ và tên' 
                                value={fullname}
                                onChange={(event) => setFullname(event.target.value)} 
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="username">Tên Đăng Nhập</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                required 
                                placeholder='Nhập tên đăng nhập' 
                                value={username}
                                onChange={(event) => setUsername(event.target.value)} 
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                placeholder='Nhập Email' 
                                value={email} 
                                onChange={(event) => setEmail(event.target.value)} 
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="phone">Số Điện Thoại</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                required 
                                placeholder='Nhập số điện thoại' 
                                value={num}
                                onChange={(event) => setNum(event.target.value)} 
                            />   
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="password">Mật Khẩu</label>
                            <div className={cx('password-wrapper')}>
                                <input 
                                    type={isShowPassword ? 'text' : 'password'} 
                                    id="password" 
                                    name="password" 
                                    required 
                                    placeholder='Nhập mật khẩu' 
                                    value={password} 
                                    onChange={(event) => setPassword(event.target.value)} 
                                />
                                <button 
                                    type="button" 
                                    onClick={togglePasswordVisibility} 
                                    className={cx('toggle-password')}
                                    aria-label={isShowPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    <FontAwesomeIcon icon={isShowPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword">Nhập Lại Mật Khẩu</label>
                            <div className={cx('password-wrapper')}>
                                <input 
                                    type={isShowConfirmPassword ? 'text' : 'password'} 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    required 
                                    placeholder='Nhập lại mật khẩu' 
                                    value={confirmPassword} 
                                    onChange={(event) => setConfirmPassword(event.target.value)} 
                                />
                                <button 
                                    type="button" 
                                    onClick={toggleConfirmPasswordVisibility} 
                                    className={cx('toggle-password')}
                                    aria-label={isShowConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    <FontAwesomeIcon icon={isShowConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        
                        <button 
                        type="submit" 
                        className={cx('submit-btn', 'mt-2', 'mb-4')}
                        >Đăng Ký</button>
                        <h4 className={cx('login', 'pt-3')} onClick={handlerNavigateSignin}>Đăng nhập</h4>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
