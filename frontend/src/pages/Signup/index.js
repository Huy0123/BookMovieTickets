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
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({
        fullname: false,
        username: false,
        email: false,
        num: false,
        password: false,
        confirmPassword: false,
        passwordLength: false,
    });

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

        // Reset error states
        setErrors({
            fullname: false,
            username: false,
            email: false,
            num: false,
            password: false,
            confirmPassword: false,
            passwordLength: false,
        });

        // Check email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setMessage("Trường này phải là email!"); // Invalid email format
            setErrors((prev) => ({ ...prev, email: true })); // Mark email as error
            return;
        }

        // Check password length
        if (password.length < 6) {
            setMessage("Mật khẩu phải có ít nhất 6 ký tự!");
            setErrors((prev) => ({ ...prev, passwordLength: true }));
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setMessage("Mật khẩu không khớp!");
            setErrors((prev) => ({ ...prev, password: true, confirmPassword: true }));
            return;
        }

        const userData = {
            fullname,
            username,
            email,
            num,
            password
        };

        try {
            const response = await axios.post('http://localhost:8080/v1/Users/signup', userData);
            console.log(response.data);
            
            if (response.data.EC === 0) {
                alert(response.data.EM);
                navigate('/signIn');
            } else {
                setMessage(response.data.EM);
                
                if (response.data.EC === 1) {
                    setErrors((prev) => ({ ...prev, username: true }));
                } else if (response.data.EC === 2) {
                    setErrors((prev) => ({ ...prev, email: true }));
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
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
                    {message && <div className={cx('message')}>{message}</div>}
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
                                className={cx({ 'border-danger': errors.fullname })} 
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
                                className={cx({ 'border-danger': errors.username })} 
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input 
                                type="text" 
                                id="email" 
                                name="email" 
                                required 
                                placeholder='Nhập Email' 
                                value={email} 
                                onChange={(event) => setEmail(event.target.value)} 
                                className={cx({ 'border-danger': errors.email })} 
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
                                className={cx({ 'border-danger': errors.num })} 
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
                                    className={cx({ 'border-danger': errors.password || errors.passwordLength })} 
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
                                    className={cx({ 'border-danger': errors.confirmPassword })} 
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
