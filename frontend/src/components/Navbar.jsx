import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../i18n'
import {
  Sprout,
  LayoutDashboard,
  FlaskConical,
  Bot,
  CloudSun,
  LineChart,
  ScanEye,
  UserRound,
  LogOut,
  Menu,
  X,
  Languages,
  Sparkles,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Zap,
  MessageSquare,
  Settings,
  CircleHelp
} from 'lucide-react'

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#059669' },
  { to: '/chat', label: 'AI Agronomist Chat', icon: MessageSquare, color: '#2563EB' },
  { to: '/soil', label: 'Soil Data & IoT', icon: FlaskConical, color: '#D97706' },
  { to: '/recommendation', label: 'Crop Advisory', icon: Bot, color: '#7C3AED' },
  { to: '/weather', label: 'Weather Radar', icon: CloudSun, color: '#0284C7' },
  { to: '/market', label: 'Market Prices', icon: LineChart, color: '#16A34A' },
  { to: '/disease', label: 'Disease Scanner', icon: ScanEye, color: '#DC2626' },
  { to: '/settings', label: 'Farm Settings', icon: Settings, color: '#475569' },
  { to: '/support', label: 'Help & Support', icon: CircleHelp, color: '#0284C7' }
]

export default function Navbar({ farmer, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const { language, setLanguage } = useLanguage()

  function handleLogout() {
    setOpen(false)
    onLogout()
    navigate('/login')
  }

  // Generate farmer initial for avatar
  const farmerInitial = farmer?.name ? farmer.name.trim()[0].toUpperCase() : 'F'

  return (
    <nav
      className="navbar navbar-expand-lg navbar-agro fixed-top p-0"
      style={{
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #EAEFEA',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        zIndex: 1040,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 68
      }}
    >
      {/* Radiant Top Micro-Gradient Accent Line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2.5,
          background: 'linear-gradient(90deg, #059669 0%, #10B981 25%, #06B6D4 50%, #8B5CF6 75%, #F59E0B 100%)',
          zIndex: 10
        }}
      />

      <div className="container-fluid px-3 px-md-4 py-2">
        <div className="d-flex align-items-center justify-content-between w-100">
          {/* Left Brand Identity */}
          <div className="d-flex align-items-center gap-3">
            <NavLink
              className="navbar-brand d-flex align-items-center gap-2.5 text-decoration-none m-0"
              to="/"
              onClick={() => setOpen(false)}
            >
              {/* Glowing Sprout Squircle Icon */}
              <div
                className="navbar-agro-sprout-icon"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Sprout size={22} strokeWidth={2.4} />
              </div>

              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-1.5">
                  <span
                    className="fw-extrabold"
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '1.25rem',
                      letterSpacing: '-0.03em',
                      color: '#0F2E1E'
                    }}
                  >
                    AgroAI
                  </span>
                  <span
                    className="badge rounded-pill fw-bold"
                    style={{
                      background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                      color: '#059669',
                      border: '1px solid #A7F3D0',
                      fontSize: '0.62rem',
                      padding: '2px 7px'
                    }}
                  >
                    PRO AI
                  </span>
                </div>
                <span className="text-muted small d-none d-sm-inline" style={{ fontSize: '0.68rem', marginTop: -2 }}>
                  Intelligent Agriculture Suite
                </span>
              </div>
            </NavLink>

            {/* Live Telemetry Status Pill (Visible on Desktop) */}
            {farmer && (
              <div
                className="d-none d-xl-flex align-items-center gap-2 px-2.5 py-1 rounded-pill ms-2"
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  fontSize: '0.74rem'
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                    animation: 'pulse 2s infinite'
                  }}
                />
                <span className="fw-semibold text-success">Telemetry Online</span>
                <span className="text-muted">•</span>
                <span className="text-muted d-flex align-items-center gap-1">
                  <MapPin size={11} className="text-danger" />
                  {farmer.location || 'India'}
                </span>
              </div>
            )}
          </div>

          {/* Right Actions Cluster */}
          <div className="d-flex align-items-center gap-2">
            {/* Language Selector Pill */}
            <div
              className="navbar-lang-pill d-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border shadow-xs"
              style={{
                background: '#FFFFFF',
                borderColor: '#E2E8F0',
                fontSize: '0.8rem'
              }}
            >
              <Languages size={15} className="text-primary" />
              <select
                aria-label="Language selection"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#334155',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            {farmer ? (
              <>
                {/* Farmer Profile Pill */}
                <NavLink
                  to="/profile"
                  className="text-decoration-none d-flex align-items-center gap-1.5 p-1 pe-1 pe-md-3 rounded-pill border transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                    borderColor: '#E2E8F0'
                  }}
                  title={farmer.name}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#10B981')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                      flexShrink: 0
                    }}
                  >
                    {farmerInitial}
                  </div>
                  <div className="d-none d-md-flex flex-column text-start">
                    <span className="fw-bold text-dark text-truncate" style={{ fontSize: '0.82rem', maxWidth: 110, lineHeight: 1.2 }}>
                      {farmer.name}
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.66rem' }}>
                      Verified Farmer
                    </span>
                  </div>
                </NavLink>

                {/* Logout Button */}
                <button
                  type="button"
                  className="btn btn-sm btn-light border px-2 px-md-2.5 py-1.5 rounded-pill d-none d-sm-flex align-items-center gap-1.5 text-muted transition-all"
                  style={{ fontSize: '0.78rem' }}
                  onClick={handleLogout}
                  title="Logout"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#DC2626'
                    e.currentTarget.style.borderColor = '#FCA5A5'
                    e.currentTarget.style.background = '#FEF2F2'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = ''
                    e.currentTarget.style.borderColor = '#E2E8F0'
                    e.currentTarget.style.background = ''
                  }}
                >
                  <LogOut size={14} />
                  <span className="d-none d-md-inline fw-semibold">Logout</span>
                </button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-1.5">
                <NavLink
                  to="/login"
                  className="btn btn-sm btn-light border px-2.5 py-1.5 rounded-pill fw-semibold text-dark"
                  style={{ fontSize: '0.8rem' }}
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-sm btn-agro px-3 py-1.5 rounded-pill fw-bold text-white shadow-xs d-none d-sm-inline-flex"
                  style={{ fontSize: '0.8rem' }}
                >
                  Register Free
                </NavLink>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="btn btn-sm btn-light border d-lg-none p-1.5 rounded-3 ms-1 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X size={20} className="text-dark" /> : <Menu size={20} className="text-dark" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              className="d-lg-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                top: 68,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 1038
              }}
            />

            {/* Drawer Sheet */}
            <motion.div
              className="d-lg-none w-100 px-3 pb-4 border-top bg-white"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 68,
                left: 0,
                right: 0,
                zIndex: 1039,
                maxHeight: 'calc(100vh - 68px)',
                overflowY: 'auto',
                boxShadow: '0 20px 30px rgba(0,0,0,0.15)',
                borderBottomLeftRadius: 18,
                borderBottomRightRadius: 18
              }}
            >
              {/* Drawer Header with Language Switcher */}
              <div className="d-flex align-items-center justify-content-between pt-3 pb-2 border-bottom mb-2">
                <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  {farmer ? 'AgroAI Agricultural Suite' : 'Explore AgroAI Features'}
                </span>
                <div
                  className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill border bg-light"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Languages size={13} className="text-primary" />
                  <select
                    aria-label="Language selection"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#334155',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="en">EN</option>
                    <option value="hi">हिन्दी</option>
                  </select>
                </div>
              </div>

              {/* Navigation Links (Accessible to both logged in and guest users) */}
              <div className="d-flex flex-column gap-1.5 mb-3">
                {LINKS.map(({ to, label, icon: Icon, color }) => {
                  const isActive = location.pathname === to
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className="p-2 px-3 rounded-3 text-decoration-none d-flex align-items-center justify-content-between"
                      style={{
                        background: isActive ? `${color}15` : '#F8FAFC',
                        border: isActive ? `1px solid ${color}44` : '1px solid transparent',
                        transition: 'background 0.15s ease'
                      }}
                      onClick={() => setOpen(false)}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: isActive ? color : `${color}18`,
                            color: isActive ? '#FFFFFF' : color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="fw-bold" style={{ fontSize: '0.86rem', color: isActive ? color : '#334155' }}>
                          {label}
                        </span>
                      </div>
                      <ChevronDown size={14} className="text-muted" style={{ transform: 'rotate(-90deg)' }} />
                    </NavLink>
                  )
                })}
              </div>

              {/* Footer Auth Actions */}
              {farmer ? (
                <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                  <NavLink
                    to="/profile"
                    className="d-flex align-items-center gap-2 text-decoration-none text-dark fw-bold small"
                    onClick={() => setOpen(false)}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#10B981',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.74rem',
                        fontWeight: 800
                      }}
                    >
                      {farmerInitial}
                    </div>
                    <span>{farmer.name}</span>
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger px-3 py-1.5 rounded-pill small fw-semibold d-flex align-items-center gap-1"
                    onClick={handleLogout}
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2 pt-2 border-top">
                  <NavLink
                    to="/login"
                    className="btn btn-light border w-50 py-2 small fw-bold text-dark rounded-3"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="btn btn-agro w-50 py-2 small fw-bold text-white rounded-3 shadow-xs"
                    onClick={() => setOpen(false)}
                  >
                    Register Free
                  </NavLink>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
