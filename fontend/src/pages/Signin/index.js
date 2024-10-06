import classNames from 'classnames/bind';
import styles from './SignIn.module.scss'; // Create this file for styles
import images from '~/assets/img';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const cx = classNames.bind(styles);

function SignIn() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setIsShowPassword(!isShowPassword);
    };

    const handleSignIn = async (event) => {
        event.preventDefault(); 
        console.log('signin', username, password);
        const userData = { username, password };
        try {
            const response = await axios.post('http://localhost:8080/v1/login', userData);
            console.log(response.data);
            const token = response.data.accesstoken;
            console.log('token',token)
            navigate('/')
            if (token) {
                localStorage.setItem('userToken', token);
                navigate('/'); 
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };
    

    const handlerNavigateSignup = () => {
        navigate('/signup'); 
    };

    const handleGoogleSignIn = () => {
        console.log("Google Sign-In clicked");
    };

    return (
        <div
            className={cx('container')}
            style={{ backgroundImage: `url(${images.backgroundlog})` }}
        >
            <div className={cx('filter')}>
                <div className={cx('sign-in')}>
                    <h1 className={cx('title', 'py-4')}>ĐĂNG NHẬP</h1>
                    <form className={cx('form')} onSubmit={handleSignIn}>
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

                        <div className={cx('wrapp', 'd-flex', 'justify-content-between')}>
                            <h4 className={cx('forgot-password')} onClick={() => {}}>Quên Mật Khẩu?</h4>
                            <h4 className={cx('sign-up')} onClick={handlerNavigateSignup}>Đăng Ký</h4>
                        </div>

                        <button
                            type="submit"
                            className={cx('submit-btn', 'mt-2', 'mb-4')}
                        >Đăng Nhập</button>

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            className={cx('google-btn', 'mt-3')}
                            onClick={handleGoogleSignIn}
                        >
                            <img src={images.icongoogle} alt="Google Icon" className={cx('icon-gg')} /> 
                            Đăng Nhập bằng Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
