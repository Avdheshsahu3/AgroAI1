import React, { useState, useEffect } from 'react'
import { soilApi, weatherApi, recommendationApi } from '../services/api'
import ErrorMessage from '../components/ErrorMessage'
import CropRecommendationCard from '../components/CropRecommendationCard'
import RecommendationAiChat from '../components/RecommendationAiChat'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  Bot,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Layers,
  CloudSun,
  MapPin,
  RefreshCw,
  Sprout,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

// Popular previous crops for quick 1-click selection
const PREVIOUS_CROPS = [
  { name: 'Wheat', label: '🌾 Wheat', type: 'cereal', tip: 'Cereal crop - benefits from alternating with legumes' },
  { name: 'Rice', label: '🌾 Rice / Paddy', type: 'cereal', tip: 'High water crop - follow with lighter pulse or oilseed' },
  { name: 'Mustard', label: '🌼 Mustard', type: 'oilseed', tip: 'Deep taproot - breaks hardpan and conditions soil' },
  { name: 'Soybean', label: '🌱 Soybean', type: 'legume', tip: 'Legume - enriches soil with natural biological nitrogen' },
  { name: 'Chickpea', label: '🫘 Chickpea', type: 'legume', tip: 'Pulse - leaves 20-30 kg/ha residual nitrogen in root zone' },
  { name: 'Cotton', label: '🌸 Cotton', type: 'cash', tip: 'Deep nutrient feeder - follow with soil-rejuvenating crop' },
  { name: 'Maize', label: '🌽 Maize', type: 'cereal', tip: 'Heavy feeder - replenishing phosphorus and nitrogen is vital' },
  { name: 'Groundnut', label: '🥜 Groundnut', type: 'legume', tip: 'Nitrogen-fixing root nodules improve soil tilth' },
  { name: 'None / Fallow', label: '🚫 Fallow / First Sowing', type: 'none', tip: 'Rested soil with undisturbed microbial biodiversity' }
]

function getIndianCropSeason() {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 6 && month <= 10) {
    return { name: 'Kharif (Monsoon)', desc: 'Sown June–July, harvested Autumn', color: '#059669', bg: '#DCFCE7' }
  } else if (month >= 11 || month <= 3) {
    return { name: 'Rabi (Winter)', desc: 'Sown Oct–Dec, harvested Spring', color: '#7C3AED', bg: '#EDE9FE' }
  } else {
    return { name: 'Zaid (Summer)', desc: 'Sown March–April, harvested June', color: '#D97706', bg: '#FEF3C7' }
  }
}

export default function CropRecommendationPage({ farmer }) {
  const [form, setForm] = useState({ previousCrop: '' })
  const [soil, setSoil] = useState(null)
  const [weather, setWeather] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [activeTab, setActiveTab] = useState('recommend') // 'recommend' | 'chat'
  const [chatInitialCrop, setChatInitialCrop] = useState(null)

  const currentSeason = getIndianCropSeason()

  useEffect(() => {
    async function loadContext() {
      try {
        const [soilData, weatherData] = await Promise.all([
          soilApi.latest(farmer.id).catch(() => null),
          farmer.location ? weatherApi.get(farmer.location, farmer.id).catch(() => null) : null
        ])
        setSoil(soilData)
        setWeather(weatherData)
      } finally {
        setInitializing(false)
      }
    }
    loadContext()
  }, [farmer])

  // Allows instant demo load if farmer hasn't saved soil data yet
  function handleLoadDemoSoil() {
    setSoil({
      nitrogen: 135,
      phosphorus: 42,
      potassium: 175,
      ph: 6.8,
      moisture: 45,
      soilType: 'Alluvial Loam'
    })
    setError('')
  }

  async function handleGenerate() {
    if (!soil) {
      setError('Please add your soil data or tap "Load Demo Sample" to proceed.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const payload = {
        farmerId: farmer.id,
        nitrogen: soil.nitrogen,
        phosphorus: soil.phosphorus,
        potassium: soil.potassium,
        ph: soil.ph,
        moisture: soil.moisture,
        temperature: weather?.temperature || 26.0,
        humidity: weather?.humidity || 62.0,
        rainfall: weather?.rainfall || 120.0,
        previousCrop: form.previousCrop === 'None / Fallow' ? null : form.previousCrop || null,
        location: farmer.location || 'Maharashtra, India'
      }
      const result = await recommendationApi.recommend(payload)
      setRecommendation(result)
    } catch (err) {
      setError(err.message || 'Unable to generate recommendation.')
    } finally {
      setLoading(false)
    }
  }

  function handleSwitchToChat(cropName) {
    setChatInitialCrop(cropName || recommendation?.crop || 'Wheat')
    setActiveTab('chat')
  }

  if (initializing) return <LoadingSpinner label="Loading your farm diagnostics & climate telemetry..." />

  return (
    <div className="container py-4" style={{ maxWidth: 880 }}>
      {/* Hero Header Card */}
      <div
        className="card-agro p-4 mb-4 text-white overflow-hidden position-relative shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #134E35 0%, #1A5D3F 45%, #257850 100%)',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.15)'
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,243,208,0.2) 0%, transparent 70%)',
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
                🌾 AGRO-INTELLIGENCE CROP ENGINE
              </span>
              <span
                className="badge px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                style={{
                  background: 'rgba(52,211,153,0.22)',
                  color: '#6EE7B7',
                  fontSize: '0.72rem',
                  border: '1px solid rgba(52,211,153,0.35)'
                }}
              >
                <Zap size={11} /> Multi-Variable ML Model
              </span>
            </div>
            <h2 className="fw-extrabold mb-1 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
              Crop Recommendation & Advisory
            </h2>
            <p className="mb-0 text-white-50 small" style={{ maxWidth: 520, fontSize: '0.85rem' }}>
              Synthesizing soil nitrogen, phosphorus, potassium, pH, telemetry weather metrics, and historical crop rotation for optimal yield.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            className="p-1 rounded-pill d-inline-flex shadow-sm"
            style={{ background: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                activeTab === 'recommend'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-white border-0 opacity-80'
              }`}
              style={{ fontSize: '0.82rem' }}
              onClick={() => setActiveTab('recommend')}
            >
              <Sprout size={14} className={activeTab === 'recommend' ? 'text-success' : 'text-white'} />
              Crop Engine
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-dark shadow-sm'
                  : 'text-white border-0 opacity-80'
              }`}
              style={{ fontSize: '0.82rem' }}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={14} className={activeTab === 'chat' ? 'text-primary' : 'text-white'} />
              AI Chatbot
              <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.62rem', padding: '2px 5px' }}>
                AI
              </span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'recommend' ? (
        <>
          <ErrorMessage message={error} />

          {/* Bento Diagnostic Telemetry Cockpit */}
          <div className="row g-3 mb-4">
            {/* Card 1: Soil Telemetry */}
            <div className="col-12 col-md-4">
              <div
                className="card-agro p-3 h-100 shadow-sm"
                style={{
                  background: 'linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%)',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: 16
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: '#065F46', fontSize: '0.85rem' }}>
                    <Layers size={16} className="text-success" /> Soil Chemistry
                  </span>
                  <Link to="/soil" className="text-decoration-none small text-success fw-bold d-inline-flex align-items-center gap-0.5" style={{ fontSize: '0.72rem' }}>
                    Lab <ChevronRight size={11} />
                  </Link>
                </div>

                {soil ? (
                  <div>
                    <div className="d-flex gap-1.5 flex-wrap mb-2">
                      <span className="badge bg-white text-success border border-success-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
                        N: {soil.nitrogen} kg/ha
                      </span>
                      <span className="badge bg-white text-warning-emphasis border border-warning-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
                        P: {soil.phosphorus} kg/ha
                      </span>
                      <span className="badge bg-white text-purple border border-purple-subtle fw-semibold" style={{ fontSize: '0.7rem', color: '#7C3AED' }}>
                        K: {soil.potassium} kg/ha
                      </span>
                      <span className="badge bg-white text-info-emphasis border border-info-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
                        pH: {soil.ph}
                      </span>
                      <span className="badge bg-white text-primary border border-primary-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
                        💧 {soil.moisture}%
                      </span>
                    </div>
                    <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                      Type: <strong>{soil.soilType || 'Recorded Soil Profile'}</strong>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-muted small mb-2" style={{ fontSize: '0.78rem' }}>
                      No soil records found for your farm profile.
                    </p>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-light border border-success text-success fw-bold py-1 px-2.5"
                        style={{ fontSize: '0.75rem' }}
                        onClick={handleLoadDemoSoil}
                      >
                        🧪 Load Demo Sample
                      </button>
                      <Link
                        to="/soil"
                        className="btn btn-sm btn-agro py-1 px-2.5 text-white"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Enter Soil
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Weather & Atmospheric */}
            <div className="col-12 col-md-4">
              <div
                className="card-agro p-3 h-100 shadow-sm"
                style={{
                  background: 'linear-gradient(145deg, #EFF6FF 0%, #DBEAFE 100%)',
                  border: '1.5px solid #BAE6FD',
                  borderRadius: 16
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: '#1E40AF', fontSize: '0.85rem' }}>
                    <CloudSun size={16} className="text-primary" /> Live Meteorology
                  </span>
                  <Link to="/weather" className="text-decoration-none small text-primary fw-bold d-inline-flex align-items-center gap-0.5" style={{ fontSize: '0.72rem' }}>
                    Forecast <ChevronRight size={11} />
                  </Link>
                </div>

                {weather ? (
                  <div>
                    <div className="d-flex align-items-baseline gap-2 mb-1">
                      <span className="fw-extrabold" style={{ fontSize: '1.4rem', color: '#1E3A8A' }}>
                        {Math.round(weather.temperature)}°C
                      </span>
                      <span className="badge bg-white text-primary border border-primary-subtle fw-semibold" style={{ fontSize: '0.72rem' }}>
                        {weather.condition || 'Clear Sky'}
                      </span>
                    </div>
                    <div className="d-flex gap-2 text-muted small" style={{ fontSize: '0.75rem' }}>
                      <span>💧 {Math.round(weather.humidity)}% Humidity</span>
                      <span>•</span>
                      <span>🌧️ {Math.round(weather.rainfall)} mm Rain</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-muted small mb-1" style={{ fontSize: '0.78rem' }}>Default Regional Baseline</div>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>26°C • Moderate Monsoon</div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Season & Agro-Zone */}
            <div className="col-12 col-md-4">
              <div
                className="card-agro p-3 h-100 shadow-sm"
                style={{
                  background: 'linear-gradient(145deg, #FAF5FF 0%, #EDE9FE 100%)',
                  border: '1.5px solid #DDD6FE',
                  borderRadius: 16
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: '#5B21B6', fontSize: '0.85rem' }}>
                    <Calendar size={16} style={{ color: '#7C3AED' }} /> Agro-Season
                  </span>
                  <span
                    className="badge fw-bold"
                    style={{ background: currentSeason.bg, color: currentSeason.color, fontSize: '0.7rem' }}
                  >
                    Active
                  </span>
                </div>

                <div>
                  <div className="fw-bold mb-0.5" style={{ fontSize: '0.95rem', color: '#4C1D95' }}>
                    {currentSeason.name}
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.73rem' }}>
                    {currentSeason.desc}
                  </div>
                  <div className="d-flex align-items-center gap-1 mt-1 text-muted small" style={{ fontSize: '0.72rem' }}>
                    <MapPin size={11} className="text-danger" />
                    <span>{farmer.location || 'India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Crop Rotation & Action Card */}
          <div
            className="card-agro p-4 mb-4 shadow-sm"
            style={{
              borderRadius: 20,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#0F172A', fontSize: '1.05rem' }}>
                  <Sprout size={18} className="text-success" /> Field Crop Rotation History
                </h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
                  Select what was grown in this plot previously to let the AI calculate biological nitrogen balance & pest cycle breaks.
                </p>
              </div>
              <span className="badge bg-light text-muted border px-2.5 py-1.5" style={{ fontSize: '0.75rem' }}>
                Optional Factor
              </span>
            </div>

            {/* Quick 1-Click Rotation Chips */}
            <div className="d-flex gap-2 flex-wrap my-3">
              {PREVIOUS_CROPS.map((crop) => {
                const isSelected = form.previousCrop === crop.name
                return (
                  <button
                    key={crop.name}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all d-inline-flex align-items-center gap-1 ${
                      isSelected
                        ? 'btn-agro text-white shadow-sm'
                        : 'btn-light border text-dark'
                    }`}
                    style={{
                      fontSize: '0.8rem',
                      borderColor: isSelected ? 'var(--agro-primary)' : '#E2E8F0'
                    }}
                    onClick={() => setForm({ previousCrop: isSelected ? '' : crop.name })}
                  >
                    {crop.label}
                  </button>
                )
              })}
            </div>

            {/* Or custom input field */}
            <div className="row g-2 align-items-center mb-3">
              <div className="col-12 col-md-7">
                <input
                  className="form-control form-control-lg-touch"
                  placeholder="Or type custom previous crop (e.g. Mustard, Millet, Sugarcane)..."
                  value={form.previousCrop}
                  onChange={(e) => setForm({ previousCrop: e.target.value })}
                  style={{ fontSize: '0.88rem' }}
                />
              </div>
              {form.previousCrop && (
                <div className="col-12 col-md-5">
                  <div className="p-2 px-3 rounded-3 bg-light border text-muted small d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                    <Info size={14} className="text-primary flex-shrink-0" />
                    <span>
                      {PREVIOUS_CROPS.find((c) => c.name === form.previousCrop)?.tip ||
                        `AI model will calibrate soil depletion after ${form.previousCrop}.`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Run Recommendation CTA Button */}
            <button
              className="btn btn-agro w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
              style={{
                borderRadius: 14,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 6px 18px rgba(5,150,105,0.28)'
              }}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spinner-border spinner-border-sm" />
                  <span>Analyzing Soil Chemistry & Meteorology...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate AI Crop Recommendation</span>
                </>
              )}
            </button>
          </div>

          {/* Recommendation Result Card */}
          <CropRecommendationCard
            recommendation={recommendation}
            soil={soil}
            weather={weather}
            farmer={farmer}
            previousCrop={form.previousCrop}
            onChatWithAi={handleSwitchToChat}
          />

          {/* Quick Chat Callout when recommendation is active */}
          {recommendation && (
            <motion.div
              className="card-agro mb-4 p-3.5 d-flex align-items-center justify-content-between flex-wrap gap-3 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)',
                border: '1.5px solid #86EFAC',
                borderRadius: 18
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    boxShadow: '0 4px 10px rgba(5,150,105,0.18)'
                  }}
                >
                  <Bot size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0.5 text-dark" style={{ fontSize: '0.92rem' }}>
                    Have questions about planting {recommendation.crop}?
                  </h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
                    Ask our AI Agronomist for exact fertilizer split-dosages, irrigation schedules, or pest sprays.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-agro btn-sm px-3.5 py-2 d-inline-flex align-items-center gap-1.5 fw-bold"
                style={{
                  background: '#059669',
                  borderRadius: 10,
                  fontSize: '0.85rem'
                }}
                onClick={() => handleSwitchToChat(recommendation.crop)}
              >
                <MessageSquare size={15} /> Open AI Agronomist Chat
              </button>
            </motion.div>
          )}
        </>
      ) : (
        <>
          <div className="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-light btn-sm px-3 py-1.5 rounded-pill border text-muted fw-semibold d-inline-flex align-items-center gap-1.5"
              onClick={() => setActiveTab('recommend')}
            >
              <ArrowLeft size={14} /> Back to Recommendation Engine
            </button>
            {recommendation && (
              <span className="badge bg-white text-dark border px-3 py-1.5 rounded-pill small">
                Consulting regarding: <strong>{recommendation.crop}</strong>
              </span>
            )}
          </div>
          <RecommendationAiChat
            farmer={farmer}
            soil={soil}
            weather={weather}
            recommendation={recommendation}
            initialCrop={chatInitialCrop || recommendation?.crop || 'Wheat'}
          />
        </>
      )}
    </div>
  )
}
