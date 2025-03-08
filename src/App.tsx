import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm } from './components/login-form'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { SignupForm } from './components/signup-form'


function App() {
  return (

    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={
        <div>
        <h1>Welcome to Home Page</h1>
        </div>
      } />
      </Routes>
    </BrowserRouter>

  )
}

export default App