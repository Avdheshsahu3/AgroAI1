import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Sparkles, MessageSquare, Sprout, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react'
import RecommendationAiChat, { AVAILABLE_CROPS } from '../components/RecommendationAiChat'
import { soilApi, weatherApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ChatPage({ farmer }) {
  const [soil, setSoil] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCrop, setSelectedCrop] = useState('Wheat')

  useEffect(() => {
    async function loadTelemetry() {
      try {
        const [soilData, weatherData] = await Promise.all([
          farmer?.id ? soilApi.latest(farmer.id).catch(() => null) : null,
          farmer?.location ? weatherApi.get(farmer.location, farmer.id).catch(() => null) : null
        ])
        setSoil(soilData)
        setWeather(weatherData)
      } finally {
        setLoading(false)
      }
    }
    loadTelemetry()
  }, [farmer])

  if (loading) {
    return <LoadingSpinner label="Connecting to AgroAI Agronomist & Telemetry..." />
  }

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      {/* Header Banner */}
      <div
        className="card-agro p-4 mb-4 text-white overflow-hidden position-relative shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.18)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,231,183,0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 position-relative" style={{ zIndex: 1 }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span
                className="badge px-2.5 py-1 text-uppercase fw-bold"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '0.05em',
                  fontSize: '0.72rem',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}
              >
                🌾 24/7 AGRO-INTELLIGENCE
              </span>
              <span
                className="badge px-2.5 py-1 fw-bold d-inline-flex align-items-center gap-1"
                style={{
                  background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
                  color: '#3730A3',
                  fontSize: '0.72rem'
                }}
              >
                <Sparkles size={11} /> Powered by Gemini AI
              </span>
            </div>
            <h2 className="fw-extrabold mb-1 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
              AI Agronomist Advisory Chat
            </h2>
            <p className="mb-0 text-white-50 small" style={{ maxWidth: 580, fontSize: '0.85rem' }}>
              Ask any farming-related question in English, Hindi, or Hinglish: fertilizer split doses, pest &amp; disease remedies, irrigation, organic compost, or government schemes.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div
              className="px-3 py-2 rounded-3 text-white text-center"
              style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <div className="small text-white-50" style={{ fontSize: '0.70rem' }}>SOIL STATUS</div>
              <div className="fw-bold" style={{ fontSize: '0.82rem' }}>
                {soil ? `N: ${soil.nitrogen} P: ${soil.phosphorus} K: ${soil.potassium}` : 'Default (Loam)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <RecommendationAiChat
        farmer={farmer}
        soil={soil}
        weather={weather}
        initialCrop={selectedCrop}
        defaultOpen={true}
      />
    </div>
  )
}
