import React, { useEffect, useState } from 'react';

const constants = require('../utils/Constants');

const AddFriend = ({ userId, onAddFriend }) => {

    const [friendId, setFriendId] = useState();
    const [friendName, setFriendName] = useState('');
    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filteredUsers.slice(0, 5));
    };

    useEffect(() => {
        getUsersList();
    }, []);

    // Fetch users list when component is rendered

    const getUsersList = async () => {
        try {
            const response = await fetch(constants.baseUrl + '/getAllUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addFriend = async () => {
        console.log("Adding friend with ids: " + userId + "   " + friendId);
        if (friendName.trim() !== '') {
            try {
                const response = await fetch(constants.baseUrl + '/addFriend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        friendId: friendId,
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    if (data.status === 200) {
                        onAddFriend(friendId, friendName, data.message, true);
                        setFriendName('');
                    }
                } else {
                    onAddFriend(friendId, friendName, data.message);
                    console.error('Failed to add friend');
                }
            } catch (error) {
                console.error('Error adding friend:', error);
            }
        }
    };

    const handleAddFriend = (friendId, friendName) => {
        if (friendName.trim() !== '') {
            setFriendName(friendName);
            setSearchTerm(friendName);
            setFriendId(friendId);
            setSearchResults([]);
            // addFriend(userId, friendId);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addFriend(userId, friendId);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="px-6 py-4">
                <h2 className="text-xl font-bold mb-2">Add Friend</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="friend" className="block text-sm font-medium text-gray-700">Friend's Name<sup className='text-red-400'> *</sup></label>
                        <input
                            id="friend"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 italic"
                            placeholder="Search for a friend..."
                            value={searchTerm}
                            onChange={handleChange}
                        />
                        <ul className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                            {searchResults.map(user => (
                                <li
                                    key={user.id}
                                    onClick={() => handleAddFriend(user.id, user.name)}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {user.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="personalizedMessage" className="block text-sm font-medium text-gray-700">Message <sup className='text-red-400'>(optional)</sup></label>
                        <textarea id="personalizedMessage" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3" placeholder="Enter message"></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" onClick={handleSubmit} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add</button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default AddFriend;
