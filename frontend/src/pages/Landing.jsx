import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CloudSun,
  Bot,
  LineChart,
  Sprout,
  ArrowRight,
  FlaskConical,
  ScanEye,
  MessageSquare,
  ShieldCheck,
  Zap,
  TrendingUp,
  Droplets,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react'
import FieldIllustration from '../components/FieldIllustration'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' }
  })
}

// 6 Core Modules with individual vibrant themes
const MODULES = [
  {
    icon: FlaskConical,
    title: 'NPK Soil Diagnostics & IoT',
    color: '#D97706',
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    border: '#FDE68A',
    badge: 'Lab & Serial USB',
    desc: 'Record Nitrogen, Phosphorus, Potassium, pH and moisture manually or stream live readings directly from USB/Serial soil sensor probes.'
  },
  {
    icon: Bot,
    title: 'AI Crop Recommendation',
    color: '#7C3AED',
    bg: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
    border: '#DDD6FE',
    badge: 'Multi-Variable ML',
    desc: 'Machine learning algorithms synthesize soil chemistry, micro-climate weather, and previous crop rotations to predict optimal yields.'
  },
  {
    icon: CloudSun,
    title: 'Micro-Climate Weather & Graphs',
    color: '#0284C7',
    bg: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
    border: '#BAE6FD',
    badge: '7-Day Radar Telemetry',
    desc: 'Interactive Recharts temperature curves, precipitation accumulation bars, and knapsack pesticide spray feasibility windows.'
  },
  {
    icon: LineChart,
    title: 'Live APMC Mandi Prices',
    color: '#16A34A',
    bg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    border: '#BBF7D0',
    badge: 'Market Benchmarks',
    desc: 'Track wholesale agricultural commodity rates across major mandis with real-time price comparison charts and profit advisories.'
  },
  {
    icon: ScanEye,
    title: 'Computer Vision Pathology',
    color: '#DC2626',
    bg: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
    border: '#FECACA',
    badge: 'CNN Leaf Scanner',
    desc: 'Scan leaf photos to diagnose early blight, powdery mildew, and leaf spots with precise chemical & organic spray dosage schedules.'
  },
  {
    icon: MessageSquare,
    title: 'Agronomist AI Copilot',
    color: '#0D9488',
    bg: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
    border: '#99F6E4',
    badge: '24/7 AI Chatbot',
    desc: 'Ask complex agronomic questions about fertilizer split-dosages, weed control, drip irrigation cycles, and pest mitigation.'
  }
]

// Agricultural Impact Metrics
const METRICS = [
  { value: '95%+', label: 'Agronomic Diagnostic Accuracy', sub: 'Calibrated for Indian Soil Zones' },
  { value: '150+', label: 'APMC Mandis Monitored', sub: 'Real-time wholesale pricing' },
  { value: '10,000+', label: 'Acres Under AI Advisory', sub: 'Active farmer acreage' },
  { value: '< 2s', label: 'Real-Time Neural Inference', sub: 'Instant recommendations' }
]

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div
        className="landing-hero-section position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(130deg, #093320 0%, #125537 40%, #0A6755 75%, #15803D 100%)',
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(255,255,255,0.15)'
        }}
      >
        {/* Glow Orbs */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -80,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(253,224,71,0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container position-relative" style={{ maxWidth: 1200 }}>
          <div className="row align-items-center g-5">
            <motion.div className="col-lg-6" initial="hidden" animate="show" variants={fadeUp} custom={0}>
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                <Sparkles size={14} className="text-warning" />
                <span>NEXT-GEN AI FOR PRECISION FARMING • 2026</span>
              </div>

              <h1
                className="display-5 fw-extrabold mb-3 text-white"
                style={{
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)'
                }}
              >
                Data-Driven Precision Farming Powered by{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #A7F3D0 0%, #FDE68A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Artificial Intelligence
                </span>
              </h1>

              <p className="lead mb-4 text-white-50" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                Empowering farmers with hyper-local weather telemetry, NPK soil diagnostics, machine learning crop selection, live APMC mandi pricing, and neural disease pathology.
              </p>

              <div className="landing-hero-actions d-flex gap-3 flex-wrap align-items-center mb-4">
                <Link
                  to="/register"
                  className="btn btn-light btn-lg px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow"
                  style={{
                    borderRadius: 14,
                    fontSize: '1rem',
                    color: '#0F2E1E'
                  }}
                >
                  Get Started Free <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg px-4 py-3 fw-bold d-inline-flex align-items-center gap-2"
                  style={{
                    borderRadius: 14,
                    fontSize: '1rem',
                    borderWidth: '1.5px'
                  }}
                >
                  Sign In to Dashboard
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="d-flex align-items-center gap-3 text-white-50 small flex-wrap pt-2 border-top border-white border-opacity-10">
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-success" /> Free for Smallholders
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-success" /> Web Serial IoT Support
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-success" /> Hindi & English Multi-lingual
                </span>
              </div>
            </motion.div>

            {/* Right Interactive Visual Showcase */}
            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="position-relative">
                <FieldIllustration className="w-100 shadow-lg rounded-4" style={{ maxHeight: 380 }} />

                {/* Floating Telemetry Badge 1: Weather */}
                <motion.div
                  className="landing-badge-weather position-absolute p-2.5 px-3 rounded-3 shadow-lg d-flex align-items-center gap-2 border"
                  style={{
                    top: 20,
                    right: -10,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderColor: '#BAE6FD'
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CloudSun size={20} className="text-primary" />
                  <div>
                    <div className="fw-bold text-dark small" style={{ fontSize: '0.8rem' }}>28°C • Clear Sky</div>
                    <div className="text-muted" style={{ fontSize: '0.68rem' }}>Pune Radar • 0 mm Rain</div>
                  </div>
                </motion.div>

                {/* Floating Telemetry Badge 2: Crop AI */}
                <motion.div
                  className="landing-badge-crop position-absolute p-2.5 px-3 rounded-3 shadow-lg d-flex align-items-center gap-2 border"
                  style={{
                    bottom: 25,
                    left: -15,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderColor: '#DDD6FE'
                  }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Bot size={20} style={{ color: '#7C3AED' }} />
                  <div>
                    <div className="fw-bold text-dark small" style={{ fontSize: '0.8rem' }}>Wheat Recommended</div>
                    <div className="text-success fw-bold" style={{ fontSize: '0.68rem' }}>94% Model Match</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Metrics Counter Bar */}
      <div className="py-4 border-bottom bg-white">
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="row g-3 text-center">
            {METRICS.map((metric, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="p-2">
                  <div
                    className="fw-extrabold"
                    style={{
                      fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)',
                      color: '#0F2E1E',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {metric.value}
                  </div>
                  <div className="fw-bold text-dark small" style={{ fontSize: '0.84rem' }}>{metric.label}</div>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>{metric.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comprehensive 6-Pillar Ecosystem Grid */}
      <div className="container py-5" style={{ maxWidth: 1200 }}>
        <div className="text-center mb-5">
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill fw-bold text-uppercase" style={{ fontSize: '0.72rem' }}>
            Complete Agro-Tech Suite
          </span>
          <h2 className="fw-extrabold mt-2 mb-2" style={{ fontSize: '2.1rem', color: '#0F2E1E' }}>
            Everything You Need for High-Yield Agriculture
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 600, fontSize: '0.94rem' }}>
            Six interconnected modules engineered to optimize your inputs, protect crop health, and maximize harvest profit realization.
          </p>
        </div>

        <div className="row g-4">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon
            return (
              <motion.div
                className="col-12 col-md-6 col-lg-4"
                key={mod.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                custom={i}
              >
                <div
                  className="card-agro h-100 p-4 shadow-sm border transition-all position-relative"
                  style={{
                    borderRadius: 20,
                    borderColor: mod.border,
                    background: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 14px 28px ${mod.color}18`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-soft)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: mod.bg,
                        color: mod.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1.5px solid ${mod.border}`,
                        boxShadow: `0 4px 12px ${mod.color}22`
                      }}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <span
                      className="badge fw-bold"
                      style={{
                        background: `${mod.color}15`,
                        color: mod.color,
                        fontSize: '0.7rem',
                        padding: '4px 8px',
                        borderRadius: 8
                      }}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  <h5 className="fw-bold mb-2" style={{ color: '#1E293B', fontSize: '1.1rem' }}>
                    {mod.title}
                  </h5>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.86rem', lineHeight: 1.55 }}>
                    {mod.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* How It Works - 3 Easy Steps */}
      <div className="py-5" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="text-center mb-4">
            <span className="badge bg-light text-muted border px-3 py-1 rounded-pill small fw-bold">
              Simple 3-Step Workflow
            </span>
            <h3 className="fw-extrabold mt-2 text-dark">How AgroAI Powers Your Farm</h3>
          </div>

          <div className="row g-4 text-center">
            <div className="col-12 col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-xs">
                <div
                  className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 44, height: 44, background: '#DCFCE7', color: '#16A34A', fontSize: '1.1rem' }}
                >
                  1
                </div>
                <h6 className="fw-bold text-dark">Input Soil & Region</h6>
                <p className="text-muted small mb-0">
                  Log your latest laboratory NPK readings, connect an IoT sensor probe, or pick a regional soil preset.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-xs">
                <div
                  className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 44, height: 44, background: '#E0F2FE', color: '#0284C7', fontSize: '1.1rem' }}
                >
                  2
                </div>
                <h6 className="fw-bold text-dark">ML Synthesis</h6>
                <p className="text-muted small mb-0">
                  Our models cross-reference live Open-Meteo satellite weather, temperature swings, and rotation history.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="p-4 bg-white rounded-4 border h-100 shadow-xs">
                <div
                  className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 44, height: 44, background: '#FEF3C7', color: '#D97706', fontSize: '1.1rem' }}
                >
                  3
                </div>
                <h6 className="fw-bold text-dark">Harvest Profitably</h6>
                <p className="text-muted small mb-0">
                  Receive tailored fertilizer plans, spray drift warnings, disease cures, and optimal mandi timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vibrant Closing CTA Banner */}
      <div className="container py-5" style={{ maxWidth: 1080 }}>
        <div
          className="p-5 text-center text-white rounded-5 shadow-lg position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #0D9488 100%)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div className="position-relative" style={{ zIndex: 1 }}>
            <h2 className="fw-extrabold text-white mb-3" style={{ fontSize: '2.2rem' }}>
              Ready to Maximize Your Farm's Potential?
            </h2>
            <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: 540, fontSize: '1rem' }}>
              Join thousands of progressive farmers leveraging artificial intelligence for healthier soils, lower input costs, and bumper yields.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link
                to="/register"
                className="btn btn-light btn-lg px-4 py-3 fw-bold text-success shadow d-inline-flex align-items-center gap-2 rounded-4"
                style={{ fontSize: '1rem', color: '#064E3B' }}
              >
                Register Your Farm Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-4"
                style={{ fontSize: '1rem' }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
