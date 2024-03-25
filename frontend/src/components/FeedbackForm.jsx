import { Toast } from 'bootstrap';
import React, { useState } from 'react';

const constants = require('../utils/Constants');

function FeedbackForm() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        message: ''
    });

    const [showToast, setShowToast] = useState(false);

    const handleSubmitQuery = () => {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 5000); // Hide toast after 3 seconds
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(constants.baseUrl + '/addFeedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ formData })
        })
            .then(response => response.json())
            .then(data => {

                if (data.id !== null || data.id !== undefined) {

                    document.getElementById("querySubmittedToast").classList.remove("hidden");
                    document.getElementById("name").value = "";
                    document.getElementById("phoneNumber").value = "";
                    document.getElementById("email").value = "";
                    document.getElementById("message").value = "";
                    setTimeout(() => {
                        document.getElementById("querySubmittedToast").classList.add("hidden");
                    }, 2000);
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="flex items-center justify-center p-0 grid h-full w-full h-lvh m-auto bg-gray-400">
            <div className="max-w-2xl p-8 shadow-md rounded-lg bg-gray-300">
                <h2 className="text-3xl font-bold mb-4">Have a query?  Let us know!</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-200"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="block mb-2">Phone Number:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-200"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-200"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-2">Query:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-200"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
                </form>
            </div>
            <div
                id="querySubmittedToast"
                className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow right-5 bottom-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 hidden"
                role="info"
            >
                <div className="text-sm font-normal text-white">Query submitted successfully</div>
            </div>
        </div>
    );
}

export default FeedbackForm;
