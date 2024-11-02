import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import classNames from 'classnames/bind';
import styles from './ProfileLayout.module.scss';
const cx = classNames.bind(styles);
function ProfileLayout({ children }) {
    return (
        <div className={cx('container')}>
            <Header />
            
            <div className={cx('row  justify-content-center py-2')}>
            <div className={cx('col-3')}> <Sidebar /></div>
          
                <div className={cx('col-7 ')}>{children}</div>
                </div>
            
            <Footer />
        </div>
    );
}

    export default ProfileLayout;
