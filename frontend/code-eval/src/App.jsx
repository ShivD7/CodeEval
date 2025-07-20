import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Main from './components/Main'
import Home from './components/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router basename="/CodeEval">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pow1" element={<Main />} />
      </Routes>
    </Router>
  )
}

export default App
