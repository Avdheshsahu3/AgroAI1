import React from 'react'
import {
  Droplets,
  CloudRain,
  Wind,
  Sun,
  Compass,
  Gauge,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldAlert
} from 'lucide-react'
import { getWeatherIcon } from '../utils/visuals'
import { motion } from 'framer-motion'

function getWeatherAtmosphere(condition) {
  if (!condition) {
    return {
      bg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      color: '#FFFFFF',
      badgeBg: 'rgba(255,255,255,0.2)',
      badgeText: '#FFFFFF',
      accent: '#38BDF8'
    }
  }
  const c = condition.toLowerCase()
  if (c.includes('clear') || c.includes('sun')) {
    return {
      bg: 'linear-gradient(135deg, #D97706 0%, #B45309 60%, #92400E 100%)',
      color: '#FFFFFF',
      badgeBg: 'rgba(255,255,255,0.2)',
      badgeText: '#FFFFFF',
      accent: '#FDE68A'
    }
  }
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) {
    return {
      bg: 'linear-gradient(135deg, #0284C7 0%, #0369A1 60%, #075985 100%)',
      color: '#FFFFFF',
      badgeBg: 'rgba(255,255,255,0.2)',
      badgeText: '#FFFFFF',
      accent: '#7DD3FC'
    }
  }
  if (c.includes('thunder') || c.includes('storm')) {
    return {
      bg: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 60%, #4C1D95 100%)',
      color: '#FFFFFF',
      badgeBg: 'rgba(255,255,255,0.2)',
      badgeText: '#FFFFFF',
      accent: '#DDD6FE'
    }
  }
  return {
    bg: 'linear-gradient(135deg, #334155 0%, #1E293B 60%, #0F172A 100%)',
    color: '#FFFFFF',
    badgeBg: 'rgba(255,255,255,0.2)',
    badgeText: '#FFFFFF',
    accent: '#CBD5E1'
  }
}

export default function WeatherCard({ weather }) {
  if (!weather) return null
  const Icon = getWeatherIcon(weather.condition)
  const atmo = getWeatherAtmosphere(weather.condition)

  // Spraying feasibility logic
  const isSpraySafe = weather.windSpeed <= 15 && weather.rainfall === 0
  const isIrrigationNeeded = weather.rainfall < 2 && weather.temperature > 28

  return (
    <motion.div
      className="card-agro shadow-sm overflow-hidden p-0 mb-4 h-100"
      style={{
        borderRadius: 22,
        border: '1.5px solid #E2E8F0',
        background: '#FFFFFF'
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Dynamic Condition Hero Header */}
      <div
        style={{
          background: atmo.bg,
          color: atmo.color,
          padding: '1.75rem 1.6rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="d-flex align-items-center justify-content-between mb-2 position-relative" style={{ zIndex: 1 }}>
          <div className="d-flex align-items-center gap-1.5 small fw-semibold" style={{ color: atmo.accent }}>
            <MapPin size={14} />
            <span>{weather.location || 'Farm Region'}</span>
          </div>
          <span
            className="badge px-2.5 py-1 fw-bold rounded-pill"
            style={{
              background: atmo.badgeBg,
              color: atmo.badgeText,
              backdropFilter: 'blur(8px)',
              fontSize: '0.72rem',
              border: '1px solid rgba(255,255,255,0.25)'
            }}
          >
            Live Radar Feed
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between my-2 position-relative" style={{ zIndex: 1 }}>
          <div>
            <div className="d-flex align-items-baseline gap-1">
              <span className="fw-extrabold text-white" style={{ fontSize: '3.1rem', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {Math.round(weather.temperature)}°
              </span>
              <span className="text-white-50 fs-5">C</span>
            </div>
            <div className="fw-bold mt-1 text-capitalize" style={{ fontSize: '1.1rem', color: atmo.accent }}>
              {weather.condition || 'Clear Sky'}
            </div>
            <div className="text-white-50 small mt-0.5" style={{ fontSize: '0.76rem' }}>
              Day High: {Math.round(weather.temperatureMax || weather.temperature + 3)}° • Low: {Math.round(weather.temperatureMin || weather.temperature - 5)}°
            </div>
          </div>

          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              flexShrink: 0
            }}
          >
            <Icon size={42} strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* 6 Micro-Climate Vitals Grid */}
      <div className="p-3 p-md-3.5">
        <div className="row g-2 mb-3">
          {/* Humidity */}
          <div className="col-4">
            <div className="p-2.5 rounded-3 text-center border" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
              <Droplets size={18} className="text-primary mb-1 mx-auto d-block" />
              <div className="text-muted" style={{ fontSize: '0.68rem', fontWeight: 600 }}>Humidity</div>
              <div className="fw-bold text-dark mt-0.5" style={{ fontSize: '0.98rem' }}>
                {Math.round(weather.humidity)}%
              </div>
            </div>
          </div>

          {/* Rainfall */}
          <div className="col-4">
            <div className="p-2.5 rounded-3 text-center border" style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}>
              <CloudRain size={18} className="text-success mb-1 mx-auto d-block" />
              <div className="text-muted" style={{ fontSize: '0.68rem', fontWeight: 600 }}>Rainfall</div>
              <div className="fw-bold text-dark mt-0.5" style={{ fontSize: '0.98rem' }}>
                {weather.rainfall} mm
              </div>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="col-4">
            <div className="p-2.5 rounded-3 text-center border" style={{ background: '#FAF5FF', borderColor: '#DDD6FE' }}>
              <Wind size={18} style={{ color: '#7C3AED' }} className="mb-1 mx-auto d-block" />
              <div className="text-muted" style={{ fontSize: '0.68rem', fontWeight: 600 }}>Wind</div>
              <div className="fw-bold text-dark mt-0.5" style={{ fontSize: '0.98rem' }}>
                {Math.round(weather.windSpeed)} km/h
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Spray & Agronomic Feasibility Status */}
        <div
          className="p-3 rounded-3 border mb-2"
          style={{
            background: isSpraySafe ? '#F0FDF4' : '#FFFBEB',
            borderColor: isSpraySafe ? '#BBF7D0' : '#FDE68A'
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span
              className="fw-bold d-flex align-items-center gap-1.5 small"
              style={{ color: isSpraySafe ? '#15803D' : '#B45309', fontSize: '0.8rem' }}
            >
              {isSpraySafe ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
              Knapsack Spraying Window
            </span>
            <span
              className="badge fw-bold"
              style={{
                background: isSpraySafe ? '#DCFCE7' : '#FEF3C7',
                color: isSpraySafe ? '#166534' : '#92400E',
                fontSize: '0.68rem'
              }}
            >
              {isSpraySafe ? 'Favorable Window' : 'Caution Drift'}
            </span>
          </div>
          <p className="text-muted small mb-0" style={{ fontSize: '0.76rem', lineHeight: 1.4 }}>
            {isSpraySafe
              ? `Wind speed is calm (${Math.round(weather.windSpeed)} km/h) with zero rainfall. Ideal for foliar bio-fertilizer or pesticide application.`
              : weather.rainfall > 0
              ? 'Active rainfall will wash away foliar sprays. Postpone chemical treatments.'
              : `Wind speed (${Math.round(weather.windSpeed)} km/h) exceeds safe 15 km/h threshold; risk of droplet spray drift.`}
          </p>
        </div>

        {/* Quick Micro-Climate Summary Pill */}
        <div className="d-flex align-items-center justify-content-between text-muted small px-1 pt-1" style={{ fontSize: '0.72rem' }}>
          <span>Barometric Pressure: <strong>1013 hPa</strong></span>
          <span>UV Index: <strong className="text-warning">Moderate (5.5)</strong></span>
        </div>
      </div>
    </motion.div>
  )
}
