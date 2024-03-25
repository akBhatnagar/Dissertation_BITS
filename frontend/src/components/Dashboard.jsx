import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import HeaderMenu from './HeaderMenu';
import FooterMenu from './FooterMenu';

const Dashboard = () => {
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);

    useEffect(() => {
        // Pie chart data
        const pieData = {
            labels: ['Red', 'Blue', 'Yellow'],
            datasets: [{
                label: 'My First Dataset',
                data: [300, 50, 100],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ]
            }]
        };

        // Bar chart data
        const barData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'rgb(54, 162, 235)'
            }]
        };

        // Create pie chart
        const pieChart = new Chart(pieChartRef.current, {
            type: 'pie',
            data: pieData,
            options: {
                aspectRatio: 1, // Maintain a square aspect ratio
                responsive: false // Disable responsiveness
            }
        });

        // Create bar chart
        const barChart = new Chart(barChartRef.current, {
            type: 'bar',
            data: barData
        });

        // Cleanup
        return () => {
            pieChart.destroy();
            barChart.destroy();
        };
    }, []);

    return (
        <React.Fragment>
            <HeaderMenu />
            <div className="container mx-auto my-auto px-4 py-8 ">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <div className="flex" style={{ alignItems: 'flex-end' }}>
                    <div className="w-1/2 pr-2">
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                    <div className="w-1/2 pl-2">
                        <canvas ref={barChartRef}></canvas>
                    </div>
                </div>
            </div>
            <FooterMenu />
        </React.Fragment>
    );
};

export default Dashboard;
