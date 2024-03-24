import React, { useEffect, useState } from 'react';

const constants = require('../../utils/Constants');

const ShowGroupExpenseModal = ({ isVisible, onClose, groupId, userId, groupName }) => {
    const [expenses, setExpenses] = useState([]);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (isVisible) {
            fetchExpenses();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const fetchExpenses = async () => {
        try {
            const response = await fetch(constants.baseUrl + '/getSharedExpensesByGroupId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId: groupId
                })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            setExpenses(data.expenses);
            calculateTotalAmount(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const calculateTotalAmount = (expenses) => {
        const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        setTotalAmount(total);
    };

    const handleCloseModal = (e) => {
        if (e.target.id === "modalWrapper") onClose();
    };

    const settleGroupExpenses = async () => {
        try {
            const response = await fetch(constants.baseUrl + '/settleAllExpenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId: groupId // Assuming friendId is defined somewhere in your component
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to settle expenses');
            }
            // Assuming you want to fetch the updated list of expenses after settling
            fetchExpenses(); // Refetch the expenses list
        } catch (error) {
            console.error('Error settling expenses:', error);
        }
    };


    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id="modalWrapper" onClick={handleCloseModal}>
            <div className='md:w-[700px] w-[90%] mx-auto flex flex-col'>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>&#10006;</button>

                <div className='bg-white p-2 flex justify-between items-center rounded-2xl'>
                    <h2 className="text-xl font-semibold mb-4">Expenses for {groupName}</h2>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={settleGroupExpenses}
                    >
                        Settle All
                    </button>
                </div>

                <div className='bg-white p-2 rounded-2xl'>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                                    <th className="border border-gray-300 px-4 py-2">Category</th>
                                    <th className="border border-gray-300 px-4 py-2">Description</th>
                                    <th className="border border-gray-300 px-4 py-2">Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Who Paid?</th> {/* New column */}
                                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.categoryName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.description}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.paidBy == userId ? 'You' : expense.paidByName}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold text-sm py-2 px-4 rounded"
                                                onClick={() => alert("Settle group expense")}
                                            >
                                                Settle Expense
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Total:</td>
                                    <td className="border px-4 py-2"></td>
                                    <td className="border px-4 py-2"></td>
                                    <td className="border px-4 py-2 font-semibold">{totalAmount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-4">
                        <p className={`${messageColor} font-semibold`}>{message}</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ShowGroupExpenseModal;
