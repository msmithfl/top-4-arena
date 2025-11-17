import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import GameScreen from './components/GameScreen'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  )
}

export default App