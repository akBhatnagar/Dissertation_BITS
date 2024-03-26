import { React } from 'react';
import { Link } from 'react-router-dom'
import 'tailwindcss/tailwind.css';

const handleSignout = () => {
  localStorage.clear();
  window.location.reload();
};

const HeaderMenu = () => {
  return (
    <div className="bg-gray-300 z-50 fixed top-0 left-0 right-0 bg-opacity-40">
      <nav className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center mx-auto justify-center">
          <ul className="flex ml-4 space-x-4">
            <li>
              <Link to="/" className="font-bold pl-2 hover:bg-gray-400 hover:p-2 hover:rounded-lg transition duration-300 ease-in-out">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="font-bold pl-2 hover:bg-gray-400 hover:p-2 hover:rounded-lg transition duration-300 ease-in-out">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/friends" className="font-bold pl-2 hover:bg-gray-400 hover:p-2 hover:rounded-lg transition duration-300 ease-in-out">
                Friends
              </Link>
            </li>
            <li>
              <Link to="/groups" className="font-bold pl-2 hover:bg-gray-400 hover:p-2 hover:rounded-lg transition duration-300 ease-in-out">
                Groups
              </Link>
            </li>
            <li>
              <Link to="/about" className="font-bold pl-2 hover:bg-gray-400 hover:p-2 hover:rounded-lg transition duration-300 ease-in-out">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="font-bold pl-2 hover:bg-gray-400 hover:p-2 hover:rounded-lg transition duration-300 ease-in-out">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <button className="bg-gray-800 text-white px-4 py-2 ml-4 rounded-lg hover:bg-gray-700 transition duration-300"
            onClick={handleSignout}>
            Sign out
          </button>
        </div>
      </nav>
    </div>
  );
};

export default HeaderMenu;
