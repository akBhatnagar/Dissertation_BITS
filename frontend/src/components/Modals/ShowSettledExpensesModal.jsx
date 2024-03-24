import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const constants = require('../../utils/Constants');

const ShowSettledExpensesModal = ({ isVisible, onClose, userId, friendId, friendName }) => {

    const [settledExpenses, setSettledExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getSettledExpensesBetween = async (userId, friendId) => {
        try {
            setIsLoading(true);
            console.log("User id is: " + userId);
            console.log("Friend id is: " + friendId);
            const response = await fetch(constants.baseUrl + '/getSettledExpensesBetween', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, friendId }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch settled expenses');
            }
            const data = await response.json();
            setSettledExpenses(data.settledExpenses);
        } catch (error) {
            console.error('Error fetching settled expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isVisible) {
            getSettledExpensesBetween(userId, friendId);
        }
    }, [isVisible, userId, friendId]);

    const handleDeleteExpense = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this settled expense?')) {
            try {
                const response = await fetch(constants.baseUrl + '/deleteSettledExpense', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        expenseId: expenseId
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to delete expense');
                }
                // Reload the settled expenses after deleting
                setSettledExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    if (!isVisible) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id="modalWrapper" onClick={onClose}>
            <div className='md:w-[600px] w-[90%] mx-auto flex flex-col'>
                <button className='text-white text-xl place-self-end' onClick={onClose}>&#10006;</button>
                <div className='bg-white p-2 rounded-xl'>
                    <h2 className="text-lg font-bold mb-2">Settled Expenses</h2>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : settledExpenses.length === 0 ? <span className=" text-green-600 text-pretty italic"> You are all settled up with {friendName}.! 🎉🎉</span> : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                                    <th className="border border-gray-300 px-4 py-2">Category</th>
                                    <th className="border border-gray-300 px-4 py-2">Description</th>
                                    <th className="border border-gray-300 px-4 py-2">Settled on</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {settledExpenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.categoryName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.description}</td>
                                        <td className="border border-gray-300 px-4 py-2">{expense.settledOn}</td>
                                        {/* <td>
                                            <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteExpense(expense.id)}>
                                                <FaTrash />
                                            </button>
                                        </td> */}
                                        <td>
                                            <button onClick={() => handleDeleteExpense(expense.id)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowSettledExpensesModal;
