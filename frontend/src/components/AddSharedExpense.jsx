import React, { useState } from 'react';

const AddSharedExpense = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/addSharedExpense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description, amount })
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Add Shared Expense</h1>
            <form onSubmit={handleSubmit}>
                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required /><br />
                <label>Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required /><br />
                <button type="submit">Add Shared Expense</button>
            </form>
        </div>
    );
};

export default AddSharedExpense;
