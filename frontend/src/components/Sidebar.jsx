import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  Bot,
  CloudSun,
  LineChart,
  ScanEye,
  Settings,
  CircleHelp,
  LogIn,
  UserPlus,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sprout,
  MessageSquare
} from 'lucide-react'
import { motion } from 'framer-motion'

// Thematic navigation configuration with vibrant custom colors, badges, and gradients
const NAV_SECTIONS = [
  {
    title: 'AGRO-INTELLIGENCE',
    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        badge: 'Live',
        icon: LayoutDashboard,
        color: '#059669',
        activeBg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        activeBorder: '#10B981',
        iconBg: '#10B981',
        desc: 'Farm Overview'
      },
      {
        to: '/chat',
        label: 'AI Agronomist Chat',
        badge: 'Gemini AI',
        icon: MessageSquare,
        color: '#2563EB',
        activeBg: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        activeBorder: '#3B82F6',
        iconBg: '#3B82F6',
        desc: 'Farming Q&A Copilot'
      },
      {
        to: '/soil',
        label: 'Soil Data & IoT',
        badge: 'NPK',
        icon: FlaskConical,
        color: '#D97706',
        activeBg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        activeBorder: '#F59E0B',
        iconBg: '#F59E0B',
        desc: 'Nutrient Telemetry'
      },
      {
        to: '/recommendation',
        label: 'AI Crop Advisory',
        badge: 'ML AI',
        icon: Bot,
        color: '#7C3AED',
        activeBg: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
        activeBorder: '#8B5CF6',
        iconBg: '#8B5CF6',
        desc: 'Agronomic Model'
      }
    ]
  },
  {
    title: 'FIELD & MARKET TOOLS',
    items: [
      {
        to: '/weather',
        label: 'Weather & Radar',
        badge: '7-Day',
        icon: CloudSun,
        color: '#0284C7',
        activeBg: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
        activeBorder: '#0EA5E9',
        iconBg: '#0284C7',
        desc: 'Atmospheric Curves'
      },
      {
        to: '/market',
        label: 'Market Prices',
        badge: 'APMC',
        icon: LineChart,
        color: '#16A34A',
        activeBg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        activeBorder: '#22C55E',
        iconBg: '#16A34A',
        desc: 'Live Mandi Rates'
      },
      {
        to: '/disease',
        label: 'Disease Scanner',
        badge: 'Vision',
        icon: ScanEye,
        color: '#DC2626',
        activeBg: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
        activeBorder: '#EF4444',
        iconBg: '#DC2626',
        desc: 'CNN Pathology'
      }
    ]
  }
]

export default function Sidebar({ farmer }) {
  const location = useLocation()

  return (
    <aside
      className="app-sidebar"
      aria-label="Main navigation"
      style={{
        background: '#FFFFFF',
        borderRight: '1.5px solid #EAEFEA',
        boxShadow: '2px 0 16px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.1rem 0.9rem'
      }}
    >
      {/* Top Links Section */}
      <div className="d-flex flex-column gap-3">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={section.title} className="mb-1">
            <div
              className="text-muted fw-bold px-2 mb-2 d-flex align-items-center justify-content-between"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.07em',
                color: '#94A3B8'
              }}
            >
              <span>{section.title}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1' }} />
            </div>

            <div className="d-flex flex-column gap-1.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.to

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="text-decoration-none transition-all"
                    style={{
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.62rem 0.75rem',
                      background: isActive ? item.activeBg : 'transparent',
                      border: isActive ? `1px solid ${item.activeBorder}44` : '1px solid transparent',
                      boxShadow: isActive ? `0 4px 14px ${item.color}15` : 'none',
                      transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#F8FAFC'
                        e.currentTarget.style.transform = 'translateX(3px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.transform = 'translateX(0px)'
                      }
                    }}
                  >
                    <div className="d-flex align-items-center gap-2.5 overflow-hidden">
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isActive ? item.iconBg : `${item.color}14`,
                          color: isActive ? '#FFFFFF' : item.color,
                          boxShadow: isActive ? `0 3px 8px ${item.color}35` : 'none',
                          flexShrink: 0,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Icon size={16} strokeWidth={isActive ? 2.2 : 2} />
                      </div>
                      <div className="overflow-hidden">
                        <div
                          className="fw-bold text-truncate"
                          style={{
                            fontSize: '0.84rem',
                            color: isActive ? item.color : '#334155',
                            lineHeight: 1.2
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          className="text-muted text-truncate"
                          style={{
                            fontSize: '0.68rem',
                            color: isActive ? `${item.color}bb` : '#94A3B8'
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    {/* Badge */}
                    <span
                      className="badge fw-bold"
                      style={{
                        background: isActive ? item.iconBg : '#F1F5F9',
                        color: isActive ? '#FFFFFF' : '#64748B',
                        fontSize: '0.62rem',
                        padding: '3px 6px',
                        borderRadius: 6,
                        flexShrink: 0
                      }}
                    >
                      {item.badge}
                    </span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile / Farm Health Widget */}
      <div className="pt-2 mt-auto d-flex flex-column gap-2">
        {farmer ? (
          <>
            {/* Colorful Farm Health Score Card */}
            <div
              className="p-3 rounded-3 shadow-xs position-relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)',
                border: '1px solid #A7F3D0'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-1.5">
                <span className="fw-bold d-flex align-items-center gap-1.5" style={{ color: '#065F46', fontSize: '0.78rem' }}>
                  <Sprout size={14} className="text-success" /> Farm Health Index
                </span>
                <span className="badge bg-success text-white fw-bold" style={{ fontSize: '0.66rem' }}>
                  94% Optimal
                </span>
              </div>

              {/* Progress bar */}
              <div className="rounded-pill overflow-hidden mb-2" style={{ height: 5, background: '#D1FAE5' }}>
                <div style={{ width: '94%', height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 999 }} />
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small text-truncate" style={{ fontSize: '0.7rem' }}>
                  📍 {farmer.location || 'Maharashtra'}
                </span>
                <NavLink
                  to="/settings"
                  className="text-decoration-none fw-bold small text-success d-inline-flex align-items-center gap-0.5"
                  style={{ fontSize: '0.72rem' }}
                >
                  Manage <ChevronRight size={11} />
                </NavLink>
              </div>
            </div>

            {/* Sub-links: Settings & Help */}
            <div className="d-flex align-items-center gap-1.5 pt-1">
              <NavLink
                to="/settings"
                className="btn btn-sm w-50 py-1.5 px-2 border d-inline-flex align-items-center justify-content-center gap-1 rounded-2 fw-semibold"
                style={{
                  fontSize: '0.75rem',
                  background: location.pathname === '/settings' || location.pathname === '/profile' ? '#E0F2FE' : '#F8FAFC',
                  color: location.pathname === '/settings' || location.pathname === '/profile' ? '#0369A1' : '#64748B',
                  borderColor: location.pathname === '/settings' || location.pathname === '/profile' ? '#BAE6FD' : '#E2E8F0'
                }}
              >
                <Settings size={13} className="text-primary" /> Settings
              </NavLink>

              <NavLink
                to="/support"
                className="btn btn-sm w-50 py-1.5 px-2 border d-inline-flex align-items-center justify-content-center gap-1 rounded-2 text-decoration-none fw-semibold"
                style={{
                  fontSize: '0.75rem',
                  background: location.pathname === '/support' ? '#EDE9FE' : '#F8FAFC',
                  color: location.pathname === '/support' ? '#6D28D9' : '#64748B',
                  borderColor: location.pathname === '/support' ? '#DDD6FE' : '#E2E8F0'
                }}
              >
                <CircleHelp size={13} style={{ color: '#7C3AED' }} /> Support
              </NavLink>
            </div>
          </>
        ) : (
          <div
            className="p-3 rounded-3 text-center border"
            style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)', borderColor: '#BBF7D0' }}
          >
            <div
              className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 38, height: 38, background: '#DCFCE7', color: '#059669' }}
            >
              <Sprout size={20} />
            </div>
            <strong className="d-block text-dark small">Grow Smarter with AgroAI</strong>
            <span className="text-muted d-block small mb-2" style={{ fontSize: '0.72rem' }}>Sign in to unlock AI crop advisory</span>
            <NavLink to="/login" className="btn btn-agro btn-sm w-100 py-1.5">
              <LogIn size={13} /> Sign in
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  )
}
