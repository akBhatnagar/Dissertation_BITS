import React, { useState } from 'react';

const DeleteSharedExpense = () => {
    const [expenseId, setExpenseId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/deleteSharedExpense/${expenseId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Delete Shared Expense</h1>
            <form onSubmit={handleSubmit}>
                <label>Expense ID:</label>
                <input type="number" value={expenseId} onChange={(e) => setExpenseId(e.target.value)} required /><br />
                <button type="submit">Delete Shared Expense</button>
            </form>
        </div>
    );
};

export default DeleteSharedExpense;
