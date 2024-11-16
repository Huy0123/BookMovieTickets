import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import images from '~/assets/img';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faYoutube, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';
const cx = classNames.bind(styles);
function Footer() {
    return (
        <div className={cx('container-fluid')}>
            <div className={cx('row')}>
                <div className={cx('col')}>
                    <img className={cx('logo')} src={images.logos} alt="Logo" />
                    <p>BE HAPPY, BE A STAR</p>
                    <div className={cx('icon')}>
                        <FontAwesomeIcon icon={faFacebook} className={cx('icon-facebook')} />
                        <FontAwesomeIcon icon={faYoutube} className={cx('icon-youtube')} />
                        <FontAwesomeIcon icon={faTiktok} className={cx('icon-tiktok')} />
                        <FontAwesomeIcon icon={faInstagram} className={cx('icon-instagram')} />
                    </div>
                </div>
                <div className={cx('col')}>
                    <ul className={cx('list')}>
                        <li>Chăm sóc khách hàng</li>
                        <li>Hotline: 1900 6017</li>
                        <li>Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ Tết)</li>
                        <li>Email hỗ trợ: antianti@movie.vn</li>
                        <li>ĐỊA CHỈ: 135 HAI BÀ TRƯNG, PHƯỜNG BẾN NGHÉ, QUẬN 1, TP.HCM</li>
                    </ul>
                </div>
            </div>
        </div>

    );
}

export default Footer;