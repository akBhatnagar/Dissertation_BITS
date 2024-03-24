import React, { useEffect } from 'react';

const InformationBox = ({ message, onClose, autoCloseDuration }) => {
    useEffect(() => {
        if (autoCloseDuration) {
            const timeoutId = setTimeout(() => {
                onClose();
            }, autoCloseDuration);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [autoCloseDuration, onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg">{message}</p>
                <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">OK</button>
            </div>
        </div>
    );
};

export default InformationBox;
