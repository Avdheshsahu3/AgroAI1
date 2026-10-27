import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sprout,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import { authApi } from '../services/api'
import ErrorMessage from '../components/ErrorMessage'

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
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
      const farmer = await authApi.login(form)
      onLogin(farmer)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <motion.div
        className="card-agro shadow-lg overflow-hidden p-0 w-100"
        style={{
          maxWidth: 880,
          borderRadius: 24,
          border: '1.5px solid #E2E8F0',
          background: '#FFFFFF'
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="row g-0">
          {/* Left Hero Brand Panel (Hidden on mobile) */}
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
                width: 180,
                height: 180,
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
                <Sparkles size={13} className="me-1.5 inline-block text-warning" /> Precision Agriculture
              </div>

              <h3 className="fw-bold mb-3 text-white" style={{ fontSize: '1.45rem', lineHeight: 1.3 }}>
                Welcome back to your smart farming cockpit
              </h3>

              <div className="d-flex flex-column gap-3 my-4">
                <div className="d-flex align-items-center gap-2.5 small">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 22, height: 22, background: '#A7F3D0', color: '#065F46', fontWeight: 800, fontSize: '0.8rem' }}
                  >
                    ✓
                  </div>
                  <span className="text-white fw-semibold" style={{ fontSize: '0.86rem' }}>AI Crop Suitability Recommendations</span>
                </div>
                <div className="d-flex align-items-center gap-2.5 small">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 22, height: 22, background: '#A7F3D0', color: '#065F46', fontWeight: 800, fontSize: '0.8rem' }}
                  >
                    ✓
                  </div>
                  <span className="text-white fw-semibold" style={{ fontSize: '0.86rem' }}>Real-time NPK Soil Diagnostics</span>
                </div>
                <div className="d-flex align-items-center gap-2.5 small">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 22, height: 22, background: '#A7F3D0', color: '#065F46', fontWeight: 800, fontSize: '0.8rem' }}
                  >
                    ✓
                  </div>
                  <span className="text-white fw-semibold" style={{ fontSize: '0.86rem' }}>Live APMC Mandi Price Intelligence</span>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div
              className="p-3 rounded-3 position-relative"
              style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)' }}
            >
              <p className="small mb-1.5 fst-italic text-white" style={{ fontSize: '0.82rem', lineHeight: 1.45, opacity: 0.95 }}>
                "AgroAI helped me optimize my urea top-dressing and choose the highest-paying APMC market."
              </p>
              <div className="fw-bold small" style={{ fontSize: '0.78rem', color: '#A7F3D0' }}>
                — Ramesh Patel, Progressive Farmer (MH)
              </div>
            </div>
          </div>

          {/* Right Login Form Panel */}
          <div className="col-12 col-md-7 p-4 p-lg-5 d-flex flex-column justify-content-center">
            <div className="mb-4">
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
                <ShieldCheck size={13} className="text-success" /> Secure Authentication
              </span>
              <h2 className="fw-extrabold mb-1" style={{ fontSize: '1.65rem', letterSpacing: '-0.02em', color: '#0F2E1E' }}>
                Farmer Sign In
              </h2>
              <p className="small mb-0" style={{ fontSize: '0.86rem', color: '#475569' }}>
                Enter your registered credentials to access your farm diagnostics.
              </p>
            </div>

            <ErrorMessage message={error} />

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.86rem', color: '#1E293B' }}>
                  <Mail size={15} style={{ color: '#059669' }} /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="farmer@example.com"
                  className="form-control form-control-lg-touch"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  style={{ fontSize: '0.92rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-1.5 fw-bold" style={{ fontSize: '0.86rem', color: '#1E293B' }}>
                  <Lock size={15} style={{ color: '#059669' }} /> Password
                </label>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    className="form-control form-control-lg-touch pe-5"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    style={{ fontSize: '0.92rem', color: '#0F172A', background: '#FFFFFF', borderColor: '#CBD5E1' }}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-3 text-decoration-none"
                    style={{ color: '#64748B' }}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn btn-agro w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
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
                  <span>Signing In...</span>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: '#E2E8F0' }}>
              <span className="small fw-medium" style={{ fontSize: '0.86rem', color: '#475569' }}>
                Don't have an account yet?{' '}
                <Link to="/register" className="fw-bold text-decoration-none" style={{ color: '#059669' }}>
                  Create a Free Farm Account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
