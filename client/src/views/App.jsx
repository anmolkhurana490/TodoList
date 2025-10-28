import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TodoList from './components/TodoList'
import Auth from './Auth'
import useUserViewModel from '../viewmodels/UserViewModels'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  const { user, loading, registerUser, loginUser, logoutUser } = useUserViewModel();

  return (
    <>
      <Navbar user={user} logoutUser={logoutUser} />

      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/todos" element={<TodoList user={user} />} />
        <Route path="/auth" element={<Auth registerUser={registerUser} loginUser={loginUser} />} />
      </Routes>

      {loading && (
        <div className="loading-overlay fixed inset-0 bg-blue-700/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 relative">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default App
