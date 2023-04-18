import './App.css'
import LandingPage from './pages/index'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import React from 'react'

function App () {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/marvel" element={<LandingPage />} />
        <Route path="/" element={<Navigate replace to="/marvel" />} />
        <Route path="*" element={<Navigate replace to="/marvel" />} />
      </Routes>
    </Router>
  )
}

export default App
