import React, { useState } from 'react';

const DeleteExpense = () => {
    const [expenseId, setExpenseId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/deleteExpense/${expenseId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Delete Expense</h1>
            <form onSubmit={handleSubmit}>
                <label>Expense ID:</label>
                <input type="number" value={expenseId} onChange={(e) => setExpenseId(e.target.value)} required /><br />
                <button type="submit">Delete Expense</button>
            </form>
        </div>
    );
};

export default DeleteExpense;
