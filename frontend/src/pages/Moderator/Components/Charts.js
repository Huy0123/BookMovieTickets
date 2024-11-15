import React, { useState, useEffect , useCallback} from "react";
import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";
import classNames from 'classnames/bind';
import styles from './style.module.scss';
const cx = classNames.bind(styles);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const Charts = ({cinema_id}) => {

    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [totalTickets, setTotalTickets] = useState(0); // Tổng số vé đã bán
    const [totalRevenueByDay, setTotalRevenueByDay] = useState({}); // Doanh thu theo ngày
    const [totalRevenueByMonth, setTotalRevenueByMonth] = useState({}); // Doanh thu theo tháng
    
    const fetchMovies = useCallback( async () => {
        try {
            const response = await axios.get("http://localhost:8080/v1/getMovies");
            splitMovies(response.data);

        } catch (error) {
            console.error(error);
        }
    }, [])

    const fetchTotalRevenue = useCallback(async () => {
        if(!cinema_id) return;
        try {
            const response = await axios.get(`http://localhost:8080/v1/Payment/getPaymentByCinemaId/${cinema_id}`);
            const payments = response.data.payment;
            // Sau khi có dữ liệu, tính toán doanh thu theo tháng và theo ngày
            calculateMonthlyRevenue(payments);
            calculateDailyRevenueInCurrentMonth(payments);
            calculateTotalTickets(payments);
        } catch (error) {
            console.error(error);
        }
    }, [cinema_id   ])

    const calculateMonthlyRevenue = (payments) => {
        const monthRevenue = {};
        const currentMonth = dayjs().format("YYYY-MM");
        let monthlyTotal = 0;
        // Lọc các giao dịch trong tháng hiện tại và tính tổng doanh thu
        payments.forEach((payment) => {
            const month = dayjs(payment.payment_date).format("YYYY-MM");
            if (month === currentMonth) {
                monthlyTotal += payment.amount;
            }
        });
        monthRevenue[currentMonth] = monthlyTotal;

        setTotalRevenueByMonth(monthRevenue);
    };

    const calculateDailyRevenueInCurrentMonth = (payments) => {
        const dailyRevenue = {};
        const currentMonth = dayjs().format("YYYY-MM");
        const today = dayjs().date(); // Ngày hiện tại trong tháng

        // Khởi tạo doanh thu của mỗi ngày từ đầu tháng đến ngày hiện tại
        for (let day = 1; day <= today; day++) {
            const dayKey = `${currentMonth}-${String(day).padStart(2, '0')}`;
            dailyRevenue[dayKey] = 0;
        }

        // Tính doanh thu cho từng ngày có giao dịch trong tháng hiện tại
        payments.forEach((payment) => {
            const day = dayjs(payment.payment_date).format("YYYY-MM-DD");
            const month = dayjs(payment.payment_date).format("YYYY-MM");

            if (month === currentMonth && dayjs(payment.payment_date).date() <= today) {
                dailyRevenue[day] += payment.amount;
            }
        });

        setTotalRevenueByDay(dailyRevenue);
    };

    const calculateTotalTickets = (payments) => {
        let total = 0;
        const currentMonth = dayjs().format("YYYY-MM");
        payments.forEach((payment) => {
            const month = dayjs(payment.payment_date).format("YYYY-MM");
            if (month === currentMonth)
                total++;
        });
        setTotalTickets(total);
    };
    useEffect(() => {
        fetchMovies();
        fetchTotalRevenue();
    }, [fetchMovies, fetchTotalRevenue]);

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
        setNowShowing(nowShowing);
        setComingSoon(comingSoon);
    };


    return (
        <>
            <h2>Thống kê</h2>
            <div className="row">
                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim đang chiếu</h4>
                        <p className="mb-0">{nowShowing}</p>
                    </div>
                </div>

                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim sắp chiếu</h4>
                        <p className="mb-0">{comingSoon}</p>
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
                        <p className="mb-0">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenueByMonth[Object.keys(totalRevenueByMonth)[0]])}</p>
                    </div>
                </div>
            </div>
            <div className={cx('chart')}>

                <Line data={{
                    labels: Object.keys(totalRevenueByDay),
                    datasets: [
                        {
                            label: 'Doanh số bán vé',
                            data: Object.values(totalRevenueByDay),
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
                                text: 'Biểu đồ đường cho doanh thu theo tháng',
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
                            }}
                    }} />
            </div>
        </>
    );
}

export default Charts;
