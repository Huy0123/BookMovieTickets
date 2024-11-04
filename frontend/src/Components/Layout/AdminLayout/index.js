
import Sidebar from './Sidebar';
import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';
const cx = classNames.bind(styles);
function AdminLayout({ children }) {
    return (
        <div className={cx('row ')}>
           
            
         
            <div className='col-2 p-0' > <Sidebar /></div>
          
                <div className='col-10 p-0'>{children}</div>
               
         
        </div>
    );
}

    export default AdminLayout;
