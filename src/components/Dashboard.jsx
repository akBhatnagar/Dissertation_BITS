import React, { useEffect, useState } from 'react'
import HeaderMenu from './HeaderMenu'
import FooterMenu from './FooterMenu'

const Dashboard = () => {

  const handleAddExpense = (friendId) => {
    // Handle adding expense for the selected friend
    console.log(`Adding expense for friend with ID ${friendId}`)
  };

  const [friends, setFriends] = useState([]);
        
  useEffect(() => {
  
    const email = window.localStorage.getItem("email");

    fetch('http://localhost:8080/getFriends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then((response) => response.json())
    .then((data) => {
        // Assuming the API response is an array of friend names
        setFriends(data);
      })
      .catch((error) => {
        console.error('Error fetching friends:', error);
      });
  }, []);

  return (
    <div>
      <HeaderMenu />

          <div className="flex flex-col h-screen pt-10">

            <main className="flex-1 p-8 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Friends List</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {friends.map((friend) => (
                    <tr key={friend.id}>
                      <td className="border border-gray-300 px-4 py-2">{friend.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{friend.name}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleAddExpense(friend.id)}
                        >
                          Add Expense
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </main>
    </div>
    );
      <FooterMenu />
    </div>
  )
}

export default Dashboard