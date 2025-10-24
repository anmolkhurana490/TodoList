import React, { useState } from 'react'
import { IoMenu, IoClose } from 'react-icons/io5'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const links = ['Home', 'About', 'Contact']

    return (
        <header className="w-full sticky top-0 z-50">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-full">
                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                TL
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-800">My Todo List</h1>
                            <p className="text-xs text-gray-500">stay organized, ship faster</p>
                        </div>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <ul className="flex items-center space-x-6">
                            {links.map((link) => (
                                <li key={link}>
                                    <button
                                        className="text-gray-600 hover:text-indigo-600 transition-colors duration-150"
                                        onClick={() => setOpen(false)}
                                    >
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="ml-4">
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen(!open)}
                            aria-expanded={open}
                            aria-label="Toggle menu"
                            className={`p-2 rounded-md inline-flex items-center justify-center text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform duration-200 ${open ? 'transform rotate-90' : ''}`}
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
                    className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-64' : 'max-h-0'
                        }`}
                >
                    <div className="bg-white shadow rounded-b-md">
                        <ul className="flex flex-col divide-y">
                            {links.map((link) => (
                                <li key={link}>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
                                    >
                                        {link}
                                    </button>
                                </li>
                            ))}
                            <li className="px-4 py-4">
                                <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                                    Get Started
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
