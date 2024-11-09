
import classNames from 'classnames/bind';
import styles from './AddMovie.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from "react";
import axios from "axios";

const cx = classNames.bind(styles);
const AddMovie = ({ isOpen, onClose }) => {


    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        duration: "",
        release_date: "",
        subtitles: "",
        limit: "",
        trailer: "",
        country: "",
        director: "",
        cast: "",
        voice_actors: "",
        description: "",
    });
    const [poster1, setPoster1] = useState(null);
    const [poster2, setPoster2] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === "poster1") setPoster1(e.target.files[0]);
        if (e.target.name === "poster2") setPoster2(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });

        if (poster1) data.append("poster1", poster1);
        if (poster2) data.append("poster2", poster2);
        
        try {

            const response = await axios.post("http://localhost:8080/v1/createMovie", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Movie created:", response.data);
            setFormData({
                title: "",
                genre: "",
                duration: "",
                release_date: "",
                subtitles: "",
                limit: "",
                trailer: "",
                country: "",
                director: "",
                cast: "",
                voice_actors: "",
                description: "",
            });
            setPoster1(null);
            setPoster2(null);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error("Error creating movie:", error);
        }
    };
    if (!isOpen) return null;
    return (
        <div className={cx('modal-container')}>
            <div className={cx('modal-content')}>
                <h3 className={cx('tyle')}>Thêm phim</h3>
                <div className="row">
                    <div className="col d-flex flex-column gap-2">
                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Tên phim</h4>
                            <input
                                type="text"
                                name="title"
                                className={cx('cinema-name', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Thể loại</h4>
                            <input
                                type="text"
                                name="genre"
                                className={cx('genre', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Thời lượng (phút)</h4>
                            <input
                                type="number"
                                name="duration"
                                className={cx('duration', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Ngày ra mắt</h4>
                            <input
                                type="date"
                                name="release_date"
                                className={cx('release-date', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Phụ đề</h4>
                            <input
                                type="text"
                                name="subtitles"
                                className={cx('subtitles', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Nhãn phim</h4>
                            <input
                                type="text"
                                name="limit"
                                className={cx('rating', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Poster 1</h4>
                            <input
                                type="file"
                                name="poster1"
                                accept="image/*"
                                className={cx('poster1', 'form-info')}
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Poster 2</h4>
                            <input
                                type="file"
                                name="poster2"
                                accept="image/*"
                                className={cx('poster2', 'form-info')}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="col d-flex flex-column gap-2">
                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Trailer</h4>
                            <input
                                type="url"
                                name="trailer"
                                className={cx('trailer', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Quốc gia</h4>
                            <input
                                type="text"
                                name="country"
                                className={cx('country', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Đạo diễn</h4>
                            <input
                                type="text"
                                name="director"
                                className={cx('director', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Diễn viên</h4>
                            <input
                                type="text"
                                name="cast"
                                className={cx('actors', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Diễn viên lồng tiếng</h4>
                            <input
                                type="text"
                                name="voice_actors"
                                className={cx('voice-actors', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className={cx('content')}>
                            <h4 className={cx('title')}>Mô tả</h4>
                            <textarea
                                name="description"
                                className={cx('description', 'form-info')}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className={cx('btn-con')}>
                    <button type="button" className={cx('btn-confirm')} onClick={handleSubmit}>
                        Xác nhận
                    </button>
                </div>

                <div className={cx('close-modal')} onClick={onClose}>
                    <FontAwesomeIcon className="fs-3 me-2" icon={faXmark} />
                </div>
            </div>

        </div>
    );
};

export default AddMovie;
