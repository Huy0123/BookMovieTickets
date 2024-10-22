

import React, { useState, useEffect } from 'react';
import styles from './TrailerModal.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const TrailerModal = ({ isOpen, onClose, trailerUrl}) => {
    const [isLoading, setIsLoading] = useState(true);

    // Khi modal mở, reset lại trạng thái isLoading
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true); // Đặt lại loading mỗi khi modal mở
        }
    }, [isOpen]);

    const handleLoaded = () => {
        setIsLoading(false); // Video đã tải xong
    };

    if (!isOpen) return null;
    return (
        <div className={cx("modal-overlay")} onClick={onClose}>
          <div className={cx("modal-content")} onClick={(e) => e.stopPropagation()}>
             {isLoading && <div className={cx("loading-spinner")}>Loading...</div>}
            <iframe
            width="1080"
            height="500"
            src={trailerUrl}// Thêm tham số autoplay và mute nếu cần
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleLoaded} 
            ></iframe>
              <button className={cx("close-button")} onClick={onClose}>X</button>
          </div>
        </div>
      );
    };


export default TrailerModal;

