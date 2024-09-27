import classNames from 'classnames/bind'; // Ensure this path is correct
import styles from './Header.module.scss';
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>
const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
        <div className={cx('content')}>
            <div className={cx('header1')}>
                <img
                    className={cx('logo')}
                    src='https://www.sterlingku.com/img/starbucks-logo.png'
                    alt=""
                />

                <div className={cx('wrap1')}>
                    <button className={cx('book')}>Đặt vé ngay</button>
                    <div className={cx('sign')}>
                        <button className={cx('sign-up')}>Đăng ký</button>
                        <button className={cx('sign-in')}>Đăng nhập</button>
                    </div>
                </div>
            </div>

            <div className={cx('header2')}>
                <div className={cx('wrap2')}>
                <button className={cx('btn-header')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"></path>
                    </svg>
                    Chọn địa điểm
                </button>
                <button className={cx('btn-header')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"></path>
                    </svg>
                    Chọn địa điểm
                </button>


                </div>
            </div>
        </div>
        </header>
    );
}

export default Header;
