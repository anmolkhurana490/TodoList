import React, { useState } from 'react';

const Auth = ({ registerUser, loginUser }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [userData, setUserData] = useState({
        name: '', email: '', password: ''
    });

    const updateField = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const processForm = async (e) => {
        e.preventDefault();

        if (activeTab === 'login') {
            await loginUser({ email: userData.email, password: userData.password });
        } else {
            await registerUser(userData);
        }
    };

    const switchMode = (mode) => {
        if (activeTab === mode) return;
        setUserData({ name: '', email: '', password: '' });
        setActiveTab(mode);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex border-b">
                        <button
                            onClick={() => switchMode('login')}
                            className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === 'login'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => switchMode('register')}
                            className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === 'register'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="p-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            {activeTab === 'login' ? 'Welcome Back' : 'Join Us Today'}
                        </h1>

                        <form onSubmit={processForm} className="space-y-5">
                            {activeTab === 'register' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={updateField}
                                        required={activeTab === 'register'}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={updateField}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={updateField}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                            >
                                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;