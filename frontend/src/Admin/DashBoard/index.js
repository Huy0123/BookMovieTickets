import React, { useEffect, useState } from "react";
import classNames from 'classnames/bind';
import axios from "axios";
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import style from './DashBoard.module.scss';

const cx = classNames.bind(style);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement, Tooltip, Legend);

const DashBoard = () => {
    const [currentMovies, setCurrentMovies] = useState([]);
    const [comingMovies, setComingMovies] = useState([]);
    const [showtimeByCinema, setShowtimeByCinema] = useState([]); // Số lượng suất chiếu theo rạp trong tháng
    const [totalRevenueByMonth, setTotalRevenueByMonth] = useState({}); // Doanh thu theo tháng
    const [totalRevenueByMovie, setTotalRevenueByMovie] = useState({}); // Doanh thu theo phim
    const [totalTickets, setTotalTickets] = useState(0); // Tổng số vé đã bán
    const fetchMovies = async () => {
        try {
            const response = await axios.get("http://localhost:8080/v1/getMovies");
            splitMovies(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fetchTotalRevenue = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/Payment/getPayment`);
            const payments = response.data;
            calculateMonthlyRevenue(payments);
            calculateTotalTickets(payments);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateMonthlyRevenue = (payments) => {
        const currentMonth = dayjs().format("YYYY-MM");
        let monthlyTotal = 0;
        // Lọc các giao dịch trong tháng hiện tại và tính tổng doanh thu
        payments.forEach((payment) => {
            const month = dayjs(payment.payment_date).format("YYYY-MM");
            if (month === currentMonth) {
                monthlyTotal += payment.amount;
            }
        });
        setTotalRevenueByMonth(monthlyTotal);
    };

    const calculateTotalTickets = (payments) => {
        let totalTickets = 0;
        const currentMonth = dayjs().format("YYYY-MM");
        
        payments.forEach((payment) => {
            const month = dayjs(payment.payment_date).format("YYYY-MM");
            if (month === currentMonth) {
                totalTickets ++;
            }
        });
    
        setTotalTickets(totalTickets);
    }

    const splitMovies = async (movies) => {
        const now = new Date();
        let nowShowing = 0;
        let comingSoon = 0;
        movies.forEach((movie) => {
            const releaseDate = new Date(movie.release_date);
            if (releaseDate <= now) {
                nowShowing++;
            }
            else {
                comingSoon++;
            }
        });
        setCurrentMovies(nowShowing);
        setComingMovies(comingSoon);
    };

    useEffect(() => {
        fetchMovies();
        fetchTotalRevenue();
    }, []);

    // const fetchAllCinema = async () => {
    //     try{
    //         const response = await axios.get("http://localhost:8080/v1/getCinemas");
    //         response.data.forEach(cinema => {
    //             fetchShowtimeByCinema(cinema._id);
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }


    // }

  
    // const fetchShowtimeByCinema = async (id) => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/v1/showtime/getShowtimesByCinemaID/${id}`);
    //         setShowtimeByCinema(response.data);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim đang chiếu</h4>
                        <p className="mb-0">{currentMovies}</p>
                    </div>
                </div>

                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim sắp chiếu</h4>
                        <p className="mb-0">{comingMovies}</p>
                    </div>
                </div>
                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Số lượng vé đã đặt trong tháng</h4>
                        <p className="mb-0">{totalTickets}</p>
                    </div>
                </div>
                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Doanh số bán vé trong tháng</h4>
                        <p className="mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenueByMonth)}</p>
                    </div>
                </div>
            </div>

            <div>
                <table className="table table-hover">
                    <thead>
                        <tr className="text-center">
                            <th>Tên rạp</th>
                            <th>Doanh thu</th>
                            <th>Suất chiếu</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div>
                <Bar data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                        {
                            label: 'Doanh số bán vé',
                            data: [65, 59, 80, 81, 56, 55, 40],
                            fill: false,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgba(255, 99, 132, 0.2)',
                        },
                    ],
                }}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'Biểu đồ cột cho doanh thu theo tháng',
                            },
                        },
                        transitions: {
                            show: {
                                animations: {
                                    x: {
                                        from: 0
                                    },
                                    y: {
                                        from: 0
                                    }
                                }
                            },
                            hide: {
                                animations: {
                                    x: {
                                        to: 0
                                    },
                                    y: {
                                        to: 0
                                    }
                                }
                            }
                        }
                    }} />
            </div>
        </>
    )
}

export default DashBoard;