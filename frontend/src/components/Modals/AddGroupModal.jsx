import React, { useState } from 'react';

const AddGroupModal = ({ isVisible, onClose, children }) => {

    if (!isVisible) return null;

    const handleCloseModal = (e) => {
        if (e.target.id === "modalWrapper") onClose();
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id="modalWrapper" onClick={handleCloseModal}>
            <div className=' md:w-[600px] w-[90%] mx-auto flex flex-col'>
                <button className='text-white text-xl place-self-end' onClick={() => onClose()}>&#10006;</button>
                <div className='bg-white p-2 rounded-xl'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AddGroupModal;
