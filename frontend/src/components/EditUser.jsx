import React, { useState } from 'react';

const EditUser = () => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/editUser/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <label>User ID:</label>
                <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required /><br />
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /><br />
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
                <button type="submit">Edit User</button>
            </form>
        </div>
    );
};

export default EditUser;
