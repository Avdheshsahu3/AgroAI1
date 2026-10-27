import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Sprout,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Layers
} from 'lucide-react'
import { authApi } from '../services/api'
import ErrorMessage from '../components/ErrorMessage'

export default function Register({ onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    location: '',
    farmArea: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        farmArea: form.farmArea ? parseFloat(form.farmArea) : null
      }
      const farmer = await authApi.register(payload)
      onLogin(farmer)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <motion.div
        className="card-agro shadow-lg overflow-hidden p-0 w-100"
        style={{
          maxWidth: 960,
          borderRadius: 24,
          border: '1.5px solid #E2E8F0',
          background: '#FFFFFF'
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="row g-0">
          {/* Left Hero Panel */}
          <div
            className="col-12 col-md-5 d-none d-md-flex flex-column justify-content-between p-4 p-lg-5 text-white position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #093320 0%, #125537 50%, #0A6755 100%)'
            }}
          >
            {/* Glow decoration */}
            <div
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <div className="position-relative" style={{ zIndex: 1 }}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <Sprout size={22} strokeWidth={2.4} />
                </div>
                <span className="fw-extrabold fs-4 tracking-tight text-white">AgroAI</span>
              </div>

              <div
                className="badge px-3 py-1.5 rounded-pill small mb-3 d-inline-flex align-items-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(4px)',
                  fontSize: '0.78rem'
                }}
              >
                <Sparkles size={13} className="me-1.5 inline-block text-warning" /> Free Farmer Onboarding
              </div>

              <h3 className="fw-bold mb-3 text-white" style={{ fontSize: '1.45rem', lineHeight: 1.3 }}>
                Empowering your farm with actionable AI telemetry
              </h3>

              <div className="d-flex flex-column gap-3.5 my-4">
                <div className="d-flex align-items-start gap-2.5 small">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                    style={{ width: 22, height: 22, background: '#A7F3D0', color: '#065F46', fontWeight: 800, fontSize: '0.78rem' }}
                  >
                    1
                  </div>
                  <div>
                    <strong className="d-block text-white" style={{ fontSize: '0.88rem' }}>Create Digital Plot Profile</strong>
                    <span className="text-white" style={{ fontSize: '0.8rem', opacity: 0.92, lineHeight: 1.35, display: 'block' }}>
                      Register acreage and regional district for hyper-local radar telemetry.
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2.5 small">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                    style={{ width: 22, height: 22, background: '#A7F3D0', color: '#065F46', fontWeight: 800, fontSize: '0.78rem' }}
                  >
                    2
                  </div>
                  <div>
                    <strong className="d-block text-white" style={{ fontSize: '0.88rem' }}>Log Soil Test or IoT Probes</strong>
                    <span className="text-white" style={{ fontSize: '0.8rem', opacity: 0.92, lineHeight: 1.35, display: 'block' }}>
                      Stream real-time NPK & moisture levels or choose regional presets.
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2.5 small">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                    style={{ width: 22, height: 22, background: '#A7F3D0', color: '#065F46', fontWeight: 800, fontSize: '0.78rem' }}
                  >
                    3
                  </div>
                  <div>
                    <strong className="d-block text-white" style={{ fontSize: '0.88rem' }}>Maximize Mandi Profits</strong>
                    <span className="text-white" style={{ fontSize: '0.8rem', opacity: 0.92, lineHeight: 1.35, display: 'block' }}>
                      Get AI crop recommendations, disease cures, and live APMC commodity tracking.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Shield */}
            <div
              className="p-3 rounded-3 position-relative d-flex align-items-center gap-2.5"
              style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              <ShieldCheck size={20} className="flex-shrink-0" style={{ color: '#A7F3D0' }} />
              <div className="small text-white" style={{ fontSize: '0.8rem', lineHeight: 1.4, opacity: 0.95 }}>
                Your agricultural data is encrypted and strictly protected. Never shared with third parties.
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="col-12 col-md-7 p-4 p-lg-5">
            <div className="mb-3.5">
              <span
                className="badge border px-3 py-1.5 small fw-semibold mb-2 d-inline-flex align-items-center gap-1.5"
                style={{
                  background: '#ECFDF5',
                  color: '#065F46',
                  borderColor: '#A7F3D0',
                  fontSize: '0.78rem',
                  borderRadius: 8
                }}
              >
                <Sparkles size={13} className="text-success" /> 100% Free Lifetime Account
              </span>
              <h2 className="fw-extrabold mb-1" style={{ fontSize: '1.65rem', letterSpacing: '-0.02em', color: '#0F2E1E' }}>
                Create Farmer Account
              </h2>
              <p className="small mb-0" style={{ fontSize: '0.86rem', color: '#475569' }}>
                Join thousands of progressive farmers modernizing with AI telemetry.
              </p>
            </div>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit}>
              <div className="row g-2.5">
                {/* Full Name */}
                <div className="col-12">
                  <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                    <User size={15} style={{ color: '#059669' }} /> Full Name
                  </label>
                  <input
                    required
                    placeholder="e.g. Ramesh Patel"
                    className="form-control form-control-lg-touch"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    style={{ fontSize: '0.9rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                  />
                </div>

                {/* Email Address */}
                <div className="col-12 col-md-6">
                  <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                    <Mail size={15} style={{ color: '#2563EB' }} /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    className="form-control form-control-lg-touch"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    style={{ fontSize: '0.9rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                  />
                </div>

                {/* Password */}
                <div className="col-12 col-md-6">
                  <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                    <Lock size={15} style={{ color: '#DC2626' }} /> Password (Min 8 chars)
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      className="form-control form-control-lg-touch pe-5"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      style={{ fontSize: '0.9rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-decoration-none"
                      style={{ color: '#64748B' }}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="col-12 col-md-6">
                  <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                    <Phone size={15} style={{ color: '#D97706' }} /> Mobile Number
                  </label>
                  <input
                    placeholder="e.g. 9876543210"
                    className="form-control form-control-lg-touch"
                    value={form.mobile}
                    onChange={(e) => update('mobile', e.target.value)}
                    style={{ fontSize: '0.9rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                  />
                </div>

                {/* Farm Area in Acres */}
                <div className="col-12 col-md-6">
                  <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                    <Layers size={15} style={{ color: '#0284C7' }} /> Farm Area (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 5.5"
                    className="form-control form-control-lg-touch"
                    value={form.farmArea}
                    onChange={(e) => update('farmArea', e.target.value)}
                    style={{ fontSize: '0.9rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                  />
                </div>

                {/* Farm Location */}
                <div className="col-12">
                  <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                    <MapPin size={15} style={{ color: '#DC2626' }} /> Farm Location (Tehsil / District, State)
                  </label>
                  <input
                    placeholder="e.g. Pune, Maharashtra or Ludhiana, Punjab"
                    className="form-control form-control-lg-touch"
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                    style={{ fontSize: '0.9rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn btn-agro w-100 py-3 mt-3.5 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
                disabled={loading}
                style={{
                  borderRadius: 14,
                  fontSize: '0.98rem',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                  color: '#FFFFFF'
                }}
              >
                {loading ? (
                  <span>Registering Farm Account...</span>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Complete Farm Registration</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-3.5 pt-3 border-top" style={{ borderColor: '#E2E8F0' }}>
              <span className="small fw-medium" style={{ fontSize: '0.86rem', color: '#475569' }}>
                Already registered with AgroAI?{' '}
                <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#059669' }}>
                  Sign In to Dashboard
                </Link>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
