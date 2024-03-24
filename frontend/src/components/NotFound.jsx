import React from 'react';
import HeaderMenu from './HeaderMenu';
import not_found from '../assets/images/not_found.png';
import FooterMenu from './FooterMenu';

const NotFound = () => {

    return (
        <div>
            <HeaderMenu />
            <img className='p-0 grid h-full w-full h-lvh m-auto' src={not_found} alt="/" />
            <FooterMenu />
        </div>
    );
};

export default NotFound;
