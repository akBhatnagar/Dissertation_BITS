// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const userId = localStorage.getItem('id');

//     const navigate = useNavigate();

//     useEffect(() => {
//         if (userId) {
//             navigate('/dashboard'); // Redirect to home page if userId is not present
//         }
//     }, [userId, navigate]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         fetch('/signup', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ name, email, password })
//         })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     alert(data.message);
//                     // Redirect to login page
//                 } else {
//                     alert(data.message);
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//     };

//     return (
//         <div>
//             <h1>Signup</h1>
//             <form onSubmit={handleSubmit}>
//                 <label>Name:</label>
//                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} required /><br />
//                 <label>Email:</label>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br />
//                 <label>Password:</label>
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
//                 <button type="submit">Signup</button>
//             </form>
//         </div>
//     );
// };

// export default Signup;


import React, { useState } from 'react';
import bgImage from '../assets/images/bg-image.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function SignUp() {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userId = localStorage.getItem('id');

    const removeErrorToast = () => {
        document.getElementById('emailExistToast').classList.add('hidden');
    }


    useEffect(() => {
        if (userId) {
            navigate('/dashboard');
        }
    });
    async function signUpUser(userDetails) {

        return fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userDetails)
        })
            .then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await signUpUser({
            name,
            email,
            password
        });

        if (res.error !== undefined) {
            document.getElementById("emailExistToast").classList.remove('hidden');

        }

        console.log(res.status);
        if (res.status == 200) {
            navigate('/login');
        };
    }

    return (
        <div className="relative w-full h-screen bg-zinc-900/70 z-0">
            <img className='absolute w-full h-full object-cover mix-blend-overlay bg-center' src={bgImage} alt="/" />


            <div id="emailExistToast" className="flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 fixed right-2 bottom-2 hidden" role="alert">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9" />
                </svg>
                <div className="ps-4 text-sm font-normal">Email already exist.</div>
            </div>

            <div className='flex justify-center items-center h-full '>
                <form className='max-w-[400px] w-full mx-auto bg-white bg-opacity-90 p-8 shadow-sm z-50' onSubmit={handleSubmit}>
                    <div className='flex'>
                        <h2 className=" flex-1 text-2xl font-bold mb-4">SignUp</h2>
                        <Link to="/">
                            <p className=' pt-0 text-gray-600 -ml-12 -mt-4'> Already Registered..?</p>
                            <button className=' flex-1' href="#">
                                <p className='border shadow-lg hover:shadow-xl px-4 py-2 relative flex items-center w-40 rounded-lg bg-gray-300 hover:bg-gray-400'> Sign in now.!</p>
                            </button>
                        </Link>
                    </div>
                    <div>
                        <label htmlFor="name" className="font-bold mb-0.5 flex-auto w-48">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="font-bold mb-0.5 flex-auto w-48">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onInput={(e) => removeErrorToast()}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="font-bold mb-0.5 flex-auto w-48">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-1"
                            required
                        />
                    </div>
                    <button className='w-full py-3 mt-2 bg-indigo-600 hover:bg-gray-600 relative text-white' type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;