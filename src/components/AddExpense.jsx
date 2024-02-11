import React, { useEffect, useState } from 'react'

const AddExpense = ({ friendName }) => {

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/getCategories', {
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

    const handleAddExpense = (expense) => {
        console.log("In handle add expense")
    };
    return (
        <React.Fragment>
            <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                <div class="px-6 py-4">
                    <h2 class="text-xl font-bold mb-2">Record Expense</h2>
                    <form action={handleAddExpense}>
                        <div class="mb-4">
                            <label for="friend" class="block text-sm font-medium text-gray-700">Friend's Name<sup className=' text-red-400'> *</sup></label>
                            <input id="friend" disabled type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-200 text-gray-500 italic" value={friendName} />
                        </div>
                        <div class="mb-4">
                            <label for="amount" class="block text-sm font-medium text-gray-700">Amount<sup className=' text-red-400'> *</sup></label>
                            <input id="amount" required type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Enter amount" />
                        </div>
                        <div class="mb-4">
                            <label for="category" class="block text-sm font-medium text-gray-700">Category<sup className=' text-red-400'> *</sup></label>
                            <select id="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                                <option key="others" value="others">Others</option>
                            </select>
                        </div>
                        <div class="mb-4">
                            <label for="date" class="block text-sm font-medium text-gray-700">Date<sup className=' text-red-400'> *</sup></label>
                            <input id="date" required type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" max={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div class="mb-4">
                            <label for="description" class="block text-sm font-medium text-gray-700">Description <sup className=' text-red-400'> (optional)</sup></label>
                            <textarea id="description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3" placeholder="Enter description"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Record Expense</button>
                        </div>
                    </form>
                </div>
            </div >

        </React.Fragment >
    )
}

export default AddExpense