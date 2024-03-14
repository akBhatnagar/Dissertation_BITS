import React, { useState } from 'react';

const DeleteUser = () => {
    const [userId, setUserId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/deleteUser/${userId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Delete User</h1>
            <form onSubmit={handleSubmit}>
                <label>User ID:</label>
                <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required /><br />
                <button type="submit">Delete User</button>
            </form>
        </div>
    );
};

export default DeleteUser;
