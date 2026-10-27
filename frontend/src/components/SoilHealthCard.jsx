import React from 'react'
import { Sprout, FlaskConical, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

function NutrientBar({ label, symbol, value, max, unit = 'kg/ha', color, gradient, bgLight, status }) {
  const pct = Math.min(100, Math.max(0, Math.round(((value || 0) / max) * 100)))

  return (
    <div className="mb-3 p-2 rounded-3" style={{ background: '#FAFBF9' }}>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center text-white rounded-circle fw-bold"
            style={{ width: 22, height: 22, background: color, fontSize: '0.68rem' }}
          >
            {symbol}
          </span>
          <span className="fw-semibold text-dark" style={{ fontSize: '0.84rem' }}>{label}</span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold" style={{ fontSize: '0.9rem', color }}>
            {value != null ? value : '--'} <span className="text-muted fw-normal" style={{ fontSize: '0.72rem' }}>{unit}</span>
          </span>
          {status && (
            <span
              className="badge rounded-pill"
              style={{
                background: bgLight,
                color,
                fontSize: '0.68rem',
                border: `1px solid ${color}44`,
                padding: '0.2rem 0.5rem'
              }}
            >
              {status}
            </span>
          )}
        </div>
      </div>

      <div className="progress" style={{ height: 8, background: '#E2E8F0', borderRadius: 999 }}>
        <div
          className="progress-bar rounded-pill"
          role="progressbar"
          style={{
            width: `${pct}%`,
            background: gradient,
            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          aria-valuenow={pct}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  )
}

export default function SoilHealthCard({ soil }) {
  if (!soil) {
    return (
      <div className="card-agro shadow-sm p-4" style={{ borderRadius: '1.25rem' }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg, #10B981, #059669)' }}
          >
            <Sprout size={20} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Soil Health Profile</h5>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>Laboratory & Sensor Metrics</div>
          </div>
        </div>
        <p className="text-muted mb-0">No soil data recorded yet. Add a reading on the Soil Data page.</p>
      </div>
    )
  }

  // Interpret soil status
  const nStatus = soil.nitrogen < 120 ? 'Low' : soil.nitrogen > 180 ? 'Rich' : 'Optimal'
  const pStatus = soil.phosphorus < 30 ? 'Low' : soil.phosphorus > 65 ? 'High' : 'Optimal'
  const kStatus = soil.potassium < 130 ? 'Low' : soil.potassium > 220 ? 'Rich' : 'Optimal'
  const mStatus = soil.moisture < 35 ? 'Low Moisture' : soil.moisture > 75 ? 'Saturated' : 'Ideal Moisture'

  const ph = soil.ph || 7.0
  const phInterpretation = ph < 6.0
    ? { label: 'Acidic', color: '#D97706', bg: '#FEF3C7', tip: 'Lime application recommended' }
    : ph > 7.8
    ? { label: 'Alkaline', color: '#6366F1', bg: '#EEF2FF', tip: 'Gypsum or organic manure recommended' }
    : { label: 'Optimal Neutral', color: '#059669', bg: '#ECFDF5', tip: 'Perfect for nutrient bioavailability' }

  return (
    <div className="card-agro shadow-sm p-4 hoverable" style={{ borderRadius: '1.25rem' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 4px 12px rgba(16,185,129,0.25)'
            }}
          >
            <Sprout size={20} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-bold">Soil Health Profile</h5>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.68rem' }}>
                <CheckCircle2 size={11} className="me-1" /> Calibrated
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
              NPK Macro-nutrients, moisture level & pH balance
            </div>
          </div>
        </div>

        <span className="badge rounded-pill bg-light text-secondary border px-2 py-1" style={{ fontSize: '0.72rem' }}>
          Lab Standard
        </span>
      </div>

      {/* Colorful Nutrient Progress Bars */}
      <NutrientBar
        label="Nitrogen (N)"
        symbol="N"
        value={soil.nitrogen}
        max={200}
        color="#059669"
        gradient="linear-gradient(90deg, #34D399, #059669)"
        bgLight="#ECFDF5"
        status={nStatus}
      />

      <NutrientBar
        label="Phosphorus (P)"
        symbol="P"
        value={soil.phosphorus}
        max={100}
        color="#D97706"
        gradient="linear-gradient(90deg, #FBBF24, #D97706)"
        bgLight="#FEF3C7"
        status={pStatus}
      />

      <NutrientBar
        label="Potassium (K)"
        symbol="K"
        value={soil.potassium}
        max={250}
        color="#7C3AED"
        gradient="linear-gradient(90deg, #A78BFA, #7C3AED)"
        bgLight="#F5F3FF"
        status={kStatus}
      />

      <NutrientBar
        label="Soil Moisture"
        symbol="💧"
        value={soil.moisture}
        max={100}
        unit="%"
        color="#0284C7"
        gradient="linear-gradient(90deg, #38BDF8, #0284C7)"
        bgLight="#E0F2FE"
        status={mStatus}
      />

      {/* Soil pH Gauge Banner */}
      <div
        className="p-3 rounded-3 mt-3 border d-flex align-items-center justify-content-between flex-wrap gap-2"
        style={{
          background: `linear-gradient(135deg, ${phInterpretation.bg}, #FFFFFF)`,
          borderColor: `${phInterpretation.color}44`
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 34, height: 34, background: phInterpretation.color, color: '#FFF' }}
          >
            <FlaskConical size={17} />
          </div>
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>
              Soil pH: <span style={{ color: phInterpretation.color }}>{soil.ph}</span>
              <span className="badge rounded-pill ms-2" style={{ background: phInterpretation.color, color: '#FFF', fontSize: '0.68rem' }}>
                {phInterpretation.label}
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
              {phInterpretation.tip}
            </div>
          </div>
        </div>

        <div className="text-end">
          <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Fertility Index</span>
          <div className="fw-bold text-success" style={{ fontSize: '0.86rem' }}>Grade A Soil</div>
        </div>
      </div>
    </div>
  )
}
