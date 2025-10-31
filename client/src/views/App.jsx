import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SideMenuBar from './components/SideMenuBar'
import TodoList from './TodoList'
import Auth from './Auth'
import useUserViewModel from '../viewmodels/UserViewModels'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  const { user, loading, registerUser, loginUser, logoutUser, OAuthLoginUser } = useUserViewModel();

  return (
    <div className="App h-screen overflow-hidden">

      {/* Main layout container */}
      <div className="flex h-full">

        {/* Sidebar */}
        <div className={`${user ? 'w-64 max-lg:w-1/4' : 'md:w-1/3 lg:w-1/2'} max-md:hidden`}>
          <SideMenuBar isAuthenticated={user !== null} />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-auto">
          {/* Navbar */}
          <div className="shrink-0">
            <Navbar
              user={user}
              logoutUser={logoutUser}
            />
          </div>

          {user && (<div className="w-full bg-white border-r border-gray-200 shrink-0 md:hidden">
            <SideMenuBar isAuthenticated={user !== null} />
          </div>)}

          {/* Content area */}
          <div className="flex-1 bg-linear-to-br from-blue-100 to-indigo-50">
            <Routes>
              <Route path="/" element={<></>} />

              <Route path="/todos" element={
                <TodoList user={user} />
              } />

              <Route path="/auth" element={
                <Auth registerUser={registerUser}
                  loginUser={loginUser}
                  OAuthLoginUser={OAuthLoginUser} />
              } />
            </Routes>
          </div>

          {/* Footer */}
          <div className="shrink-0">
            <Footer />
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {
        loading && (
          <div className="loading-overlay fixed inset-0 bg-blue-700/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4 relative">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default App
