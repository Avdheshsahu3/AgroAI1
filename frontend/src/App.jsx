import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { LanguageProvider } from './i18n'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SoilDataPage from './pages/SoilDataPage'
import CropRecommendationPage from './pages/CropRecommendationPage'
import Weather from './pages/Weather'
import MarketPrices from './pages/MarketPrices'
import DiseaseDetectionPage from './pages/DiseaseDetectionPage'
import Profile from './pages/Profile'
import SettingsPage from './pages/SettingsPage'
import SupportPage from './pages/SupportPage'
import ChatPage from './pages/ChatPage'
import FloatingAiChat from './components/FloatingAiChat'
import MobileBottomNav from './components/MobileBottomNav'

function RequireAuth({ farmer, children }) {
  if (!farmer) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { farmer, login, logout, isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <LanguageProvider>
        <Navbar farmer={farmer} onLogout={logout} />
        {isAuthenticated && <Sidebar farmer={farmer} />}
        <div className={`app-main-viewport ${isAuthenticated ? 'app-content-with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
            <Route path="/login" element={<Login onLogin={login} />} />
            <Route path="/register" element={<Register onLogin={login} />} />
            <Route path="/dashboard" element={<RequireAuth farmer={farmer}><Dashboard farmer={farmer} /></RequireAuth>} />
            <Route path="/chat" element={<RequireAuth farmer={farmer}><ChatPage farmer={farmer} /></RequireAuth>} />
            <Route path="/soil" element={<RequireAuth farmer={farmer}><SoilDataPage farmer={farmer} /></RequireAuth>} />
            <Route path="/recommendation" element={<RequireAuth farmer={farmer}><CropRecommendationPage farmer={farmer} /></RequireAuth>} />
            <Route path="/weather" element={<RequireAuth farmer={farmer}><Weather farmer={farmer} /></RequireAuth>} />
            <Route path="/market" element={<RequireAuth farmer={farmer}><MarketPrices farmer={farmer} /></RequireAuth>} />
            <Route path="/disease" element={<RequireAuth farmer={farmer}><DiseaseDetectionPage farmer={farmer} /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth farmer={farmer}><Profile farmer={farmer} /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth farmer={farmer}><SettingsPage farmer={farmer} /></RequireAuth>} />
            <Route path="/support" element={<RequireAuth farmer={farmer}><SupportPage farmer={farmer} /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {isAuthenticated && <FloatingAiChat farmer={farmer} />}
        {isAuthenticated && <MobileBottomNav farmer={farmer} />}
      </LanguageProvider>
    </BrowserRouter>
  )
}
