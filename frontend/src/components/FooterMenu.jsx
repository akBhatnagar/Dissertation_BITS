import React from 'react';
import { AiFillFacebook, AiFillTwitterSquare, AiFillGoogleCircle, AiFillLinkedin } from 'react-icons/ai';
import { facebookUrl, twitterUrl, linkedinUrl, gmailUrl } from '../utils/Constants';

const FooterMenu = () => {
  return (
    <div className="bg-gray-400 py-2 fixed bottom-0 left-0 right-0 bg-opacity-40">
      <div className="flex flex-col items-center">
        <div className="flex items-center space-x-4 mb-4">
          <span>&copy; 2024 Expense Management System</span>
          <div className='flex'>
            <span className='flex-auto'>Made with &#9829; in <span className='indian-flag-gradient-text'> India </span></span>
          </div>
        </div>
        <div className="flex space-x-4">
          <a href={facebookUrl} className="text-gray-800 hover:text-gray-600 transition duration-300">
            <AiFillFacebook size={24} />
          </a>
          <a href={twitterUrl} className="text-gray-800 hover:text-gray-600 transition duration-300">
            <AiFillTwitterSquare size={24} />
          </a>
          <a href={gmailUrl} className="text-gray-800 hover:text-gray-600 transition duration-300">
            <AiFillGoogleCircle size={24} />
          </a>
          <a href={linkedinUrl} className="text-gray-800 hover:text-gray-600 transition duration-300">
            <AiFillLinkedin size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;
