import React, { useEffect, useState } from 'react';
import HeaderMenu from './HeaderMenu';
import FooterMenu from './FooterMenu';
import robotImage from '../assets/images/robot.jpeg';
import { checkIfUserLoggedIn } from '../utils/UserAuthenticator';
import Login from './Login';

const Dashboard = () => {

  const [name, setName] = useState('');
  const [friends, setFriends] = useState([]);

  const handleAddExpense = (friendId) => {
    console.log(`Adding expense for friend with ID ${friendId}`)
  };

  useEffect(() => {

    const storedName = localStorage.getItem('name');

    if (storedName) {
      setName(storedName);
    }

    fetch('http://localhost:8080/getFriends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {

        setFriends(data.friendList);
      })
      .catch((error) => {
        console.error('Error fetching friends:', error);
      });
  }, []);

  const email = window.localStorage.getItem("email");


  const isUserLoggedIn = checkIfUserLoggedIn();

  if (!isUserLoggedIn) {
    return <Login />
  }

  return (
    <div>
      <HeaderMenu />
      <div className=' flex'>
        <div className="flex-1 flex-col h-screen pt-10">

          <main className="flex-1 p-8 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Friends List</h2>
            <table className=" w-1/2 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((friend) => (
                  <tr key={friend.id}>
                    <td className="border border-gray-300 px-4 py-2">{friend.name}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center"
                        onClick={() => handleAddExpense(friend.id)}
                      >
                        Add Expense
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded justify-center mt-2">Add Friend</button>
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
      <FooterMenu />
    </div>
  )
}

export default Dashboard;