import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import LocationSelector from '../components/LocationSelector'
import { MapPin, Sun, Sprout, Bot, CloudSun, LineChart, ScanEye, Sparkles, Droplets, MessageSquare } from 'lucide-react'
import DashboardStats from '../components/DashboardStats'
import WeatherForecast from '../components/WeatherForecast'
import SoilHealthCard from '../components/SoilHealthCard'
import CropRecommendationCard from '../components/CropRecommendationCard'
import MarketPriceTable from '../components/MarketPriceTable'

export default function Dashboard({ farmer }) {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [location, setLocation] = useState(farmer?.location || '')

  const load = useCallback(async (loc) => {
    setLoading(true)
    setError('')
    try {
      const result = await dashboardApi.get(farmer.id, loc)
      setData(result)
      if (result.weather) setLocation(result.weather.location)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [farmer])

  useEffect(() => { load(location) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />

  return (
    <main className="dashboard-main">
      {/* Hero Banner with Farm Image & Colorful Status Badges */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <div className="dashboard-eyebrow d-flex align-items-center gap-2">
            <span className="badge rounded-pill bg-success text-white shadow-xs px-2 py-1" style={{ fontSize: '0.74rem' }}>
              <Sun size={13} className="me-1" /> Live Farm View
            </span>
            <span className="text-secondary small fw-bold">Good morning</span>
          </div>

          <h1 className="fw-bolder">
            {farmer.name} <span aria-hidden="true">{String.fromCodePoint(0x1F44B)}</span>
          </h1>

          <div className="dashboard-location mb-3">
            <MapPin size={16} className="text-danger" /> Farm Location: <strong>{location || 'Not set'}</strong>
          </div>

          {/* Quick Colorful Status Badges */}
          {data?.weather && (
            <div className="d-flex flex-wrap gap-2 mt-2">
              <span
                className="badge rounded-pill d-inline-flex align-items-center gap-1 shadow-xs border"
                style={{ background: '#FFFBEB', color: '#B45309', borderColor: '#FDE68A', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                <Sun size={13} className="text-warning" />
                <span>{Math.round(data.weather.temperature)}°C • {data.weather.condition}</span>
              </span>

              {data.recommendation?.crop && (
                <span
                  className="badge rounded-pill d-inline-flex align-items-center gap-1 shadow-xs border"
                  style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  <Sprout size={13} className="text-success" />
                  <span>Top Crop: <strong>{data.recommendation.crop}</strong></span>
                </span>
              )}

              {data.soil?.ph && (
                <span
                  className="badge rounded-pill d-inline-flex align-items-center gap-1 shadow-xs border"
                  style={{ background: '#EFF6FF', color: '#1E40AF', borderColor: '#BFDBFE', fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                >
                  <Sparkles size={13} className="text-primary" />
                  <span>Soil pH: {data.soil.ph}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="dashboard-location-control">
          <LocationSelector value={location} loading={loading} onSubmit={(loc) => load(loc)} />
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <ErrorMessage message={error} onRetry={() => load(location)} />
        {!data?.weather && !error && (
          <div className="alert alert-info">Enter your farm location above to load weather, soil health and a crop recommendation.</div>
        )}

        {data?.weather && (
          <>
            {/* Quick Farm Nav Actions (6 Balanced Core Modules) */}
            <div className="row g-2 mb-4">
              {[
                { label: 'Soil Health', icon: Sprout, path: '/soil', color: '#10B981', bg: '#ECFDF5', desc: 'NPK & sensor sync' },
                { label: 'AI Crop Advice', icon: Bot, path: '/recommendation', color: '#7C3AED', bg: '#FAF5FF', desc: 'Agronomic model' },
                { label: 'AI Agronomist', icon: MessageSquare, path: '/chat', color: '#2563EB', bg: '#EFF6FF', desc: 'Gemini farm copilot' },
                { label: 'Weather Radar', icon: CloudSun, path: '/weather', color: '#0284C7', bg: '#F0F9FF', desc: '7-day satellite outlook' },
                { label: 'Mandi Rates', icon: LineChart, path: '/market', color: '#16A34A', bg: '#F0FDF4', desc: 'Daily APMC trends' },
                { label: 'Crop Doctor', icon: ScanEye, path: '/disease', color: '#DC2626', bg: '#FEF2F2', desc: 'Leaf disease scanner' }
              ].map((act) => {
                const Icon = act.icon
                return (
                  <div className="col-6 col-md-4 col-xl-2" key={act.path}>
                    <button
                      type="button"
                      onClick={() => navigate(act.path)}
                      className="card-agro shadow-xs p-2 px-2.5 border w-100 text-start d-flex align-items-center gap-2 hoverable"
                      style={{
                        background: '#FFFFFF',
                        borderColor: '#E2E8F0',
                        borderRadius: '0.95rem',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-2"
                        style={{ width: 34, height: 34, background: act.bg, color: act.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.82rem' }}>{act.label}</div>
                        <div className="text-muted small text-truncate" style={{ fontSize: '0.68rem' }}>{act.desc}</div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>

            {/* 4 Colorful KPI Stat Tiles */}
            <DashboardStats weather={data.weather} soil={data.soil} />

            {/* 7-Day Colorful Weather Forecast Strip */}
            <div className="dashboard-forecast mt-4">
              <WeatherForecast forecast={data.weather.forecast} />
            </div>

            {/* Soil Health + Crop Recommendation Insights */}
            <div className="row g-4 mt-1 dashboard-insights">
              <div className="col-12 col-lg-5">
                <SoilHealthCard soil={data.soil} />
              </div>
              <div className="col-12 col-lg-7">
                <CropRecommendationCard
                  recommendation={data.recommendation}
                  onChatWithAi={() => navigate('/recommendation')}
                />
              </div>
              <div className="col-12">
                <MarketPriceTable prices={data.market} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
