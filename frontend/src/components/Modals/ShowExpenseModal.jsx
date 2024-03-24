import React, { useEffect, useState } from 'react';

const constants = require('../../utils/Constants');

const ShowExpenseModal = ({ isVisible, onClose, friendId, userId, children, friendName }) => {
    const [expenses, setExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('');

    const fetchExpenses = async () => {
        try {
            const response = await fetch(constants.baseUrl + '/getExpensesByFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    friendId: friendId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            console.log(data.expenses);
            setExpenses(data.expenses);
            calculateTotalAmount(data.expenses);
            handleSettlementMessage();
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const calculateTotalAmount = (expenses) => {
        const total = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        setTotalAmount(total);
    };

    useEffect(() => {
        if (isVisible) {
            fetchExpenses();
        }
    }, [isVisible, userId, friendId]);

    useEffect(() => {
        if (expenses.length > 0) {
            handleSettlementMessage();
        }
    }, [expenses]);


    if (!isVisible) return null;

    const handleCloseModal = (e) => {
        if (e.target.id === "modalWrapper") onClose();
    };

    const handleSettleExpense = async (expenseId, amount, description, date, categoryId) => {
        try {
            // Call addSettledExpense API to add a record in the database
            const settledResponse = await fetch(constants.baseUrl + '/addSettledExpense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('id'),
                    categoryId: categoryId,
                    friendId: friendId,
                    amount: amount,
                    description: description,
                    date: date
                }),
            });
            if (!settledResponse.ok) {
                throw new Error('Failed to settle expense');
            }

            // Call deleteExpense API to delete the expense
            const deleteResponse = await fetch(constants.baseUrl + '/deleteExpense', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: expenseId,
                }),
            });
            if (!deleteResponse.ok) {
                throw new Error('Failed to delete expense');
            }

            // If both API calls are successful, update the expenses list in the state
            setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
            handleSettlementMessage();
        } catch (error) {
            console.error('Error settling expense:', error);
        }
    };

    const settleAllExpenses = async () => {
        try {
            const response = await fetch(constants.baseUrl + '/settleAllExpenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    friendId: friendId, // Assuming friendId is defined somewhere in your component
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

    const handleSettlementMessage = () => {
        console.log("EXPENSESSSSS: " + expenses);
        const yourTotal = expenses.filter((expense) => Number(expense.paidBy) === Number(userId))
            .reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        const friendTotal = expenses.filter((expense) => Number(expense.paidBy) === Number(friendId))
            .reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        const difference = yourTotal - friendTotal;

        if (difference < 0) {
            setMessage(`You owe ${friendName} ₹${Math.abs(difference)} 💸`);
            setMessageColor('text-red-500');
        } else if (difference > 0) {
            setMessage(`${friendName} owes you ₹${Math.abs(difference)} 🤑`);
            setMessageColor('text-green-500');
        } else {
            setMessage('All settled up! 🎉');
            setMessageColor('text-gray-500');
        }
    };


    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id="modalWrapper" onClick={handleCloseModal}>
            <div className='md:w-[700px] w-[90%] mx-auto flex flex-col'>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>&#10006;</button>

                <div className='bg-white p-2 flex justify-between items-center rounded-2xl'>
                    <h2 className="text-xl font-semibold mb-4">Expenses between you and {friendName}</h2>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={settleAllExpenses}
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
                                        <td className="border border-gray-300 px-4 py-2">{expense.paidBy == userId ? 'You' : friendName}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold text-sm py-2 px-4 rounded"
                                                onClick={() => handleSettleExpense(expense.id, expense.amount, expense.description, expense.date, expense.categoryId)}
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

export default ShowExpenseModal;
