import React from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/img';
import TrailerModal from '../Trailer/TrailerModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Profile() {
    return (  
       <div className={cx('container')}>
            <div className={cx('wrap')}>           
            <div className='row '>
                <div className='col-1'></div>
                <div className='col-3 '>
                    <div className={cx('tool-bar')}>
                    <div className='row '>
                        <div className={cx('tool')}>
                            <div className={cx('info','d-flex ')}>
                            <FontAwesomeIcon className={cx('icon-user fs-2')} icon={faUser} />
                            <h2>THÔNG TIN CÁ NHÂN</h2>
                            </div>
                        </div>
                    </div>
                    <div className='row '>
                        <div className={cx('reset-pass')}>

                        </div>
                    </div>
                    </div>
                </div>
                <div className='col-7'>
                <div className={cx('wrap-info')}>
</div>
 
</div>
                </div>
            </div>
       </div>
    );
}

export default Profile;