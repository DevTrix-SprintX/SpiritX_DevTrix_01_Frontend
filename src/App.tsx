import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import { SignupForm } from './components/signup-form'
import Dashboard from './components/dashboard'
import Page404 from './components/404'
import HomePage from './components/home'


function App() {
  return (

    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={ <HomePage/> } />
      <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App