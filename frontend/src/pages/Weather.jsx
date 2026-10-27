import React, { useState, useEffect, useCallback } from 'react'
import { weatherApi } from '../services/api'
import LocationSelector from '../components/LocationSelector'
import WeatherCard from '../components/WeatherCard'
import WeatherForecast from '../components/WeatherForecast'
import WeatherGraph from '../components/WeatherGraph'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import {
  CloudSun,
  MapPin,
  RefreshCw,
  TrendingUp,
  Droplets,
  Wind,
  Sun,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Tractor,
  Layers
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Popular Indian agricultural districts for quick 1-click selection
const QUICK_DISTRICTS = [
  'Pune, Maharashtra',
  'Ludhiana, Punjab',
  'Indore, Madhya Pradesh',
  'Nagpur, Maharashtra',
  'Nashik, Maharashtra',
  'Jaipur, Rajasthan'
]

export default function Weather({ farmer }) {
  const [location, setLocation] = useState(farmer?.location || 'Pune, Maharashtra')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(
    async (loc) => {
      setLoading(true)
      setError('')
      try {
        const data = await weatherApi.get(loc, farmer?.id)
        setWeather(data)
        setLocation(loc)
      } catch (err) {
        setError(err.message || 'Unable to fetch weather data.')
      } finally {
        setLoading(false)
      }
    },
    [farmer?.id]
  )

  useEffect(() => {
    if (location) load(location)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Agronomic recommendations based on current weather
  const rainTotal = weather?.rainfall || 0
  const windSpd = weather?.windSpeed || 10
  const tempCurr = weather?.temperature || 26

  return (
    <div className="container py-4" style={{ maxWidth: 1080 }}>
      {/* Hero Header Banner */}
      <div
        className="card-agro p-4 mb-4 text-white overflow-hidden position-relative shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #0369A1 0%, #0284C7 45%, #0F766E 100%)',
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.18)'
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -30,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 position-relative" style={{ zIndex: 1 }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span
                className="badge px-2.5 py-1 text-uppercase fw-bold"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  letterSpacing: '0.05em',
                  fontSize: '0.72rem',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                🌦️ AGRO-METEOROLOGICAL RADAR & TELEMETRY
              </span>
              <span
                className="badge px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                style={{
                  background: 'rgba(56,189,248,0.25)',
                  color: '#BAE6FD',
                  fontSize: '0.72rem',
                  border: '1px solid rgba(56,189,248,0.35)'
                }}
              >
                <Zap size={11} /> High-Resolution Open-Meteo Feed
              </span>
            </div>
            <h2 className="fw-extrabold mb-1 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
              Agricultural Weather & Climate Intelligence
            </h2>
            <p className="mb-0 text-white-50 small" style={{ maxWidth: 560, fontSize: '0.85rem' }}>
              Real-time atmospheric telemetry, 7-day micro-climate temperature curves, rainfall projection charts, and spray advisories.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light border px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-sm rounded-pill"
              style={{ fontSize: '0.82rem' }}
              onClick={() => load(location)}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'spinner-border spinner-border-sm' : 'text-primary'} />
              {loading ? 'Refreshing...' : 'Refresh Telemetry'}
            </button>
          </div>
        </div>
      </div>

      {/* Location Search Bar & Quick District Pills */}
      <div
        className="card-agro p-3 mb-4 shadow-sm"
        style={{ borderRadius: 18, border: '1.5px solid #E2E8F0', background: '#FFFFFF' }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
          <span className="fw-bold small text-muted text-uppercase d-flex align-items-center gap-1.5" style={{ fontSize: '0.76rem' }}>
            <MapPin size={14} className="text-danger" /> Monitored Farm Location
          </span>
          <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
            Enter any Indian district or tehsil
          </span>
        </div>

        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <LocationSelector value={location} loading={loading} onSubmit={load} />
          </div>
          <div className="col-12 col-md-7">
            <div className="d-flex gap-1.5 flex-wrap align-items-center justify-content-start justify-content-md-end">
              <span className="text-muted small me-1 d-none d-lg-inline" style={{ fontSize: '0.72rem' }}>Quick Hubs:</span>
              {QUICK_DISTRICTS.map((district) => {
                const isCurrent = location.toLowerCase().includes(district.split(',')[0].toLowerCase())
                return (
                  <button
                    key={district}
                    type="button"
                    className={`btn btn-sm rounded-pill px-2.5 py-1 transition-all ${
                      isCurrent
                        ? 'btn-primary text-white shadow-xs fw-bold'
                        : 'btn-light border text-muted small'
                    }`}
                    style={{ fontSize: '0.74rem' }}
                    onClick={() => load(district)}
                    disabled={loading}
                  >
                    {district.split(',')[0]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} onRetry={() => location && load(location)} />

      {loading && !weather && <LoadingSpinner label="Fetching atmospheric radar telemetry..." />}

      {weather && (
        <>
          {/* Middle Row: Current Weather Cockpit & 7-Day Quick Strip */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-5">
              <WeatherCard weather={weather} />
            </div>
            <div className="col-12 col-lg-7">
              <WeatherForecast forecast={weather.forecast} />
            </div>
          </div>

          {/* THE STAR FEATURE: User's Requested Colorful Weather Graph */}
          <WeatherGraph forecast={weather.forecast} weather={weather} />

          {/* Agricultural Field Advisory Planner (3 Actionable Bento Tiles) */}
          <div className="card-agro p-4 shadow-sm" style={{ borderRadius: 20, border: '1.5px solid #E2E8F0', background: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-0.5 d-flex align-items-center gap-2" style={{ color: '#0F172A', fontSize: '1.1rem' }}>
                  <Tractor size={20} className="text-success" /> Proactive Agronomic Advisory Planner
                </h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
                  Actionable farm decisions synthesized from 7-day temperature swings, precipitation forecast, and wind velocities.
                </p>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold px-2.5 py-1" style={{ fontSize: '0.74rem' }}>
                Rule-Based Agronomy Engine
              </span>
            </div>

            <div className="row g-3">
              {/* Tile 1: Chemical & Biological Spray Window */}
              <div className="col-12 col-md-4">
                <div
                  className="p-3 rounded-3 h-100"
                  style={{
                    background: windSpd <= 15 && rainTotal === 0 ? '#F0FDF4' : '#FFFBEB',
                    border: `1.5px solid ${windSpd <= 15 && rainTotal === 0 ? '#BBF7D0' : '#FDE68A'}`
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: windSpd <= 15 ? '#166534' : '#92400E', fontSize: '0.85rem' }}>
                      <Wind size={16} /> Spraying Suitability
                    </span>
                    <span
                      className="badge fw-bold"
                      style={{
                        background: windSpd <= 15 && rainTotal === 0 ? '#DCFCE7' : '#FEF3C7',
                        color: windSpd <= 15 && rainTotal === 0 ? '#15803D' : '#B45309',
                        fontSize: '0.68rem'
                      }}
                    >
                      {windSpd <= 15 && rainTotal === 0 ? 'Favorable Window' : 'Caution / Delay'}
                    </span>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
                    {windSpd <= 15 && rainTotal === 0
                      ? `Calm wind velocity (${Math.round(windSpd)} km/h) minimizes droplet drift. Optimal for early morning fungicide or foliar micronutrient spraying.`
                      : rainTotal > 0
                      ? 'Impending or active rain will wash away foliar applications. Postpone chemical spraying until leaves remain dry for at least 4 hours.'
                      : `Wind speeds reach ${Math.round(windSpd)} km/h. High risk of chemical drift onto adjacent non-target crops.`}
                  </p>
                </div>
              </div>

              {/* Tile 2: Irrigation Scheduling */}
              <div className="col-12 col-md-4">
                <div
                  className="p-3 rounded-3 h-100"
                  style={{
                    background: rainTotal > 5 ? '#EFF6FF' : tempCurr > 30 ? '#FFF7ED' : '#F8FAFC',
                    border: `1.5px solid ${rainTotal > 5 ? '#BAE6FD' : tempCurr > 30 ? '#FED7AA' : '#E2E8F0'}`
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: rainTotal > 5 ? '#0369A1' : '#9A3412', fontSize: '0.85rem' }}>
                      <Droplets size={16} /> Irrigation Schedule
                    </span>
                    <span
                      className="badge fw-bold"
                      style={{
                        background: rainTotal > 5 ? '#DBEAFE' : '#FFEDD5',
                        color: rainTotal > 5 ? '#1E40AF' : '#C2410C',
                        fontSize: '0.68rem'
                      }}
                    >
                      {rainTotal > 5 ? 'Rain Offset Available' : tempCurr > 30 ? 'High Evaporation' : 'Normal Schedule'}
                    </span>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
                    {rainTotal > 5
                      ? `Forecast predicts ${rainTotal} mm rainfall. You can save water and electricity by pausing drip irrigation for the next 24–48 hours.`
                      : tempCurr > 32
                      ? `Thermal peak of ${Math.round(tempCurr)}°C accelerates soil moisture evaporation. Run drip irrigation in early dawn or late evening.`
                      : 'Maintain regular baseline soil moisture. Monitor tensiometer readings or soil page moisture indicators.'}
                  </p>
                </div>
              </div>

              {/* Tile 3: Field Machinery & Harvest Workability */}
              <div className="col-12 col-md-4">
                <div
                  className="p-3 rounded-3 h-100"
                  style={{
                    background: rainTotal > 15 ? '#FEF2F2' : '#F0FDF4',
                    border: `1.5px solid ${rainTotal > 15 ? '#FECACA' : '#BBF7D0'}`
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: rainTotal > 15 ? '#991B1B' : '#166534', fontSize: '0.85rem' }}>
                      <Layers size={16} /> Field Workability
                    </span>
                    <span
                      className="badge fw-bold"
                      style={{
                        background: rainTotal > 15 ? '#FEE2E2' : '#DCFCE7',
                        color: rainTotal > 15 ? '#B91C1C' : '#15803D',
                        fontSize: '0.68rem'
                      }}
                    >
                      {rainTotal > 15 ? 'Muddy / Restrict' : 'Machinery Accessible'}
                    </span>
                  </div>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.78rem', lineHeight: 1.45 }}>
                    {rainTotal > 15
                      ? 'Heavy moisture will create muddy soil compaction. Avoid heavy tractor or combine harvester movement to protect soil structure.'
                      : 'Soil tilth and field firmness remain good. Excellent conditions for weeding, tilling, inter-cultivation, and harvesting.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
