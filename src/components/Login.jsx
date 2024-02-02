import React, { useState } from 'react'
import { ImFacebook2 } from "react-icons/im";
import { FaGoogle } from "react-icons/fa";
import PropTypes from 'prop-types';
import Dashboard from '../components/Dashboard'

async function loginUser(credentials) {

    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

const removeErrorClass = (e) => {
    document.getElementById(e.target.id+"InvalidError").classList.add('hidden');
    e.target.classList.remove("border-red-500", "text-red-500");
}

export default function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [token, setToken] = useState();
    
    function validateForm() {
        return email.length > 0 && password.length > 0;
    }
    
    const handleSubmit = async e => {
        e.preventDefault();
        const res = await loginUser({
          email,
          password
        });
   
        if (res.error !== undefined) {
            const invalidElementId = res.error === "Invalid email" ? "email" : "password";
            document.getElementById(invalidElementId).classList.add("border-red-500", "text-red-500"); 
            document.getElementById(invalidElementId).focus();
            document.getElementById(invalidElementId+"InvalidError").classList.remove("hidden");
        }

        if (res.token !== undefined) {
            window.localStorage.setItem("auth_token", res.token);
            document.location.reload();
            setToken(res.token);
      };
    }
  return (
    <div className='relative w-full h-screen bg-zinc-900/70'>
        <div className='flex justify-center items-center h-full '>
            <form className='max-w-[400px] w-full mx-auto bg-white bg-opacity-90 p-8 shadow-sm' onSubmit={handleSubmit}>
                <h2 className='text-3xl font-bold text-center py-4'> Sign in to your account </h2>
                <div className='flex justify-between py-8'>
                    <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><ImFacebook2 className='mr-2' /> Facebook</p>
                    <p className='border shadow-lg hover:shadow-xl px-6 py-2 relative flex items-center'><FaGoogle className='mr-2' /> Google</p>
                </div>
                <div className='flex flex-col mb-4'>
                    <div className='flex'>
                        <label className='font-bold mb-0.5 flex-auto w-48'>Email</label>
                        <label className='text-red-500 flex-auto w-32 hidden' id="emailInvalidError"> Invalid email </label>
                    </div>
                    <input className='border border-transparent relative bg-gray-100 bg-opacity-10 p-1 rounded-lg' id = "email" autoFocus type="email" placeholder='Enter email...' value={email} onInput={(e) => removeErrorClass(e)} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className='flex flex-col'>
                    <div className='flex'>
                        <label className='font-bold mb-0.5 flex-auto w-48'>Password</label>
                        <label className='text-red-500 flex-auto w-32 hidden' id="passwordInvalidError"> Invalid password </label>
                    </div>
                    <input className='border border-transparent relative bg-gray-100 bg-opacity-10 p-1 rounded-lg' id = "password" type="password" placeholder='Enter password...' value={password} onInput={(e) => removeErrorClass(e)} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className='w-full py-3 mt-2 bg-indigo-600 hover:bg-gray-600 relative text-white' type="submit">Sign In</button>
                <p className='flex items-center mt-2'><input className='mr-2' type="checkbox" /> Remember me</p>
                <p className='text-center mt-4'>Not a member?<a href="http://akshaybhatnagar.in">Join now</a></p>
            </form>
        </div>
        

    </div>
  )
}

Login.propTypes = {

    setToken: PropTypes.func.isRequired
}
