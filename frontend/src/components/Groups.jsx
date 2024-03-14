import React, { useState, useEffect } from 'react';
import HeaderMenu from './HeaderMenu';
import FooterMenu from './FooterMenu';
import robotImage from '../assets/images/robot.jpeg';
import ShowExpenseModal from './Modals/ShowExpenseModal';
import AddExpenseModal from './Modals/AddExpenseModal';
import AddExpense from './AddExpense';
import ShowGroupMembersModal from './Modals/ShowGroupMembersModal';

const Groups = () => {
    const userId = localStorage.getItem('id');
    const name = window.localStorage.getItem('name');
    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [groupId, setGroupId] = useState();
    const [groupName, setGroupName] = useState('');
    const [showAllExpensesModal, setShowAllExpensesModal] = useState(false);
    const [showSettledExpensesModal, setShowSettledExpensesModal] = useState(false);
    const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/groups', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }
                const data = await response.json();
                setGroups(data.groups);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [userId]);

    const handleShowExpenses = (groupId, groupName) => {
        setGroupId(groupId);
        setGroupName(groupName);
        setShowAllExpensesModal(true);
    };

    const handleShowGroupMembers = (groupId, groupName) => {
        setGroupId(groupId);
        setGroupName(groupName);
        setShowGroupMembersModal(true);
    };

    return (
        <div className=' bg-gray-200'>
            <HeaderMenu />
            <div className=' flex'>
                <div className="flex-1 flex-col h-screen pt-10">
                    <main className="flex-1 p-8 overflow-y-auto">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-4">Groups List</h2>
                            <table className="w-auto min-w-[500px] border-collapse border border-gray-300 mb-8">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2" colSpan={3}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((group) => (
                                        <tr key={group.id}>
                                            <td className="border border-gray-300 px-4 py-2">{group.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <button
                                                    className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center"
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setGroupId(group.id);
                                                        setGroupName(group.name);
                                                    }}
                                                >
                                                    Add Expense
                                                </button>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <button
                                                    className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center"
                                                    onClick={() => handleShowExpenses(group.id, group.name)}
                                                >
                                                    Show expenses
                                                </button>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <button
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center"
                                                    onClick={() => {
                                                        handleShowGroupMembers(group.id, group.name)
                                                    }}
                                                >
                                                    Show members
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex-1 justify-end">
                                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Add Group</button>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="flex-1 p-4 flex flex-col items-center h-screen mt-20">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                        <img src={robotImage} alt="Robot" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2 animate-bounce">Hi {name}</h1>
                        <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
                        <p className="text-gray-600 text-justify pr-10">Welcome to Your Personal Expense Management Dashboard! Track your spending, split expenses with friends, and stay on top of your finances effortlessly. Start managing your money with ease and clarity.</p>
                    </div>
                </div>
            </div>
            <AddExpenseModal isVisible={showModal} onClose={() => setShowModal(false)} groupId={groupId} userId={userId} groupName={groupName}>
                <AddExpense groupName={groupName} groupId={groupId} setShowModal={setShowModal} />
            </AddExpenseModal>
            <ShowExpenseModal isVisible={showAllExpensesModal} onClose={() => setShowAllExpensesModal(false)} groupId={groupId} userId={userId} groupName={groupName} />
            <ShowGroupMembersModal isVisible={showGroupMembersModal} onClose={() => setShowGroupMembersModal(false)} groupId={groupId} groupName={groupName} />
            <FooterMenu />
        </div>
    );
};

export default Groups;
