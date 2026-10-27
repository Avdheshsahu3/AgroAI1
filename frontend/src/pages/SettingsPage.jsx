import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Layers,
  Cpu,
  Bell,
  Globe,
  ShieldCheck,
  Save,
  Check,
  Sparkles,
  RefreshCw,
  Sliders,
  Radio,
  FileText,
  Download,
  Trash2,
  Lock,
  ChevronRight,
  Sprout,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { useLanguage } from '../i18n'

export default function SettingsPage({ farmer }) {
  const { language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'iot' | 'alerts' | 'data'
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Local state for farmer profile preferences
  const [profile, setProfile] = useState({
    name: farmer?.name || 'Ramesh Patel',
    email: farmer?.email || 'farmer@agroai.local',
    mobile: farmer?.mobile || '9876543210',
    location: farmer?.location || 'Pune, Maharashtra',
    farmArea: farmer?.farmArea || 4.5,
    soilType: 'Alluvial Loam',
    primaryCrop: 'Wheat',
    secondaryCrop: 'Mustard'
  })

  // Hardware IoT preferences
  const [iotConfig, setIotConfig] = useState({
    baudRate: '9600',
    syncInterval: '15',
    sensorOffsetN: '0',
    sensorOffsetP: '0',
    sensorOffsetK: '0',
    autoLogMoisture: true,
    protocol: 'Modbus RS-485 via USB'
  })

  // Notification toggles
  const [alerts, setAlerts] = useState({
    rainAlerts: true,
    mandiSpikes: true,
    pestWarnings: true,
    irrigationReminders: false,
    weeklyReport: true
  })

  function handleSave(e) {
    if (e) e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2800)
  }

  function handleExportData() {
    const data = {
      farmer: profile,
      iotConfig,
      alerts,
      exportedAt: new Date().toISOString(),
      platform: 'AgroAI Precision Agriculture Suite v2.4'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AgroAI_Farm_Profile_${farmer?.id || 'export'}.json`
    a.click()
  }

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      {/* Hero Header Banner */}
      <div
        className="card-agro p-4 mb-4 text-white overflow-hidden position-relative shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #093320 0%, #155E38 45%, #0F6B58 100%)',
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
            background: 'radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)',
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
                ⚙️ FARM PREFERENCES & SENSOR CONFIG
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
                <ShieldCheck size={12} /> Verified Agro Account
              </span>
            </div>
            <h2 className="fw-extrabold mb-1 text-white" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
              Farm Settings & Configurations
            </h2>
            <p className="mb-0 text-white-50 small" style={{ maxWidth: 540, fontSize: '0.85rem' }}>
              Manage registered land plots, calibrate IoT soil telemetry probes, customize alert thresholds, and language preferences.
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-light border px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm rounded-pill"
              style={{ fontSize: '0.84rem', color: '#093320' }}
              onClick={handleSave}
            >
              {savedSuccess ? <Check size={16} className="text-success" /> : <Save size={16} className="text-success" />}
              {savedSuccess ? 'Preferences Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Header Navigation */}
      <div
        className="settings-nav-tabs card-agro p-1.5 mb-4 shadow-sm d-flex flex-row gap-1 overflow-x-auto"
        style={{ borderRadius: 16, background: '#FFFFFF', border: '1.5px solid #E2E8F0' }}
      >
        <button
          type="button"
          className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 transition-all flex-fill text-nowrap ${
            activeTab === 'profile' ? 'bg-success text-white shadow-xs' : 'btn-light border-0 text-muted'
          }`}
          style={{ fontSize: '0.82rem' }}
          onClick={() => setActiveTab('profile')}
        >
          <User size={15} /> Land & Profile
        </button>

        <button
          type="button"
          className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 transition-all flex-fill text-nowrap ${
            activeTab === 'iot' ? 'bg-primary text-white shadow-xs' : 'btn-light border-0 text-muted'
          }`}
          style={{ fontSize: '0.82rem' }}
          onClick={() => setActiveTab('iot')}
        >
          <Cpu size={15} /> IoT Hardware & Sensors
        </button>

        <button
          type="button"
          className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 transition-all flex-fill text-nowrap ${
            activeTab === 'alerts' ? 'bg-warning text-dark shadow-xs' : 'btn-light border-0 text-muted'
          }`}
          style={{ fontSize: '0.82rem' }}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={15} /> Agro-Alerts
        </button>

        <button
          type="button"
          className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 transition-all flex-fill text-nowrap ${
            activeTab === 'data' ? 'bg-dark text-white shadow-xs' : 'btn-light border-0 text-muted'
          }`}
          style={{ fontSize: '0.82rem' }}
          onClick={() => setActiveTab('data')}
        >
          <Sliders size={15} /> Data & Exports
        </button>
      </div>

      {/* Tab 1: Farmer & Land Profile */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="card-agro p-4 mb-4 shadow-sm" style={{ borderRadius: 20, border: '1.5px solid #E2E8F0', background: '#FFFFFF' }}>
            <h5 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#0F172A', fontSize: '1.1rem' }}>
              <User size={18} className="text-success" /> Registered Farmer & Plot Profile
            </h5>
            <p className="text-muted small mb-4" style={{ fontSize: '0.82rem' }}>
              Your plot coordinates and land size calibrate our multi-variable crop suitability models.
            </p>

            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Full Name</label>
                  <div className="position-relative">
                    <User size={16} className="position-absolute text-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }} />
                    <input
                      className="form-control form-control-lg-touch"
                      style={{ paddingLeft: 38 }}
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Email Address</label>
                  <div className="position-relative">
                    <Mail size={16} className="position-absolute text-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      className="form-control form-control-lg-touch"
                      style={{ paddingLeft: 38 }}
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Mobile Phone (For Mandi SMS)</label>
                  <div className="position-relative">
                    <Phone size={16} className="position-absolute text-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }} />
                    <input
                      className="form-control form-control-lg-touch"
                      style={{ paddingLeft: 38 }}
                      value={profile.mobile}
                      onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Farm Area (Acres)</label>
                  <div className="position-relative">
                    <Layers size={16} className="position-absolute text-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }} />
                    <input
                      type="number"
                      step="0.1"
                      className="form-control form-control-lg-touch"
                      style={{ paddingLeft: 38 }}
                      value={profile.farmArea}
                      onChange={(e) => setProfile({ ...profile, farmArea: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Farm Location (District, State)</label>
                  <div className="position-relative">
                    <MapPin size={16} className="position-absolute text-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }} />
                    <input
                      className="form-control form-control-lg-touch"
                      style={{ paddingLeft: 38 }}
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold">Dominant Soil Type</label>
                  <select
                    className="form-select form-control-lg-touch"
                    value={profile.soilType}
                    onChange={(e) => setProfile({ ...profile, soilType: e.target.value })}
                  >
                    <option value="Alluvial Loam">Alluvial Loam (River Plains)</option>
                    <option value="Black Cotton Soil">Black Cotton Soil (Regur)</option>
                    <option value="Red & Yellow Soil">Red & Yellow Loam</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clayey Loam">Clayey Loam</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <span className="text-muted small">Changes will sync across recommendations and weather telemetry.</span>
                <button type="submit" className="btn btn-agro px-4 py-2 fw-bold">
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Tab 2: IoT Hardware & Sensors */}
      {activeTab === 'iot' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="card-agro p-4 mb-4 shadow-sm" style={{ borderRadius: 20, border: '1.5px solid #BAE6FD', background: '#FFFFFF' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div>
                <h5 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#0369A1', fontSize: '1.1rem' }}>
                  <Cpu size={18} className="text-primary" /> Web Serial IoT Soil Probe Hardware
                </h5>
                <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
                  Configure baud rates, Modbus communication, and calibration offsets for RS-485 / USB NPK sensor hardware.
                </p>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold px-2.5 py-1">
                Web Serial API Supported
              </span>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 bg-light border">
                  <label className="form-label small fw-bold text-dark">Serial Port Baud Rate</label>
                  <select
                    className="form-select mb-2"
                    value={iotConfig.baudRate}
                    onChange={(e) => setIotConfig({ ...iotConfig, baudRate: e.target.value })}
                  >
                    <option value="9600">9600 bps (Standard NPK Sensor Probes)</option>
                    <option value="19200">19200 bps (Industrial Modbus)</option>
                    <option value="115200">115200 bps (High-Speed ESP32 / Arduino Telemetry)</option>
                  </select>
                  <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    Select the transmission rate specified on your hardware sensor manual.
                  </span>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 bg-light border">
                  <label className="form-label small fw-bold text-dark">Auto-Sync Telemetry Frequency</label>
                  <select
                    className="form-select mb-2"
                    value={iotConfig.syncInterval}
                    onChange={(e) => setIotConfig({ ...iotConfig, syncInterval: e.target.value })}
                  >
                    <option value="5">Every 5 Seconds (Live Streaming Probe)</option>
                    <option value="15">Every 15 Minutes (Standard Field Sampling)</option>
                    <option value="60">Hourly (Battery Saver Mode)</option>
                    <option value="manual">Manual Capture Only</option>
                  </select>
                  <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    Controls how frequently soil readings are saved into your agronomic database.
                  </span>
                </div>
              </div>

              {/* Calibration Fine-Tuning */}
              <div className="col-12">
                <div className="p-3.5 rounded-3 border" style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}>
                  <h6 className="fw-bold text-primary mb-2 small d-flex align-items-center gap-1.5">
                    <Sliders size={15} /> Laboratory Calibration Offsets (± Adjustment)
                  </h6>
                  <p className="text-muted small mb-3" style={{ fontSize: '0.78rem' }}>
                    Fine-tune raw sensor voltage readings to align with chemical laboratory soil test results.
                  </p>

                  <div className="row g-2">
                    <div className="col-4">
                      <label className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>N Offset (kg/ha)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={iotConfig.sensorOffsetN}
                        onChange={(e) => setIotConfig({ ...iotConfig, sensorOffsetN: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>P Offset (kg/ha)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={iotConfig.sensorOffsetP}
                        onChange={(e) => setIotConfig({ ...iotConfig, sensorOffsetP: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="text-muted small fw-bold d-block" style={{ fontSize: '0.72rem' }}>K Offset (kg/ha)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={iotConfig.sensorOffsetK}
                        onChange={(e) => setIotConfig({ ...iotConfig, sensorOffsetK: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-top d-flex justify-content-end">
              <button type="button" className="btn btn-primary px-4 py-2 fw-bold" onClick={handleSave}>
                Save IoT Configuration
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Agro-Alerts & Notification Matrix */}
      {activeTab === 'alerts' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="card-agro p-4 mb-4 shadow-sm" style={{ borderRadius: 20, border: '1.5px solid #FDE68A', background: '#FFFFFF' }}>
            <h5 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#854D0E', fontSize: '1.1rem' }}>
              <Bell size={18} className="text-warning" /> Precision Agronomic Alerts & Notifications
            </h5>
            <p className="text-muted small mb-4" style={{ fontSize: '0.82rem' }}>
              Receive automated warnings regarding extreme weather, pest outbreaks, and commodity mandi spikes.
            </p>

            <div className="d-flex flex-column gap-3">
              {/* Alert 1 */}
              <div className="p-3 rounded-3 border d-flex align-items-center justify-content-between" style={{ background: '#FFFBEB' }}>
                <div>
                  <strong className="d-block text-dark small" style={{ fontSize: '0.88rem' }}>
                    🌧️ Extreme Precipitation & Storm Warnings
                  </strong>
                  <span className="text-muted small" style={{ fontSize: '0.76rem' }}>
                    Notifies when predicted rainfall exceeds 25mm or high wind speeds threaten spray drift.
                  </span>
                </div>
                <div className="form-check form-switch ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={alerts.rainAlerts}
                    onChange={(e) => setAlerts({ ...alerts, rainAlerts: e.target.checked })}
                    style={{ cursor: 'pointer', width: 42, height: 22 }}
                  />
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3 rounded-3 border d-flex align-items-center justify-content-between" style={{ background: '#F0FDF4' }}>
                <div>
                  <strong className="d-block text-dark small" style={{ fontSize: '0.88rem' }}>
                    📈 APMC Mandi 30-Day High Price Alerts
                  </strong>
                  <span className="text-muted small" style={{ fontSize: '0.76rem' }}>
                    Alerts you when regional wholesale market prices for your crops surge above seasonal averages.
                  </span>
                </div>
                <div className="form-check form-switch ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={alerts.mandiSpikes}
                    onChange={(e) => setAlerts({ ...alerts, mandiSpikes: e.target.checked })}
                    style={{ cursor: 'pointer', width: 42, height: 22 }}
                  />
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-3 rounded-3 border d-flex align-items-center justify-content-between" style={{ background: '#FEF2F2' }}>
                <div>
                  <strong className="d-block text-dark small" style={{ fontSize: '0.88rem' }}>
                    🐛 Regional Pest & Disease Outbreak Radar
                  </strong>
                  <span className="text-muted small" style={{ fontSize: '0.76rem' }}>
                    Proactive alerts when blight or powdery mildew spore conditions are detected in your agro-climatic zone.
                  </span>
                </div>
                <div className="form-check form-switch ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={alerts.pestWarnings}
                    onChange={(e) => setAlerts({ ...alerts, pestWarnings: e.target.checked })}
                    style={{ cursor: 'pointer', width: 42, height: 22 }}
                  />
                </div>
              </div>

              {/* Alert 4 */}
              <div className="p-3 rounded-3 border d-flex align-items-center justify-content-between" style={{ background: '#F0F9FF' }}>
                <div>
                  <strong className="d-block text-dark small" style={{ fontSize: '0.88rem' }}>
                    💧 Evapotranspiration Irrigation Prompts
                  </strong>
                  <span className="text-muted small" style={{ fontSize: '0.76rem' }}>
                    Calculates daily soil moisture loss and advises on optimal dawn/dusk drip cycles.
                  </span>
                </div>
                <div className="form-check form-switch ms-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={alerts.irrigationReminders}
                    onChange={(e) => setAlerts({ ...alerts, irrigationReminders: e.target.checked })}
                    style={{ cursor: 'pointer', width: 42, height: 22 }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-top d-flex justify-content-end">
              <button type="button" className="btn btn-warning px-4 py-2 fw-bold text-dark" onClick={handleSave}>
                Save Notification Rules
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 4: Data Management & Export */}
      {activeTab === 'data' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="card-agro p-4 mb-4 shadow-sm" style={{ borderRadius: 20, border: '1.5px solid #E2E8F0', background: '#FFFFFF' }}>
            <h5 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#0F172A', fontSize: '1.1rem' }}>
              <Sliders size={18} className="text-dark" /> Farm Data Governance & Exports
            </h5>
            <p className="text-muted small mb-4" style={{ fontSize: '0.82rem' }}>
              Export full records of your soil readings, recommendations, and farm telemetry for bank crop loan verification or agronomist review.
            </p>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-4 rounded-3 border h-100 bg-light d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-bold text-dark d-flex align-items-center gap-2">
                      <Download size={18} className="text-success" /> Export Farm Telemetry File
                    </h6>
                    <p className="text-muted small mb-3" style={{ fontSize: '0.8rem' }}>
                      Download complete JSON data packet containing your soil NPK timeline, crop rotations, and IoT configurations.
                    </p>
                  </div>
                  <button type="button" className="btn btn-outline-success fw-bold w-100 py-2" onClick={handleExportData}>
                    Download Data (JSON)
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-4 rounded-3 border h-100 bg-light d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="fw-bold text-dark d-flex align-items-center gap-2">
                      <Globe size={18} className="text-primary" /> Application Language
                    </h6>
                    <p className="text-muted small mb-3" style={{ fontSize: '0.8rem' }}>
                      Currently using <strong>{language === 'hi' ? 'हिंदी (Hindi)' : 'English'}</strong>. You can switch languages at any time.
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm w-50 py-2 fw-bold ${language === 'en' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setLanguage('en')}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm w-50 py-2 fw-bold ${language === 'hi' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setLanguage('hi')}
                    >
                      हिंदी (Hindi)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
