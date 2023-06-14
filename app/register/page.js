'use client'
import React from 'react';
import Link from 'next/link';
import { signUp, login } from '@/utils/appwrite-utils';
import toast from 'react-hot-toast';


const register = () => {
    function handleSignUp() {
        const registerLoading = toast.loading('Creating account...');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        if (name === '' || email === '' || password === '' || confirmPassword === '') {
            toast.dismiss(registerLoading);
            toast.error('Please fill out all fields', {
                duration: 6000,
            })
            return;
        }
        // fields are filled out and passwords don't match
        if (password !== confirmPassword) {
            toast.dismiss(registerLoading);
            toast.error('Passwords do not match');
            return;
        }
        signUp(name, email, password).then(response => {
            toast.dismiss(registerLoading);
            // user created
            toast.success('Account created successfully');
            console.log(response);
            // login user
            login(email, password).then(response => {
                toast.dismiss(registerLoading);
                // user logged in
                toast.success('Logged in successfully');
                console.log(response);
                // redirect to dashboard
                window.location.href = '/settings';

            }).catch(error => {
                toast.dismiss(registerLoading);
                // login failed
                toast.error('Error logging in ' + error.message);
                console.log(error);
            });

        }).catch(error => {
            toast.dismiss(registerLoading);
            toast.error('Error creating account ' + error.message);
            console.log(error);
        });

    }
    return (
        <div className="flex h-[70vh] ">
            <div className="max-w-md w-full m-auto bg-sky-400 rounded-lg">
                <div className="text-center font-semibold text-2xl mb-6">Create an account</div>
                <form className=" rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="blockfont-bold mb-2" htmlFor="username">
                            Your Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block font-bold mb-2" htmlFor="password">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block font-bold mb-2" htmlFor="password">
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirm-password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={handleSignUp}
                            className="bg-zinc-800 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                            Create Account
                        </button>
                        <Link href="/login">
                            <div className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                                Already have an account?
                            </div>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default register;