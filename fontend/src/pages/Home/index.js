import classNames from 'classnames/bind'; // Ensure this path is correct
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function Home() {
    return (  
        <div className={cx('container')}>

        {/* <img
                    className={cx('img-banner')}
                    src='https://www.sterlingku.com/img/starbucks-logo.png'
                    alt=""
                /> */}

        {/* <h1 className={cx('title')}>PHIM ĐANG CHIẾU</h1> */}
        </div>
    );
    
}

export default Home;