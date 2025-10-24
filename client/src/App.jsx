import { useState } from 'react'
import Navbar from './Navbar'
import TodoList from './TodoList'
import Footer from './Footer'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <TodoList />
      <Footer />
    </>
  )
}

export default App
