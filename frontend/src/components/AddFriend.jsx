import React, { useState } from 'react';

const AddFriend = ({ userId, newFriendId, newFriendName, onAddFriend }) => {

    const [friendId, setFriendId] = useState();
    const [friendName, setFriendName] = useState('');


    const addFriend = async () => {
        if (friendName.trim() !== '') {
            try {
                const response = await fetch('http://localhost:8080/addFriend', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        friendId: newFriendId,
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.message !== null) {
                        onAddFriend(friendId, friendName);
                        setFriendName('');
                    }
                } else {
                    console.error('Failed to add friend');
                }
            } catch (error) {
                console.error('Error adding friend:', error);
            }
        }
    };

    const handleAddFriend = (userId, friendId) => {
        if (friendName.trim() !== '') {
            addFriend(userId, friendId);
        }
    };

    return (
        <React.Fragment>
            <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="px-6 py-4">
                    <h2 className="text-xl font-bold mb-2">Add Friend</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="friend" className="block text-sm font-medium text-gray-700">Friend's Name<sup className=' text-red-400'> *</sup></label>
                            <input id="friend" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 italic" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="personalizedMessage" className="block text-sm font-medium text-gray-700">Message <sup className=' text-red-400'> (optional)</sup></label>
                            <textarea id="personalizedMessage" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows="3" placeholder="Enter message"></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={(e) => handleAddFriend(userId, friendId)}>Add</button>
                        </div>
                    </form>
                </div>
            </div >
        </React.Fragment >
    )
};

export default AddFriend;
