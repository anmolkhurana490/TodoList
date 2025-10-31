import React, { useState } from 'react'
import { IoMenu, IoClose, IoNotifications } from 'react-icons/io5'

const Navbar = ({ user, logoutUser }) => {
    const [open, setOpen] = useState(false)

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm">
            <nav className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Mobile Menu Button & Brand */}
                    <div className="flex items-center space-x-4">
                        {/* Brand Logo for mobile view */}
                        <div className="flex items-center space-x-3 md:hidden">
                            <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-lg">
                                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                                    TL
                                </div>
                            </div>
                            <div>
                                <h1 className="text-base font-semibold text-gray-800">Todo List</h1>
                            </div>
                        </div>

                        {/* Brand Logo for desktop */}
                        <h1 className="hidden md:block text-xl font-semibold text-slate-800">
                            Beautiful Todo List
                        </h1>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {user && (
                            <button className="relative text-2xl p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
                                <IoNotifications />
                            </button>
                        )}

                        {user && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={logoutUser}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition-colors"
                                >
                                    Logout
                                </button>
                                <button className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </button>
                            </div>
                        )}

                        {!user && (
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow transition-colors">
                                Get Started
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            aria-expanded={open}
                            aria-label="Toggle menu"
                            className="p-2 rounded-md inline-flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                            {open ? (
                                <IoClose className="w-6 h-6" />
                            ) : (
                                <IoMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="pb-4 space-y-3">
                        {user ? (
                            <>
                                <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            Hello, {user.name}
                                        </span>
                                    </div>
                                    <button className="text-gray-600 hover:text-gray-800 p-2">
                                        <IoNotifications className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={logoutUser}
                                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
