import React, { useEffect, useState } from 'react'

const constants = require('../utils/Constants');

const AddExpense = ({ friendName, friendId, setShowModal }) => {

    const [categories, setCategories] = useState([]);
    const [whoPaid, setWhoPaid] = useState(localStorage.getItem('id')); // Default to 'You'
    const [userId, setUserId] = useState(localStorage.getItem('id'));


    useEffect(() => {
        fetch(constants.baseUrl + '/getCategories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {

                setCategories(data.categories);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleAddExpense = async (e, setShowModal, friendId) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const categoryId = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;

        try {
            const response = await fetch(constants.baseUrl + '/addExpense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    friendId: friendId,
                    amount: amount,
                    description: description,
                    date: date,
                    categoryId: categoryId,
                    paidBy: whoPaid
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add expense');
            }
            setShowModal(false); // Close the modal window
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    return (
        <React.Fragment>
            <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <h2 className="text-xl font-bold mb-2">Record Expense</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="friend" className="block text-sm font-medium text-gray-700">Friend's Name<sup className=' text-red-400'> *</sup></label>
                            <input id="friend" disabled type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-200 text-gray-500 italic" value={friendName} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount<sup className=' text-red-400'> *</sup></label>
                            <input id="amount" required type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Enter amount" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Who Paid?<sup className=' text-red-400'> *</sup></label>
                            <div>
                                <label className="inline-flex items-center">
                                    <input type="radio" className="form-radio" name="whoPaid" value={localStorage.getItem('id')} checked={whoPaid === localStorage.getItem('id')} onChange={() => setWhoPaid(localStorage.getItem('id'))} />
                                    <span className="ml-2">You</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" className="form-radio" name="whoPaid" value={friendId} checked={whoPaid === friendId} onChange={() => setWhoPaid(friendId)} />
                                    <span className="ml-2">{friendName}</span>
                                </label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category<sup className=' text-red-400'> *</sup></label>
                            <select id="category" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                                <option key="-1" value="others">Others</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date<sup className=' text-red-400'> *</sup></label>
                            <input id="date" required type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" max={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <sup className=' text-red-400'> (optional)</sup></label>
                            <textarea id="description" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3" placeholder="Enter description"></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={(e) => handleAddExpense(e, setShowModal, friendId)}>Record Expense</button>
                        </div>
                    </form>
                </div>
            </div >

        </React.Fragment >
    )
}

export default AddExpense