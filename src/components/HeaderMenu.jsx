import React from 'react';
import { Link } from 'react-router-dom'
import 'tailwindcss/tailwind.css';

const HeaderMenu = () => {
  return (
    <div className="bg-gray-300 z-50">
      <nav className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <ul className="flex ml-4 space-x-4">
            <li>
              <Link to="/" className="text-gray-800 hover:text-gray-600 transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-800 hover:text-gray-600 transition duration-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/friends" className="text-gray-800 hover:text-gray-600 transition duration-300">
                Friends
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-800 hover:text-gray-600 transition duration-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <button className="bg-gray-800 text-white px-4 py-2 ml-4 rounded-lg hover:bg-gray-700 transition duration-300">
            Sign out
          </button>
        </div>
      </nav>
    </div>
  );
};

export default HeaderMenu;