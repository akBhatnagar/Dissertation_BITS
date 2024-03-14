import React, { useState, useEffect } from 'react';

const GetAllUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/getAllUsers')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>All Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default GetAllUsers;
