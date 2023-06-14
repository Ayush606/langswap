'use client'
import React from 'react';
import Link from 'next/link';
import { login } from '@/utils/appwrite-utils';
import { toast } from 'react-hot-toast';

const Login = () => {
    function handleLogin() {
        const loginLoading = toast.loading('Logging in...');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email === '' || password === '') {
            toast.error('Please fill out all fields', { id: loginLoading });
            return;
        }
        login(email, password).then(response => {
            toast.success('Logged in successfully!', { id: loginLoading });
            console.log(response);

            window.location.href = '/dashboard';
        }).catch(error => {
            toast.error('Login failed! \n' + error.message, { id: loginLoading });
            console.log(error);
        });
    }
    return (
        <div className="flex h-screen ">
            <div className="max-w-md w-full m-auto bg-sky-400 rounded-lg ">
                <div className="text-center font-semibold text-2xl mb-6">Login</div>
                <form className=" rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block dark font-bold mb-2" htmlFor="username">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 dark leading-tight focus:outline-none focus:shadow-outline text-zinc-800"
                            id="email"
                            type="text"
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block dark font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className=" shadow appearance-none border rounded w-full py-2 px-3 dark leading-tight focus:outline-none focus:shadow-outline text-zinc-800"
                            id="password"
                            type="password"
                            placeholder="Password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleLogin}
                            className="bg-zinc-700 hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                            Sign In
                        </button>
                        <Link href="/forgot-password">
                            <div className="inline-block align-baseline font-bold text-sm text-zinc-800 hover:text-zinc-500">
                                Forgot Password?
                            </div>
                        </Link>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                </p>
            </div>
        </div>
    );
};

export default Login;