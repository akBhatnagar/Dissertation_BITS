import React, { useState, useEffect } from 'react';

const constants = require('../utils/Constants');

const AddGroup = ({ userId, onAddGroup }) => {
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [members, setMembers] = useState([]);
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
            user.name.toLowerCase().includes(value.toLowerCase()) && !members.some(member => member.id === user.id)
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

    useEffect(() => {
        getUsersList();
    }, []);

    const handleSelectMemberToAdd = (memberId, memberName) => {
        if (memberName.trim() !== '') {

            setMembers([...members, { id: memberId, name: memberName }]);

            setSearchTerm('');
            setSearchResults([]);

            // members.forEach(member => { console.log(member.name) });
            // console.log("Selected members: " + members[0].name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(constants.baseUrl + '/addGroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    groupName,
                    members: members.map(member => member.id),
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

    const handleRemoveSelectedMember = (memberId, memberName) => {
        alert("Member to be removed: " + memberName + " with ID: " + memberId);
        setMembers(members.filter(member => member.id !== memberId));
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
                                    {members.slice(members.length / 2).map((member) => (
                                        <li
                                            key={member.id}
                                            onClick={() => handleRemoveSelectedMember(member.id, member.name)}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {member.name} {/* Display member name here */}
                                        </li>
                                    ))}
                                </ul>
                                <ul className="border border-gray-200 rounded-md overflow-hidden w-1/2">
                                    {members.slice(0, members.length / 2).map((member) => (
                                        <li
                                            key={member.id}
                                            onClick={() => handleRemoveSelectedMember(member.id, member.name)}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            {member.name} {/* Display member name here */}
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
