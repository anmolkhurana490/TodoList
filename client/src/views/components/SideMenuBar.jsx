import React, { useEffect, useState } from 'react'
import {
    FiChevronDown,
    FiChevronUp,
} from 'react-icons/fi'

import useOverviewViewModel from '../../viewmodels/OverviewViewModel'

const SideMenuBar = ({ isAuthenticated }) => {
    if (isAuthenticated) return (<OverviewContainer />);
    return AuthSideContainer();
};

// Shared content component for both desktop and mobile
const OverviewContainer = () => {
    const [overviewOpen, setOverviewOpen] = useState(true)
    const [teamOpen, setTeamOpen] = useState(false)
    const [todosOpen, setTodosOpen] = useState(false)

    const { teamMembers, pendingTasks } = useOverviewViewModel();

    return (
        <div className="bg-white border-r border-gray-200 shrink-0">
            <div className={`flex flex-col bg-white border-r border-gray-200`}>
                <div className={`flex flex-col`}>
                    {/* Brand - Only show on desktop */}
                    <div className="flex items-center space-x-3 p-6 border-b border-gray-100 max-md:hidden">
                        <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-lg">
                            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                                TL
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-800">Todo List</h1>
                            <p className="text-xs text-gray-500">Stay organized</p>
                        </div>
                    </div>

                    {/* Main Navigation */}
                    <div className={`p-4 space-y-4`}>

                        <div className="space-y-6">
                            {/* Overview Section */}
                            <div className="">
                                <button
                                    onClick={() => setOverviewOpen(!overviewOpen)}
                                    className="w-full flex items-center justify-between text-left text-lg font-semibold text-gray-900 uppercase tracking-wide hover:text-indigo-600 transition-colors"
                                >
                                    <span>Overview</span>
                                    {overviewOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {overviewOpen && (<>
                            {/* Team Section */}
                            <div className="ml-2">
                                <button
                                    onClick={() => setTeamOpen(!teamOpen)}
                                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-gray-900 uppercase tracking-wide hover:text-indigo-600 transition-colors"
                                >
                                    <span>Team</span>
                                    {teamOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                </button>

                                <div className={`
                        overflow-hidden transition-all duration-300 ease-in-out
                        ${teamOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                    `}>
                                    <nav className="">
                                        {teamMembers?.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={`group flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-lg transition-colors duration-150 hover:bg-gray-50 cursor-pointer`}
                                                >
                                                    <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></div>
                                                    <span>{item.name}</span>
                                                </div>
                                            )
                                        })}
                                    </nav>
                                </div>
                            </div>

                            {/* Todos Section */}
                            <div className="ml-2">
                                <button
                                    onClick={() => setTodosOpen(!todosOpen)}
                                    className="w-full flex items-center justify-between text-left text-sm font-semibold text-gray-900 uppercase tracking-wide hover:text-indigo-600 transition-colors"
                                >
                                    <span>Todos</span>
                                    {todosOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                </button>

                                <div className={`
                                    overflow-hidden transition-all duration-300 ease-in-out
                                    ${todosOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
                                    `}>
                                    <div className="">
                                        {pendingTasks?.map((todo) => (
                                            <div
                                                key={todo.id}
                                                className="flex items-center justify-between px-3 py-2 mt-1 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                            >
                                                <div className="flex items-center">
                                                    <span>{todo.title}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

const AuthSideContainer = () => {
    return (
        <div className="flex flex-col bg-linear-to-br from-indigo-50 via-white to-purple-50 border-r border-gray-200 h-full relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-linear-to-r from-indigo-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute top-1/2 -right-20 w-60 h-60 bg-linear-to-r from-pink-400 to-indigo-400 rounded-full opacity-10 animate-bounce"></div>
                <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-linear-to-r from-purple-400 to-pink-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>

            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full text-center px-6 relative z-10">
                {/* Logo/Icon */}
                <div className="mb-8 transform animate-bounce">
                    <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                        <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold text-2xl">
                            TL
                        </div>
                    </div>
                </div>

                {/* Welcome message */}
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome to Todo List
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-xs">
                        Sign in to access your personalized dashboard and manage your tasks efficiently
                    </p>
                </div>

                {/* Feature highlights */}
                <div className="mt-8 space-y-3 animate-slide-up">
                    <div className="flex items-center space-x-3 text-gray-700">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Organize your tasks</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-300"></div>
                        <span className="text-sm">Collaborate with your team</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-500"></div>
                        <span className="text-sm">Track your progress</span>
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-8 animate-fade-in-delay">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
                        <p className="text-sm text-gray-600 mb-2">Ready to get started?</p>
                        <div className="h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-delay {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out 0.3s both;
                }
                .animate-fade-in-delay {
                    animation: fade-in-delay 0.8s ease-out 0.6s both;
                }
            `}</style>
        </div>
    )
}

export default SideMenuBar