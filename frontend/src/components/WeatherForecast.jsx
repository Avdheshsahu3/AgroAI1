import React from 'react'
import { motion } from 'framer-motion'
import { CloudSun, Droplets, Sparkles, CalendarDays } from 'lucide-react'
import { getWeatherIcon } from '../utils/visuals'

function getWeatherTheme(condition) {
  if (!condition) return { color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' }
  const c = condition.toLowerCase()
  if (c.includes('clear') || c.includes('sun')) {
    return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', badge: 'Warm & Bright' }
  }
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) {
    return { color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', badge: 'Rain Expected' }
  }
  if (c.includes('thunder')) {
    return { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', badge: 'Storm Caution' }
  }
  if (c.includes('snow')) {
    return { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', badge: 'Frost' }
  }
  return { color: '#4F46E5', bg: '#F8FAFC', border: '#E2E8F0', badge: 'Overcast' }
}

export default function WeatherForecast({ forecast }) {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className="card-agro shadow-sm p-4" style={{ borderRadius: '1.25rem' }}>
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              boxShadow: '0 4px 12px rgba(2,132,199,0.25)'
            }}
          >
            <CloudSun size={20} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-bold">7-Day Agro Weather Forecast</h5>
              <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill" style={{ fontSize: '0.68rem' }}>
                Live Radar
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Micro-climate temperature range & precipitation outlook for crop irrigation
            </div>
          </div>
        </div>

        <div className="badge bg-light text-secondary border px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '0.74rem' }}>
          <CalendarDays size={13} className="text-primary" /> Next 7 Days Outlook
        </div>
      </div>

      <div className="forecast-strip pb-1">
        {forecast.map((day, i) => {
          const Icon = getWeatherIcon(day.condition)
          const theme = getWeatherTheme(day.condition)
          const isToday = i === 0

          return (
            <motion.div
              className="forecast-day position-relative border"
              key={day.date}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              style={{
                background: isToday
                  ? 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)'
                  : theme.bg,
                borderColor: isToday ? '#10B981' : theme.border,
                borderRadius: '1rem',
                padding: '1rem 0.65rem',
                minWidth: 125,
                boxShadow: isToday ? '0 8px 20px -6px rgba(16,185,129,0.3)' : '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              {isToday && (
                <span
                  className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-success text-white shadow-xs"
                  style={{ fontSize: '0.65rem', padding: '0.22rem 0.55rem' }}
                >
                  Today
                </span>
              )}

              <div className="fw-bold mb-2 text-dark" style={{ fontSize: '0.88rem' }}>
                {day.day}
              </div>

              <div
                className="d-flex align-items-center justify-content-center mx-auto mb-2 rounded-3"
                style={{
                  width: 44,
                  height: 44,
                  background: '#FFFFFF',
                  color: theme.color,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.06)'
                }}
              >
                <Icon size={24} />
              </div>

              <div
                className="fw-semibold text-truncate mb-2"
                style={{ fontSize: '0.74rem', color: theme.color }}
                title={day.condition}
              >
                {day.condition}
              </div>

              {/* Temperature Max / Min Range */}
              <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                <span className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
                  {Math.round(day.temperatureMax)}°
                </span>
                <span className="text-muted" style={{ fontSize: '0.78rem' }}>/</span>
                <span className="text-muted small" style={{ fontSize: '0.8rem' }}>
                  {Math.round(day.temperatureMin)}°
                </span>
              </div>

              {/* Rainfall indicator */}
              <div
                className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill mt-1"
                style={{
                  background: day.rainfall > 0 ? '#E0F2FE' : '#F1F5F9',
                  color: day.rainfall > 0 ? '#0369A1' : '#64748B',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}
              >
                <Droplets size={11} className={day.rainfall > 0 ? 'text-primary' : 'text-muted'} />
                <span>{day.rainfall} mm</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
