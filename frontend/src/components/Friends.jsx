import React, { useState, useEffect } from 'react';
import HeaderMenu from './HeaderMenu';
import FooterMenu from './FooterMenu';
import robotImage from '../assets/images/robot.jpeg';
import AddExpenseModal from './Modals/AddExpenseModal';
import AddExpense from './AddExpense';
import ShowExpenseModal from './Modals/ShowExpenseModal';
import ShowSettledExpensesModal from './Modals/ShowSettledExpensesModal';
import AddFriendModal from './Modals/AddFriendModal';
import AddFriend from './AddFriend';
import InformationBox from './InformationBox';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const constants = require('../utils/Constants');

const Friends = () => {

    const userId = localStorage.getItem('id');
    const name = window.localStorage.getItem('name');
    const [friends, setFriends] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [friendId, setFriendId] = useState();
    const [friendName, setFriendName] = useState('');
    const [showAllExpensesModal, setShowAllExpensesModal] = useState(false);
    const [showSettledExpensesModal, setShowSettledExpensesModal] = useState(false);
    const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);
    const [newFriendId, setNewFriendId] = useState();
    const [newFriendName, setNewFriendName] = useState('');
    const [showInformation, setShowInformation] = useState(false);
    const [informationMessage, setInformationMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/'); // Redirect to home page if userId is not present
        }
    }, [userId, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(constants.baseUrl + '/getFriends', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId })
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch friends');
                }
                const data = await response.json();
                setFriends(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, [userId]);

    const handleShowExpenses = (friendId, friendName) => {
        setFriendId(friendId);
        setFriendName(friendName);
        setShowAllExpensesModal(true);
    };

    const handleShowSettledExpenses = (friendId, friendName) => {
        setFriendId(friendId);
        setFriendName(friendName);
        setShowSettledExpensesModal(true);
    };

    const handleAddFriend = (friendName, friendId) => {
        setNewFriendId(friendId);
        setNewFriendName(friendName);
        setAddFriendModalVisible(true);
    };

    const onAddFriend = (friendId, friendName, message, result = false) => {
        // Assuming friendId is the ID of the newly added friend
        if (result) {
            setFriends([...friends, { id: friendId, name: friendName }]);
        }
        setAddFriendModalVisible(false);
        setInformationMessage(message); // Set the message for the information box
        setShowInformation(true); // Show the information box

        // Close the information box after 3 seconds
        setTimeout(() => {
            setShowInformation(false);
        }, 3000);
    };

    const handleCloseInformation = () => {
        setShowInformation(false);
    };


    const handleRemoveFriend = async (friendId) => {
        const confirmed = window.confirm('Are you sure you want to remove this friend?');
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(constants.baseUrl + '/removeFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    friendId: friendId,
                }),
            });
            if (response.ok) {
                // Remove the friend from the list
                setFriends(friends.filter((friend) => friend.id !== friendId));
            } else {
                console.error('Failed to remove friend');
            }
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };


    return (
        <div className=' bg-gray-200'>
            <HeaderMenu />
            <div className=' flex'>
                <div className="flex-1 flex-col h-screen pt-10">
                    <main className="flex-1 p-8 overflow-y-auto">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-4">Friends List</h2>
                            <table className="w-auto min-w-[500px] border-collapse border border-gray-300 mb-8">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2" colSpan={4}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {friends.map((friend) => (
                                        <tr key={friend.id}>
                                            <td className="border border-gray-300 px-4 py-2">{friend.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <button
                                                    className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center"
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setFriendId(friend.id);
                                                        setFriendName(friend.name);
                                                    }}
                                                >
                                                    Add Expense
                                                </button>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <button
                                                    className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center"
                                                    onClick={() => handleShowExpenses(friend.id, friend.name)}
                                                >
                                                    Show all expenses
                                                </button>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <button
                                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center"
                                                    onClick={() => {
                                                        handleShowSettledExpenses(friend.id, friend.name)
                                                    }}
                                                >
                                                    Show Settled Expenses
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => handleRemoveFriend(friend.id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex-1 justify-end">
                                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => handleAddFriend(friendName, friendId)}>
                                    Add Friend
                                </button>
                            </div>
                            {/* <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center mt-2">Add Friend</button> */}
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
            <AddExpenseModal isVisible={showModal} onClose={() => setShowModal(false)} friendId={friendId} userId={userId} friendName={friendName}>
                <AddExpense friendName={friendName} friendId={friendId} setShowModal={setShowModal} />
            </AddExpenseModal>

            <ShowExpenseModal isVisible={showAllExpensesModal} onClose={() => setShowAllExpensesModal(false)} friendId={friendId} userId={userId} friendName={friendName} />
            <ShowSettledExpensesModal isVisible={showSettledExpensesModal} onClose={() => setShowSettledExpensesModal(false)} userId={userId} friendId={friendId} friendName={friendName} />

            <AddFriendModal isVisible={isAddFriendModalVisible} onClose={() => setAddFriendModalVisible(false)} userId={userId} newFriendId={newFriendId} newFriendName={newFriendName}>
                <AddFriend userId={userId} onAddFriend={onAddFriend} />
            </AddFriendModal>
            <FooterMenu />
            {showInformation && <InformationBox message={informationMessage} onClose={handleCloseInformation} autoCloseDuration={3000} />}
        </div>
    );
};

export default Friends;
