import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PokemonDetailPage from './pages/PokemonDetailPage'
import CreateTeamPage from './pages/CreateTeamPage'
import MyTeamsPage from './pages/MyTeamsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="/criar-time" element={<CreateTeamPage />} />
        <Route path="/meus-times" element={<MyTeamsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
