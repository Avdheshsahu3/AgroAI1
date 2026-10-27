import React, { useState, useEffect, useRef, useMemo } from 'react'
import { soilApi } from '../services/api'
import ErrorMessage from '../components/ErrorMessage'
import {
  FlaskConical,
  History,
  Radio,
  PencilLine,
  Cable,
  Unplug,
  Sparkles,
  Droplets,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Layers,
  Zap,
  Info,
  Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const initial = { nitrogen: '', phosphorus: '', potassium: '', ph: '', moisture: '', soilType: '' }

const SOIL_PRESETS = [
  { name: '🌱 Alluvial Loam', type: 'Alluvial', n: 140, p: 45, k: 180, ph: 6.8, m: 45, desc: 'Rich fertile soil common in river valleys' },
  { name: '🪨 Black Cotton', type: 'Black Soil', n: 110, p: 35, k: 210, ph: 7.4, m: 55, desc: 'High clay, excellent water retention for cotton & soybean' },
  { name: '🍂 Red Loam', type: 'Red Soil', n: 95, p: 28, k: 140, ph: 6.4, m: 38, desc: 'Well-drained soil rich in iron and minerals' },
  { name: '🏖️ Sandy Loam', type: 'Sandy Loam', n: 85, p: 24, k: 120, ph: 6.5, m: 32, desc: 'Light, well-aerated soil ideal for tubers and vegetables' }
]

const SOIL_TYPE_SUGGESTIONS = [
  'Alluvial Soil',
  'Black Soil (Regur)',
  'Red & Yellow Soil',
  'Sandy Loam',
  'Clayey Loam',
  'Silt Loam',
  'Laterite Soil'
]

function getNutrientFeedback(val, lowThreshold, highThreshold, unit = 'kg/ha') {
  if (val === '' || val == null) return null
  const num = parseFloat(val)
  if (isNaN(num)) return null
  if (num < lowThreshold) {
    return { status: 'Low', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', tip: `Below benchmark. Consider supplementary top-dressing.` }
  }
  if (num > highThreshold) {
    return { status: 'High', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', tip: `Rich reserve. Reduce application to avoid leaching.` }
  }
  return { status: 'Optimal', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', tip: `Ideal nutrient density for crop growth.` }
}

function getPhFeedback(val) {
  if (val === '' || val == null) return null
  const num = parseFloat(val)
  if (isNaN(num)) return null
  if (num < 6.0) {
    return { status: 'Acidic', color: '#EA580C', bg: '#FFEDD5', border: '#FED7AA', tip: `pH ${num}: Lime application helps normalize acidity.` }
  }
  if (num > 7.8) {
    return { status: 'Alkaline', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', tip: `pH ${num}: Gypsum or compost helps moderate alkalinity.` }
  }
  return { status: 'Neutral', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', tip: `pH ${num}: Excellent range for maximum nutrient uptake.` }
}

function getMoistureFeedback(val) {
  if (val === '' || val == null) return null
  const num = parseFloat(val)
  if (isNaN(num)) return null
  if (num < 35) {
    return { status: 'Dry', color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', tip: `${num}%: Irrigation recommended before sowing.` }
  }
  if (num > 75) {
    return { status: 'Saturated', color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', tip: `${num}%: High moisture. Ensure good drainage.` }
  }
  return { status: 'Optimal', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', tip: `${num}%: Well-aerated root zone.` }
}

export default function SoilDataPage({ farmer }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [mode, setMode] = useState('manual')
  const [deviceStatus, setDeviceStatus] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [deletingAll, setDeletingAll] = useState(false)
  const readerRef = useRef(null)
  const portRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    soilApi.history(farmer.id).then(setHistory).catch(() => {})
    return () => {
      mountedRef.current = false
      readerRef.current?.cancel().catch(() => {})
      portRef.current?.close().catch(() => {})
    }
  }, [farmer.id])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function applyPreset(preset) {
    setForm({
      nitrogen: String(preset.n),
      phosphorus: String(preset.p),
      potassium: String(preset.k),
      ph: String(preset.ph),
      moisture: String(preset.m),
      soilType: preset.type
    })
    setSuccess(`Applied "${preset.name}" preset. You can fine-tune values below before saving.`)
  }

  function loadFromHistory(h) {
    setForm({
      nitrogen: String(h.nitrogen),
      phosphorus: String(h.phosphorus),
      potassium: String(h.potassium),
      ph: String(h.ph),
      moisture: String(h.moisture),
      soilType: h.soilType || ''
    })
    setSuccess(`Loaded reading from ${new Date(h.recordedAt).toLocaleDateString()} into form.`)
  }

  async function handleDelete(recordId) {
    if (!window.confirm('Are you sure you want to remove this soil detail record?')) {
      return
    }
    setError('')
    setSuccess('')
    setDeletingId(recordId)
    try {
      await soilApi.delete(farmer.id, recordId)
      setSuccess('Soil detail record successfully removed.')
      const updated = await soilApi.history(farmer.id)
      setHistory(updated)
      setForm(initial)
    } catch (err) {
      setError(err.message || 'Failed to remove soil record.')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleDeleteAll() {
    if (!window.confirm('Are you sure you want to remove all historical soil detail records for your farm?')) {
      return
    }
    setError('')
    setSuccess('')
    setDeletingAll(true)
    try {
      await soilApi.deleteAll(farmer.id)
      setSuccess('All soil detail records have been removed.')
      setHistory([])
      setForm(initial)
    } catch (err) {
      setError(err.message || 'Failed to remove all soil records.')
    } finally {
      setDeletingAll(false)
    }
  }

  async function disconnectDevice() {
    try { await readerRef.current?.cancel() } catch {}
    try { await portRef.current?.close() } catch {}
    readerRef.current = null
    portRef.current = null
    setConnecting(false)
    setDeviceStatus('Device disconnected.')
  }

  async function connectDevice() {
    setError('')
    setSuccess('')
    setDeviceStatus('')
    if (!('serial' in navigator)) {
      setError('Serial device access is not available in this browser. Try Chrome or Edge on HTTPS or localhost.')
      return
    }
    let port = null
    let reader = null
    try {
      port = await navigator.serial.requestPort()
      await port.open({ baudRate: 9600 })
      portRef.current = port
      setConnecting(true)
      setDeviceStatus('Connected. Waiting for sensor reading...')
      const decoder = new TextDecoder()
      let buffer = ''
      reader = port.readable.getReader()
      readerRef.current = reader
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split(/\r?\n/)
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.trim()) continue
          const reading = JSON.parse(line)
          const values = {
            nitrogen: reading.nitrogen ?? reading.n ?? reading.N,
            phosphorus: reading.phosphorus ?? reading.p ?? reading.P,
            potassium: reading.potassium ?? reading.k ?? reading.K,
            ph: reading.ph ?? reading.pH,
            moisture: reading.moisture ?? reading.moisturePercent
          }
          const missing = Object.entries(values).filter(([, value]) => value == null || !Number.isFinite(Number(value)))
          if (missing.length) throw new Error(`Device reading is missing valid values for: ${missing.map(([k]) => k).join(', ')}.`)
          setForm((current) => ({
            ...current,
            ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v)])),
            soilType: reading.soilType ?? current.soilType
          }))
          setDeviceStatus('Reading received successfully. Review the values below, then save them.')
          setSuccess('Soil readings received from device. Review them below before saving.')
          return
        }
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'Could not read from the IoT device.')
    } finally {
      try { reader?.releaseLock() } catch {}
      try { await port?.close() } catch {}
      if (readerRef.current === reader) readerRef.current = null
      if (portRef.current === port) portRef.current = null
      if (mountedRef.current) setConnecting(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const payload = {
        nitrogen: parseFloat(form.nitrogen),
        phosphorus: parseFloat(form.phosphorus),
        potassium: parseFloat(form.potassium),
        ph: parseFloat(form.ph),
        moisture: parseFloat(form.moisture),
        soilType: form.soilType || null
      }
      await soilApi.save(farmer.id, payload)
      setSuccess('Soil data successfully saved! Your dashboard and crop recommendation models are now updated.')
      const updated = await soilApi.history(farmer.id)
      setHistory(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Active feedbacks for live indicators
  const nFb = getNutrientFeedback(form.nitrogen, 120, 180)
  const pFb = getNutrientFeedback(form.phosphorus, 30, 65)
  const kFb = getNutrientFeedback(form.potassium, 120, 220)
  const phFb = getPhFeedback(form.ph)
  const mFb = getMoistureFeedback(form.moisture)

  return (
    <div className="container py-4" style={{ maxWidth: 940 }}>
      {/* Page Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 6px 16px rgba(16,185,129,0.3)'
            }}
          >
            <FlaskConical size={24} />
          </div>
          <div>
            <h3 className="mb-0 fw-bold d-flex align-items-center gap-2">
              Soil Health & Nutrient Lab
            </h3>
            <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
              Record N-P-K macro-nutrients, moisture sensors, and pH levels to power crop AI models
            </p>
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="btn-group p-1 bg-white border rounded-pill shadow-sm soil-mode-selector" role="group">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${mode === 'manual' ? 'btn-agro text-white' : 'btn-light border-0 text-muted'}`}
            onClick={() => setMode('manual')}
          >
            <PencilLine size={15} className="me-1" /> Manual Lab Entry
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1 ${mode === 'iot' ? 'btn-agro text-white' : 'btn-light border-0 text-muted'}`}
            onClick={() => { setMode('iot'); setError(''); setSuccess('') }}
          >
            <Radio size={15} className="me-1" /> IoT Sensor
            <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.65rem' }}>USB</span>
          </button>
        </div>
      </div>

      {/* Preset Autofill Chips */}
      <div className="card-agro shadow-sm p-3 mb-4 border-0" style={{ background: 'linear-gradient(135deg, #F0FDF4, #FFFFFF)', borderRadius: '1rem', border: '1px solid #DCFCE7' }}>
        <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
          <span className="fw-semibold text-success d-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
            <Sparkles size={14} /> Quick Soil Profiles (Autofill Benchmarks)
          </span>
          <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Click any profile to load calibrated ranges</span>
        </div>
        <div className="soil-presets-strip d-flex flex-wrap gap-2">
          {SOIL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="soil-preset-btn btn btn-sm btn-light border py-1 px-3 rounded-pill d-inline-flex align-items-center gap-2 text-dark transition-all hoverable"
              style={{ fontSize: '0.78rem', background: '#FFFFFF', borderColor: '#E2E8F0' }}
              onClick={() => applyPreset(preset)}
              title={preset.desc}
            >
              <span className="fw-semibold">{preset.name}</span>
              <span className="badge rounded-pill bg-success-subtle text-success" style={{ fontSize: '0.68rem' }}>
                pH {preset.ph}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* IoT Serial Sensor Panel (if selected) */}
      {mode === 'iot' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-agro shadow-sm p-4 mb-4 border"
          style={{ background: 'linear-gradient(135deg, #F0F9FF, #FFFFFF)', borderColor: '#BAE6FD', borderRadius: '1.15rem' }}
        >
          <div className="d-flex align-items-start gap-3">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0 text-white shadow-xs"
              style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #0284C7, #0EA5E9)' }}
            >
              <Radio size={22} />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2 mb-1">
                <h5 className="mb-0 fw-bold text-dark">Hardware Serial Soil Sensor</h5>
                <span className={`badge rounded-pill ${connecting ? 'bg-success text-white' : 'bg-secondary text-white'}`} style={{ fontSize: '0.68rem' }}>
                  {connecting ? 'Active Port' : 'Ready'}
                </span>
              </div>
              <p className="text-muted small mb-3" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                Connect an Arduino, ESP32, or NPK probe over USB. Transmit newline-delimited JSON at <strong>9600 baud</strong> with nitrogen, phosphorus, potassium, ph, and moisture.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-agro d-flex align-items-center gap-2"
                  onClick={connectDevice}
                  disabled={connecting}
                >
                  <Cable size={17} /> {connecting ? 'Listening for sensor stream...' : 'Connect USB Sensor'}
                </button>
                {connecting && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={disconnectDevice}
                  >
                    <Unplug size={15} /> Disconnect
                  </button>
                )}
              </div>

              {deviceStatus && (
                <div className="alert alert-info mt-3 mb-0 py-2 small d-flex align-items-center gap-2">
                  <Info size={15} /> {deviceStatus}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Input Form Card */}
      <div className="card-agro shadow-sm p-4 mb-4" style={{ borderRadius: '1.25rem' }}>
        <ErrorMessage message={error} />
        {success && (
          <div className="alert alert-success d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 shadow-xs" style={{ borderRadius: '0.85rem' }}>
            <div className="d-flex align-items-center gap-2">
              <CheckCircle2 size={18} className="text-success flex-shrink-0" />
              <span style={{ fontSize: '0.86rem' }}>{success}</span>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1.5 rounded-pill px-3 py-1 fw-bold bg-white"
                style={{ fontSize: '0.78rem' }}
                onClick={() => handleDelete(history[0].id)}
                disabled={deletingId === history[0].id}
              >
                <Trash2 size={14} />
                <span>{deletingId === history[0].id ? 'Removing...' : 'Remove Soil Detail'}</span>
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: NPK Macro-Nutrients */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <span className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.94rem' }}>
                <span className="badge rounded-circle bg-success text-white p-1 px-2" style={{ fontSize: '0.72rem' }}>1</span>
                Primary Macro-Nutrients (NPK)
              </span>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Measured in kg/hectare</span>
            </div>

            <div className="row g-3">
              {/* Nitrogen (N) */}
              <div className="col-12 col-md-4">
                <div
                  className="p-3 rounded-3 border h-100 transition-all"
                  style={{
                    background: nFb ? nFb.bg : '#FAFBF9',
                    borderColor: nFb ? nFb.border : '#E2E8F0',
                    borderTop: '3px solid #059669'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label mb-0 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                      <span className="badge bg-success text-white rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>N</span>
                      Nitrogen
                    </label>
                    {nFb && (
                      <span className="badge rounded-pill" style={{ background: '#FFF', color: nFb.color, border: `1px solid ${nFb.color}44`, fontSize: '0.68rem' }}>
                        {nFb.status}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      placeholder="e.g. 140"
                      className="form-control form-control-lg-touch fw-bold"
                      value={form.nitrogen}
                      onChange={(e) => update('nitrogen', e.target.value)}
                      style={{ fontSize: '1.05rem', color: '#065F46' }}
                    />
                    <span className="input-group-text bg-white text-muted small">kg/ha</span>
                  </div>
                  <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
                    {nFb ? nFb.tip : 'Promotes leaf and foliage vegetative vigor.'}
                  </div>
                </div>
              </div>

              {/* Phosphorus (P) */}
              <div className="col-12 col-md-4">
                <div
                  className="p-3 rounded-3 border h-100 transition-all"
                  style={{
                    background: pFb ? pFb.bg : '#FAFBF9',
                    borderColor: pFb ? pFb.border : '#E2E8F0',
                    borderTop: '3px solid #D97706'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label mb-0 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                      <span className="badge rounded-pill text-white px-2 py-1" style={{ background: '#D97706', fontSize: '0.7rem' }}>P</span>
                      Phosphorus
                    </label>
                    {pFb && (
                      <span className="badge rounded-pill" style={{ background: '#FFF', color: pFb.color, border: `1px solid ${pFb.color}44`, fontSize: '0.68rem' }}>
                        {pFb.status}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      placeholder="e.g. 45"
                      className="form-control form-control-lg-touch fw-bold"
                      value={form.phosphorus}
                      onChange={(e) => update('phosphorus', e.target.value)}
                      style={{ fontSize: '1.05rem', color: '#92400E' }}
                    />
                    <span className="input-group-text bg-white text-muted small">kg/ha</span>
                  </div>
                  <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
                    {pFb ? pFb.tip : 'Stimulates root establishment & early flowering.'}
                  </div>
                </div>
              </div>

              {/* Potassium (K) */}
              <div className="col-12 col-md-4">
                <div
                  className="p-3 rounded-3 border h-100 transition-all"
                  style={{
                    background: kFb ? kFb.bg : '#FAFBF9',
                    borderColor: kFb ? kFb.border : '#E2E8F0',
                    borderTop: '3px solid #7C3AED'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label mb-0 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                      <span className="badge rounded-pill text-white px-2 py-1" style={{ background: '#7C3AED', fontSize: '0.7rem' }}>K</span>
                      Potassium
                    </label>
                    {kFb && (
                      <span className="badge rounded-pill" style={{ background: '#FFF', color: kFb.color, border: `1px solid ${kFb.color}44`, fontSize: '0.68rem' }}>
                        {kFb.status}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      required
                      placeholder="e.g. 180"
                      className="form-control form-control-lg-touch fw-bold"
                      value={form.potassium}
                      onChange={(e) => update('potassium', e.target.value)}
                      style={{ fontSize: '1.05rem', color: '#5B21B6' }}
                    />
                    <span className="input-group-text bg-white text-muted small">kg/ha</span>
                  </div>
                  <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
                    {kFb ? kFb.tip : 'Boosts disease resistance & grain/fruit fullness.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Soil pH & Moisture */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <span className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.94rem' }}>
                <span className="badge rounded-circle bg-success text-white p-1 px-2" style={{ fontSize: '0.72rem' }}>2</span>
                Soil Chemistry & Water Saturation
              </span>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Core biological parameters</span>
            </div>

            <div className="row g-3">
              {/* Soil pH */}
              <div className="col-12 col-md-6">
                <div
                  className="p-3 rounded-3 border h-100 transition-all"
                  style={{
                    background: phFb ? phFb.bg : '#FAFBF9',
                    borderColor: phFb ? phFb.border : '#E2E8F0',
                    borderTop: '3px solid #06B6D4'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label mb-0 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                      <FlaskConical size={16} className="text-info" /> Soil pH (Scale 0-14)
                    </label>
                    {phFb && (
                      <span className="badge rounded-pill" style={{ background: '#FFF', color: phFb.color, border: `1px solid ${phFb.color}44`, fontSize: '0.68rem' }}>
                        {phFb.status}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      required
                      placeholder="e.g. 6.8"
                      className="form-control form-control-lg-touch fw-bold"
                      value={form.ph}
                      onChange={(e) => update('ph', e.target.value)}
                      style={{ fontSize: '1.05rem', color: phFb ? phFb.color : '#1E293B' }}
                    />
                    <span className="input-group-text bg-white text-muted small">pH</span>
                  </div>
                  <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
                    {phFb ? phFb.tip : 'Neutral range is 6.0 – 7.5. Acidic < 6, Alkaline > 7.8.'}
                  </div>
                </div>
              </div>

              {/* Soil Moisture */}
              <div className="col-12 col-md-6">
                <div
                  className="p-3 rounded-3 border h-100 transition-all"
                  style={{
                    background: mFb ? mFb.bg : '#FAFBF9',
                    borderColor: mFb ? mFb.border : '#E2E8F0',
                    borderTop: '3px solid #0284C7'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label mb-0 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.86rem' }}>
                      <Droplets size={16} className="text-primary" /> Soil Moisture Content
                    </label>
                    {mFb && (
                      <span className="badge rounded-pill" style={{ background: '#FFF', color: mFb.color, border: `1px solid ${mFb.color}44`, fontSize: '0.68rem' }}>
                        {mFb.status}
                      </span>
                    )}
                  </div>
                  <div className="input-group">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      placeholder="e.g. 42"
                      className="form-control form-control-lg-touch fw-bold"
                      value={form.moisture}
                      onChange={(e) => update('moisture', e.target.value)}
                      style={{ fontSize: '1.05rem', color: '#0369A1' }}
                    />
                    <span className="input-group-text bg-white text-muted small">% moisture</span>
                  </div>
                  <div className="text-muted small mt-2" style={{ fontSize: '0.72rem' }}>
                    {mFb ? mFb.tip : 'Determines seed germination and root oxygenation.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Soil Texture / Type */}
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <label className="form-label mb-0 fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.88rem' }}>
                <Layers size={16} className="text-success" /> Soil Texture / Type (optional)
              </label>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Select or type your soil type</span>
            </div>

            <div className="d-flex flex-wrap gap-1 mb-2">
              {SOIL_TYPE_SUGGESTIONS.map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm rounded-pill py-1 px-2 ${form.soilType === st ? 'btn-success text-white' : 'btn-light border text-secondary'}`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => update('soilType', st)}
                >
                  {st}
                </button>
              ))}
            </div>

            <input
              type="text"
              className="form-control form-control-lg-touch"
              placeholder="e.g. Alluvial Loam, Black Cotton Soil, Red Soil"
              value={form.soilType}
              onChange={(e) => update('soilType', e.target.value)}
            />
          </div>

          {/* Submit and Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            <button
              type="submit"
              className="btn btn-agro flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={loading}
              style={{ fontSize: '1rem', borderRadius: '0.9rem' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" />
                  <span>Calibrating and Saving Soil Profile...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={19} />
                  <span>Save Soil Health Profile</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-light border py-3 px-3 d-flex align-items-center justify-content-center gap-1.5 text-muted hover-danger"
              style={{ borderRadius: '0.9rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
              onClick={() => { setForm(initial); setSuccess(''); setError('') }}
              title="Clear entered form values"
            >
              <RotateCcw size={16} />
              <span className="d-none d-sm-inline">Clear Form</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Readings History */}
      {history.length > 0 && (
        <div className="card-agro shadow-sm p-4" style={{ borderRadius: '1.25rem' }}>
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center text-white"
                style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                <History size={18} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold">Recent Soil Recordings</h5>
                <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                  {history.length} {history.length === 1 ? 'recording' : 'recordings'} saved • Newest profile feeds AI recommendations
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-muted border">Last {Math.min(history.length, 5)} Lab Tests</span>
              {history.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger py-1 px-2.5 rounded-pill d-inline-flex align-items-center gap-1"
                  style={{ fontSize: '0.74rem' }}
                  onClick={handleDeleteAll}
                  disabled={deletingAll}
                  title="Remove all soil recordings"
                >
                  <Trash2 size={13} /> {deletingAll ? 'Removing...' : 'Remove All'}
                </button>
              )}
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                  <th className="border-0">Nitrogen (N)</th>
                  <th className="border-0">Phosphorus (P)</th>
                  <th className="border-0">Potassium (K)</th>
                  <th className="border-0">pH Level</th>
                  <th className="border-0">Moisture</th>
                  <th className="border-0">Soil Type</th>
                  <th className="border-0">Recorded At</th>
                  <th className="border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((h) => {
                  const phColor = h.ph < 6 ? '#D97706' : h.ph > 7.8 ? '#7C3AED' : '#059669'
                  const isDeleting = deletingId === h.id
                  return (
                    <tr key={h.id}>
                      <td>
                        <span className="badge bg-success-subtle text-success fw-bold px-2 py-1 rounded-pill" style={{ fontSize: '0.76rem' }}>
                          {h.nitrogen} kg/ha
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-warning-subtle text-warning-emphasis fw-bold px-2 py-1 rounded-pill" style={{ fontSize: '0.76rem' }}>
                          {h.phosphorus} kg/ha
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1 rounded-pill" style={{ fontSize: '0.76rem' }}>
                          {h.potassium} kg/ha
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold" style={{ color: phColor, fontSize: '0.86rem' }}>
                          {h.ph}
                        </span>
                      </td>
                      <td>
                        <span className="text-info fw-semibold" style={{ fontSize: '0.86rem' }}>
                          💧 {h.moisture}%
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
                          {h.soilType || 'Standard'}
                        </span>
                      </td>
                      <td className="text-muted small" style={{ fontSize: '0.74rem' }}>
                        {new Date(h.recordedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-1.5">
                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm py-1 px-2.5 rounded-pill d-inline-flex align-items-center"
                            style={{ fontSize: '0.72rem' }}
                            onClick={() => loadFromHistory(h)}
                            title="Load this historical reading into the form"
                          >
                            <RotateCcw size={12} className="me-1" /> Use Values
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm py-1 px-2.5 rounded-pill d-inline-flex align-items-center"
                            style={{ fontSize: '0.72rem' }}
                            onClick={() => handleDelete(h.id)}
                            disabled={isDeleting}
                            title="Remove this soil detail record"
                          >
                            <Trash2 size={12} className="me-1" /> {isDeleting ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
