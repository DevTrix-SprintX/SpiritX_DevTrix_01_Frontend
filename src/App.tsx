import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import { SignupForm } from './components/signup-form'
import Dashboard from './components/dashboard'


function App() {
  return (

    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
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