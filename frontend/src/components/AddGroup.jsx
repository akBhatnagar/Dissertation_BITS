import React, { useState, useEffect } from 'react';

const AddGroup = ({ userId, onAddGroup }) => {
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembersId, setSelectedMembersId] = useState([]);
    const [selectedMembersName, setSelectedMembersName] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase()) && !selectedMembersId.includes(user.id)
        );
        setSearchResults(filteredUsers.slice(0, 5));
    };

    const handleAddUser = (user) => {
        if (!selectedUsers.includes(user.id)) {
            setSelectedUsers([...selectedUsers, user.id]);
            setSearchTerm('');
        }
    };

    const getUsersList = async () => {
        try {
            const response = await fetch('http://localhost:8080/getAllUsers', {
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

    useEffect(() => {
        getUsersList();
    }, []);

    const handleSelectMemberToAdd = (memberId, memberName) => {
        if (memberName.trim() !== '') {
            setSelectedMembersName([...selectedMembersName, memberName]);
            setSelectedMembersId([...selectedMembersId, memberId]);

            setSearchTerm('');
            setSearchResults([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/addGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    groupName,
                    members: selectedMembersId,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                onAddGroup(data.groupId, groupName, data.message, true);
                setGroupName('');
            } else {
                onAddGroup(data.groupId, groupName, data.message);
                console.error('Failed to add friend');
            }


            if (!response.ok) {
                throw new Error('Failed to add group');
            }
            // Handle success
        } catch (error) {
            console.error('Error adding group:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="px-6 py-4">
                <h2 className="text-xl font-bold mb-2">Add Group</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">Group Name</label>
                        <input
                            id="groupName"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <div className="mb-4">
                            <label htmlFor="friend" className="block text-sm font-medium text-gray-700">Select members to add to group<sup className='text-red-400'> *</sup></label>
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
                                        onClick={() => handleSelectMemberToAdd(user.id, user.name)}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {user.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <span className="block text-sm font-medium text-gray-700">Selected Members:</span>
                            <div className="mt-2 flex justify-between">
                                <ul className="border border-gray-200 rounded-md overflow-hidden w-1/2">
                                    {selectedMembersName.slice(selectedMembersName.length / 2).map((memberName, index) => (
                                        <li
                                            key={index}
                                            onClick={() => alert("Remove member")}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {memberName} {/* Display member name here */}
                                        </li>
                                    ))}
                                </ul>
                                <ul className="border border-gray-200 rounded-md overflow-hidden w-1/2">
                                    {selectedMembersName.slice(0, selectedMembersName.length / 2).map((memberName, index) => (
                                        <li
                                            key={index}
                                            onClick={() => alert("Remove member")}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {memberName} {/* Display member name here */}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Group</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGroup;
