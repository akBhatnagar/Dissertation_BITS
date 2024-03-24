import React, { useEffect, useState } from 'react';

const GetExpenses = () => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetch('/getExpenses')
            .then(response => response.json())
            .then(data => setExpenses(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Expenses List</h1>
            <ul>
                {expenses.map(expense => (
                    <li key={expense.id}>
                        {expense.description} - {expense.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GetExpenses;
