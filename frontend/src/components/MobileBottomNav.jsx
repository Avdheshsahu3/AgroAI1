import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FlaskConical,
  Bot,
  CloudSun,
  LineChart,
  ScanEye
} from 'lucide-react'

const MOBILE_TABS = [
  {
    to: '/dashboard',
    label: 'Home',
    icon: LayoutDashboard,
    color: '#059669'
  },
  {
    to: '/soil',
    label: 'Soil Lab',
    icon: FlaskConical,
    color: '#D97706'
  },
  {
    to: '/recommendation',
    label: 'Crop AI',
    icon: Bot,
    color: '#7C3AED'
  },
  {
    to: '/weather',
    label: 'Weather',
    icon: CloudSun,
    color: '#0284C7'
  },
  {
    to: '/market',
    label: 'Mandi',
    icon: LineChart,
    color: '#16A34A'
  },
  {
    to: '/disease',
    label: 'Scanner',
    icon: ScanEye,
    color: '#DC2626'
  }
]

export default function MobileBottomNav({ farmer }) {
  const location = useLocation()

  if (!farmer) return null

  return (
    <nav
      className="mobile-bottom-nav d-flex d-md-none position-fixed"
      aria-label="Mobile Navigation Bar"
      style={{
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(62px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #E2E8F0',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
        zIndex: 1030,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%'
      }}
    >
      {MOBILE_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = location.pathname === tab.to

        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className="text-decoration-none d-flex flex-column align-items-center justify-content-center position-relative py-1 flex-1"
            style={{
              flex: 1,
              height: '100%',
              minWidth: 0,
              color: isActive ? tab.color : '#64748B',
              transition: 'all 0.18s ease'
            }}
          >
            {/* Top Indicator Pill */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 24,
                  height: 3,
                  borderRadius: '0 0 4px 4px',
                  background: tab.color,
                  boxShadow: `0 2px 6px ${tab.color}66`
                }}
              />
            )}

            {/* Icon with glowing active squircle */}
            <div
              style={{
                width: 34,
                height: 28,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? `${tab.color}16` : 'transparent',
                transition: 'all 0.18s ease',
                marginBottom: 2
              }}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 1.9}
                style={{
                  color: isActive ? tab.color : '#64748B',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.15s ease'
                }}
              />
            </div>

            {/* Label */}
            <span
              className="text-truncate px-1"
              style={{
                fontSize: '0.66rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '-0.01em',
                lineHeight: 1
              }}
            >
              {tab.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
