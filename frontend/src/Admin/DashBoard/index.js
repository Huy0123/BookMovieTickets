import React, { useEffect, useState } from "react";
import classNames from 'classnames/bind';
import axios from "axios";
import {  Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import style from './DashBoard.module.scss';

const cx = classNames.bind(style);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement, Tooltip, Legend);

const DashBoard = () => {
    const [currentMovies, setCurrentMovies] = useState([]);
    const [comingMovies, setComingMovies] = useState([]);
    const [totalRevenueByMonth, setTotalRevenueByMonth] = useState(0); // Doanh thu theo tháng
    const [totalRevenueByMovie, setTotalRevenueByMovie] = useState(0); // Doanh thu theo phim
    const [totalTickets, setTotalTickets] = useState(0); // Tổng số vé đã bán
    const [totalRevenue, setTotalRevenue] = useState({}); // Tổng doanh thu
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
        fetchAllCinema();
        fetchRevenueByMovie();
    }, []);
    
    // Thông tin rạp chiếu phim
    const fetchAllCinema = async () => {
        try{
            const response = await axios.get("http://localhost:8080/v1/getShowtimeAndPaymentByCinema");
            if (response.status === 200) {
                setTotalRevenue(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const fetchRevenueByMovie = async () => {
        try {
            const response = await axios.get("http://localhost:8080/v1/Payment/getPaymentByMovie");
            if (response.status === 200) {
                setTotalRevenueByMovie(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }
  
    
    return (
        <div className="container-fluid bg-white">
            <h2 className="p-4">Dashboard</h2>
            <div className="row justify-content-center">
                <div className="col-3">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim đang chiếu</h4>
                        <p className="mb-0">{currentMovies}</p>
                    </div>
                </div>

                <div className="col-3">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim sắp chiếu</h4>
                        <p className="mb-0">{comingMovies}</p>
                    </div>
                </div>
                <div className="col-3">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Số lượng vé đã đặt trong tháng</h4>
                        <p className="mb-0">{totalTickets}</p>
                    </div>
                </div>
                <div className="col-3">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Doanh số bán vé trong tháng</h4>
                        <p className="mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenueByMonth)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <table className="table table-hover">
                    <thead>
                        <tr className="text-center">
                            <th>Tên rạp</th>
                            <th>Doanh thu</th>
                            <th>Suất chiếu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(totalRevenue).map((cinemaId) => {
                            const cinema = totalRevenue[cinemaId];
                            return (
                                <tr key={cinemaId} className="text-center">
                                    <td>{cinema.name}</td>
                                    <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cinema.payments)}</td>
                                    <td>{cinema.showtimes}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="w-100">
                <Bar data={{
                    labels: Object.keys(totalRevenueByMovie).map((cinemaId) => totalRevenueByMovie[cinemaId].title),
                    datasets: [
                        {
                            label: 'Doanh số bán vé',
                            
                            data: Object.keys(totalRevenueByMovie).map((cinemaId) => totalRevenueByMovie[cinemaId].payments),
                            fill: false,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                                'rgba(255, 205, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(201, 203, 207, 0.2)'
                              ],
                              borderColor: [
                                'rgb(255, 99, 132)',
                                'rgb(255, 159, 64)',
                                'rgb(255, 205, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(54, 162, 235)',
                                'rgb(153, 102, 255)',
                                'rgb(201, 203, 207)'
                              ],
                            borderWidth: 1,
                            barThickness: 85
                        },
                    ],
                }}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: 'Biểu đồ cột cho doanh thu theo phim',
                            
                            font: {
                                size: 16,  
                                weight: 'bold', 
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true, 
                        },
                        x: {
                            ticks: {
                                autoSkip: false,  
                                maxRotation: 0,
                                minRotation: 0,
                            }
                        }
                    },
                    
                }}
                 />
            </div>
        </div>
    )
}

export default DashBoard;