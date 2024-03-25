import React, { useState, useEffect } from 'react';

const constants = require('../../utils/Constants');

const ShowGroupMembersModal = ({ isVisible, onClose, groupId, groupName }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetch(constants.baseUrl + '/groups/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ groupId })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch group members');
                }
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (isVisible) {
            fetchGroupMembers();
        }
    }, [isVisible, groupId]);

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${isVisible ? '' : 'hidden'}`}>
            <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="text-lg font-bold mb-4">{groupName}'s' Members</h3>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} className="border-b py-2">
                            {user.name}
                        </li>
                    ))}
                </ul>
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ShowGroupMembersModal;
