import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import HeaderMenu from './HeaderMenu';
import FooterMenu from './FooterMenu';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const constants = require('../utils/Constants');

const Dashboard = () => {
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const [friends, setFriends] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const navigate = useNavigate(); // Get navigate object

    const userId = localStorage.getItem('id');
    const userName = localStorage.getItem('name');

    useEffect(() => {
        if (!userId) {
            navigate('/'); // Redirect to home page if userId is not present
        }
    }, [userId, navigate]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch(constants.baseUrl + '/getFriends', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch friends');
                }
                const data = await response.json();
                setFriends(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchExpenses = async () => {
            try {
                const response = await fetch(constants.baseUrl + '/getAllExpensesForUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId
                    }),
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch expenses');
                }
                const data = await response.json();
                setExpenses(data.expenses);

            } catch (error) {
                console.error("Error: ", error)
            }
        };

        fetchFriends();
        fetchExpenses();
    }, [userId]);

    useEffect(() => {
        // Pie chart data
        const filteredFriends = friends.filter(friend =>
            expenses.some(expense => expense.friendId === friend.id)
        );

        const pieData = {
            labels: filteredFriends.map(friend => friend.name),
            datasets: [{
                label: 'Total Expenses',
                data: filteredFriends.map(friend => {
                    return expenses.reduce((total, expense) => {
                        if (expense.friendId === friend.id) {
                            return total + expense.amount;
                        }
                        return total;
                    }, 0);
                }),
                backgroundColor: filteredFriends.map(() => {
                    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
                })
            }]
        };

        // Bar chart data
        const barData = {
            labels: filteredFriends.map(friend => friend.name),
            datasets: [{
                label: 'Total Expenses',
                data: filteredFriends.map(friend => {
                    return expenses.reduce((total, expense) => {
                        if (expense.friendId === friend.id) {
                            return total + expense.amount;
                        }
                        return total;
                    }, 0);
                }),
                backgroundColor: 'rgb(54, 162, 235)'
            }]
        };

        // Create pie chart
        const pieChart = new Chart(pieChartRef.current, {
            type: 'pie',
            data: pieData,
            options: {
                aspectRatio: 1, // Maintain a square aspect ratio
                responsive: false, // Disable responsiveness
                plugins: {
                    legend: {
                        position: 'left', // Position legend above the chart
                        align: 'start', // Align legend to the start (left) of the chart
                    },
                },
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
    }, [friends, expenses]);

    const handleDownloadExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Friend Name', 'Total Expense', "Days since you haven't recorded any expense"]
        ];
        // Add data for each friend
        friends.forEach(friend => {
            const totalExpense = expenses.reduce((total, expense) => {
                if (expense.friendId === friend.id) {
                    return total + expense.amount;
                }
                return total;
            }, 0);
            let latestExpenseDate = new Date(expenses[0].date);
            const daysSinceLastSpend = expenses.reduce((daysDiff, expense) => {
                if (expense.friendId === friend.id) {
                    const currExpenseDate = new Date(expense.date);
                    if (latestExpenseDate < currExpenseDate) {
                        latestExpenseDate = currExpenseDate;
                    }
                    return latestExpenseDate;
                }
                return daysDiff;
            }, 0);

            const daysBetween = Math.ceil(Math.abs(new Date() - latestExpenseDate) / (1000 * 60 * 60 * 24));

            wsData.push([friend.name, totalExpense, daysBetween]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Data');

        // Generate Excel file and download

        XLSX.writeFile(wb, `dashboard_data_${userName.split(' ')}_${new Date().getTime()}.xlsx`);
    };

    return (

        < React.Fragment >
            <HeaderMenu />
            <div className="container mx-auto my-auto px-4 py-8 ">
                <h1 className="text-2xl font-bold mb-4 pt-16">Dashboard</h1>
                <div className="flex h-auto w-auto">
                    <div className="flex-col w-2/3 ">
                        <canvas ref={pieChartRef}></canvas>
                    </div>
                    <div className="w-1/3">
                        <canvas ref={barChartRef}></canvas>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button onClick={handleDownloadExcel} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Export to Excel and download
                    </button>
                </div>
            </div>
            <FooterMenu />
        </React.Fragment >
    );
};

export default Dashboard;
