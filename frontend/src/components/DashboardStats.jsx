import React from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Droplets, CloudRain, FlaskConical, Sparkles } from 'lucide-react'

const TILES = [
  {
    key: 'temperature',
    label: 'Ambient Temperature',
    icon: Thermometer,
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)',
    borderColor: '#FED7AA',
    format: (w) => (w ? `${Math.round(w.temperature)}°C` : '--'),
    getBadge: (w) => {
      if (!w) return 'Weather data pending'
      const t = w.temperature
      if (t > 35) return '🔥 High Heat'
      if (t < 15) return '❄️ Cool Climate'
      return '☀️ Optimal Growing Range'
    }
  },
  {
    key: 'humidity',
    label: 'Relative Humidity',
    icon: Droplets,
    color: '#0284C7',
    gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%)',
    borderColor: '#BAE6FD',
    format: (w) => (w ? `${Math.round(w.humidity)}%` : '--'),
    getBadge: (w) => {
      if (!w) return 'Sensor pending'
      const h = w.humidity
      if (h > 75) return '💧 High Air Moisture'
      if (h < 40) return '🌵 Dry Atmosphere'
      return '🌱 Ideal Transpiration'
    }
  },
  {
    key: 'rainfall',
    label: 'Precipitation Forecast',
    icon: CloudRain,
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)',
    borderColor: '#DDD6FE',
    format: (w) => (w ? `${w.rainfall} mm` : '--'),
    getBadge: (w) => {
      if (!w) return 'Radar sync'
      const r = w.rainfall
      if (r > 40) return '🌧️ Heavy Rain Expected'
      if (r > 5) return '🌦️ Light Showers'
      return '☀️ Clear Sky / No Rain'
    }
  },
  {
    key: 'ph',
    label: 'Soil Health (pH)',
    icon: FlaskConical,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #10B981, #047857)',
    bgGradient: 'linear-gradient(180deg, #FFFFFF 0%, #ECFDF5 100%)',
    borderColor: '#A7F3D0',
    format: (_w, s) => (s ? s.ph : '--'),
    getBadge: (_w, s) => {
      if (!s) return 'Add Soil Data'
      const p = s.ph
      if (p < 6.0) return '🍋 Moderately Acidic'
      if (p > 7.8) return '🧂 Alkaline Soil'
      return '✨ Ideal Neutral Soil'
    }
  }
]

export default function DashboardStats({ weather, soil }) {
  return (
    <div className="row g-3">
      {TILES.map((t, i) => {
        const Icon = t.icon
        const value = t.format(weather, soil)
        const badge = t.getBadge(weather, soil)

        return (
          <div className="col-6 col-lg-3" key={t.key}>
            <motion.div
              className="card-agro hoverable shadow-sm p-3 position-relative overflow-hidden h-100"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              style={{
                background: t.bgGradient,
                border: `1.5px solid ${t.borderColor}`,
                borderRadius: '1.15rem'
              }}
            >
              {/* Colorful Top Accent Stripe */}
              <div
                className="position-absolute top-0 start-0 end-0"
                style={{ height: 4, background: t.gradient }}
              />

              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold text-truncate me-1" style={{ fontSize: '0.76rem' }}>
                  {t.label}
                </span>
                <div
                  className="d-flex align-items-center justify-content-center text-white shadow-xs flex-shrink-0"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: t.gradient
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div
                className="fw-extrabold mb-1"
                style={{
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                  fontFamily: "'Manrope', sans-serif",
                  letterSpacing: '-0.03em',
                  color: '#1E293B',
                  lineHeight: 1.1
                }}
              >
                {value}
              </div>

              <div className="d-flex align-items-center gap-1 mt-auto pt-1 overflow-hidden" style={{ minWidth: 0 }}>
                <span
                  className="badge rounded-pill d-inline-flex align-items-center gap-1 text-truncate"
                  title={badge}
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${t.borderColor}`,
                    color: t.color,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.5rem',
                    maxWidth: '100%'
                  }}
                >
                  <Sparkles size={10} className="flex-shrink-0" />
                  <span className="text-truncate">{badge}</span>
                </span>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
