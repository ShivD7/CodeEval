import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProblemPage from './components/ProblemPage'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubmissionPage from './components/SubmissionPage'
import Context from "./components/Context.jsx"
import SettingPage from './components/SettingPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import SignupPage from './components/SignupPage.jsx'
function App() {
  const userInfo = {
    submissions: [],
    password: ""
  }

  return (
    <Context.Provider value = {userInfo}>
      <Router basename="/CodeEval">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pow1" element={<ProblemPage
                                        title = "Two Sum"
                                        description = "HI"/>} />
          <Route path="/pow2" element={<ProblemPage
                                        title = "Three Sum"
                                        description = "Bye"/>} />
          <Route path="/pow3" element={<ProblemPage
                                        title = "5 Sum"
                                        description = "Hola"/>} />
          <Route path="/pow4" element={<ProblemPage
                                        title = "6 Sum"
                                        description = "Hola"/>} />
          <Route path="/contest1" element={<ProblemPage
                                        title = "7 Sum"
                                        description = "Hola"/>} />
          <Route path="/contest2" element={<ProblemPage
                                        title = "8 Sum"
                                        description = "Hola"/>} /> 
          <Route path="/contest3" element={<ProblemPage
                                        title = "9 Sum"
                                        description = "Hola"/>} />      
          <Route path="/contest4" element={<ProblemPage
                                        title = "10 Sum"
                                        description = "Hola"/>} />      
          <Route path="/contest5" element={<ProblemPage
                                        title = "11 Sum"
                                        description = "Hola"/>} />
          <Route path="/submissions" element={<SubmissionPage/>} />
          <Route path="/settings" element={<SettingPage/>} /> 
          <Route path="/signup" element={<SignupPage/>} />                                                                                                                                                                                        
        </Routes>
      </Router>
    </Context.Provider>
  )
}

export default App
