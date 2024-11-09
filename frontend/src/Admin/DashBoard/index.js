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

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim đang chiếu</h4>
                        <p className="mb-0"></p>
                    </div>
                </div>

                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Phim sắp chiếu</h4>
                        <p className="mb-0"></p>
                    </div>
                </div>
                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Số lượng vé đã đặt trong tháng</h4>
                        <p className="mb-0"></p>
                    </div>
                </div>
                <div className="col">
                    <div className="p-4 bg-primary text-white rounded">
                        <h4 className="fw-bold">Doanh số bán vé trong tháng</h4>
                        <p className="mb-0"></p>
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
            {/* <div style={{ width: '500px', height: '300px' }}>

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
</div> */}
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
                    }}
            }} />
    </div>
        </>
    )
}

export default DashBoard;