import React from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Sparkles,
  Sprout,
  Droplets,
  Sun,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import { getCropVisual } from '../utils/visuals'
import { Link } from 'react-router-dom'

// Crop agronomic intelligence metadata dictionary
const CROP_INTEL = {
  Wheat: {
    scientific: 'Triticum aestivum',
    hindi: 'गेहूँ',
    season: 'Rabi (Winter)',
    duration: '110–135 Days',
    waterDemand: 'Medium (450–600 mm)',
    tempOptimal: '18°C – 25°C',
    soilPref: 'Alluvial Loam / Clay Loam',
    marketDemand: 'High (Assured MSP)',
    color: '#D97706',
    bgGrad: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FFFBEB 100%)',
    borderCol: '#FCD34D',
    accentText: '#92400E',
    alternatives: [
      { name: 'Mustard', match: 86, tag: 'Lower water requirement' },
      { name: 'Chickpea', match: 82, tag: 'Enriches soil nitrogen' }
    ]
  },
  Rice: {
    scientific: 'Oryza sativa',
    hindi: 'चावल / धान',
    season: 'Kharif (Monsoon)',
    duration: '120–150 Days',
    waterDemand: 'Very High (1100–1400 mm)',
    tempOptimal: '22°C – 34°C',
    soilPref: 'Clayey / Alluvial with high retention',
    marketDemand: 'High Liquidity (Staple)',
    color: '#059669',
    bgGrad: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #ECFDF5 100%)',
    borderCol: '#6EE7B7',
    accentText: '#065F46',
    alternatives: [
      { name: 'Maize', match: 84, tag: '60% less water usage' },
      { name: 'Soybean', match: 80, tag: 'Short duration cash crop' }
    ]
  },
  Maize: {
    scientific: 'Zea mays',
    hindi: 'मक्का',
    season: 'Kharif / Rabi',
    duration: '90–110 Days',
    waterDemand: 'Moderate (500–700 mm)',
    tempOptimal: '21°C – 30°C',
    soilPref: 'Well-drained deep loamy soil',
    marketDemand: 'High (Poultry & Starch industry)',
    color: '#CA8A04',
    bgGrad: 'linear-gradient(135deg, #FEF08A 0%, #FDE047 50%, #FEF9C3 100%)',
    borderCol: '#FACC15',
    accentText: '#854D0E',
    alternatives: [
      { name: 'Soybean', match: 85, tag: 'Restores nitrogen reserves' },
      { name: 'Groundnut', match: 79, tag: 'High oil content value' }
    ]
  },
  Cotton: {
    scientific: 'Gossypium hirsutum',
    hindi: 'कपास (सफेद सोना)',
    season: 'Kharif',
    duration: '150–180 Days',
    waterDemand: 'Moderate to High (650–850 mm)',
    tempOptimal: '25°C – 35°C',
    soilPref: 'Deep Black Cotton Soil (Regur)',
    marketDemand: 'Commercial Cash Crop',
    color: '#0284C7',
    bgGrad: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #F0F9FF 100%)',
    borderCol: '#7DD3FC',
    accentText: '#0369A1',
    alternatives: [
      { name: 'Soybean', match: 83, tag: 'Lower pest vulnerability' },
      { name: 'Groundnut', match: 78, tag: 'Short duration rotation' }
    ]
  },
  Soybean: {
    scientific: 'Glycine max',
    hindi: 'सोयाबीन',
    season: 'Kharif',
    duration: '90–105 Days',
    waterDemand: 'Moderate (550–650 mm)',
    tempOptimal: '24°C – 32°C',
    soilPref: 'Well-aerated fertile loam / black soil',
    marketDemand: 'Excellent Oil & Protein Demand',
    color: '#16A34A',
    bgGrad: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 50%, #F0FDF4 100%)',
    borderCol: '#86EFAC',
    accentText: '#15803D',
    alternatives: [
      { name: 'Maize', match: 88, tag: 'Great rotational cereal' },
      { name: 'Groundnut', match: 82, tag: 'Resistant to drought spells' }
    ]
  },
  Chickpea: {
    scientific: 'Cicer arietinum',
    hindi: 'चना',
    season: 'Rabi',
    duration: '95–115 Days',
    waterDemand: 'Low (300–450 mm)',
    tempOptimal: '15°C – 26°C',
    soilPref: 'Well-drained sandy loam / light black',
    marketDemand: 'High Pulse Demand & MSP',
    color: '#D97706',
    bgGrad: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 50%, #FFF7ED 100%)',
    borderCol: '#FDBA74',
    accentText: '#9A3412',
    alternatives: [
      { name: 'Mustard', match: 87, tag: 'Excellent intercropping partner' },
      { name: 'Wheat', match: 81, tag: 'Higher volumetric yield' }
    ]
  },
  Mustard: {
    scientific: 'Brassica juncea',
    hindi: 'सरसों',
    season: 'Rabi',
    duration: '105–125 Days',
    waterDemand: 'Low to Medium (350–500 mm)',
    tempOptimal: '15°C – 25°C',
    soilPref: 'Light to heavy loam, drought tolerant',
    marketDemand: 'High Edible Oil Extraction Demand',
    color: '#EAB308',
    bgGrad: 'linear-gradient(135deg, #FEF08A 0%, #FDE047 50%, #FEF9C3 100%)',
    borderCol: '#FACC15',
    accentText: '#854D0E',
    alternatives: [
      { name: 'Chickpea', match: 86, tag: 'Leguminous nitrogen replenisher' },
      { name: 'Wheat', match: 83, tag: 'Cereal rotation staple' }
    ]
  },
  Groundnut: {
    scientific: 'Arachis hypogaea',
    hindi: 'मूंगफली',
    season: 'Kharif / Zaid',
    duration: '105–120 Days',
    waterDemand: 'Low to Medium (400–600 mm)',
    tempOptimal: '22°C – 30°C',
    soilPref: 'Sandy loam with good loose tilth',
    marketDemand: 'High Oilseed & Confectionery Value',
    color: '#B45309',
    bgGrad: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FFFBEB 100%)',
    borderCol: '#FCD34D',
    accentText: '#78350F',
    alternatives: [
      { name: 'Soybean', match: 84, tag: 'Higher protein profile' },
      { name: 'Maize', match: 79, tag: 'Easy intercrop compatibility' }
    ]
  },
  Tomato: {
    scientific: 'Solanum lycopersicum',
    hindi: 'टमाटर',
    season: 'All Seasons',
    duration: '80–100 Days',
    waterDemand: 'High (600–800 mm)',
    tempOptimal: '20°C – 28°C',
    soilPref: 'Deep rich loam, pH 6.0–7.0',
    marketDemand: 'Daily Vegetable Market Liquidity',
    color: '#DC2626',
    bgGrad: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 50%, #FEF2F2 100%)',
    borderCol: '#FCA5A5',
    accentText: '#991B1B',
    alternatives: [
      { name: 'Potato', match: 82, tag: 'Underground tuber alternative' },
      { name: 'Chickpea', match: 75, tag: 'Soil resting legume' }
    ]
  },
  Sugarcane: {
    scientific: 'Saccharum officinarum',
    hindi: 'गन्ना',
    season: 'Perennial (Annual)',
    duration: '300–360 Days',
    waterDemand: 'Extremely High (1500–2200 mm)',
    tempOptimal: '24°C – 38°C',
    soilPref: 'Deep fertile loam with good organic matter',
    marketDemand: 'Assured Sugar Mill Crushing Contracts',
    color: '#15803D',
    bgGrad: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 50%, #F0FDF4 100%)',
    borderCol: '#86EFAC',
    accentText: '#14532D',
    alternatives: [
      { name: 'Rice', match: 80, tag: 'Seasonal rotational option' },
      { name: 'Maize', match: 76, tag: 'Fast 100-day cash cycle' }
    ]
  }
}

export default function CropRecommendationCard({
  recommendation,
  onChatWithAi,
  soil,
  weather,
  previousCrop
}) {
  if (!recommendation) {
    return (
      <div className="card-agro text-center py-5 border-dashed" style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}>
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center"
          style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', color: '#059669' }}
        >
          <Bot size={32} />
        </div>
        <h5 className="fw-bold mb-2" style={{ color: '#1E293B' }}>AI Agronomic Recommendation Engine</h5>
        <p className="text-muted mx-auto mb-3" style={{ maxWidth: 440, fontSize: '0.92rem' }}>
          Connect your farm telemetry above or choose a previous crop, then tap <strong>Get Recommendation</strong> to calculate the optimal crop.
        </p>
        <div className="d-flex align-items-center justify-content-center gap-2 text-muted small">
          <Sparkles size={14} className="text-warning" />
          <span>Calibrated for Indian soil agro-ecological zones</span>
        </div>
      </div>
    )
  }

  const cropName = recommendation.crop || 'Wheat'
  const intel = CROP_INTEL[cropName] || {
    scientific: 'Cultivated Crop',
    hindi: cropName,
    season: 'Seasonal',
    duration: '90–120 Days',
    waterDemand: 'Moderate (500–700 mm)',
    tempOptimal: '20°C – 30°C',
    soilPref: 'Fertile agricultural loam',
    marketDemand: 'Standard APMC Market Demand',
    color: '#059669',
    bgGrad: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #F0FDF4 100%)',
    borderCol: '#A7F3D0',
    accentText: '#065F46',
    alternatives: [
      { name: 'Mustard', match: 82, tag: 'Viable rotation partner' },
      { name: 'Soybean', match: 78, tag: 'Enriches organic matter' }
    ]
  }

  const { icon: CropIcon, color: defaultColor } = getCropVisual(cropName)
  const themeColor = intel.color || defaultColor
  const pct = Math.max(0, Math.min(100, Math.round(recommendation.confidence || 90)))

  // Score status indicator
  let fitBadge = { label: 'Exceptional Agronomic Match', bg: '#DCFCE7', text: '#15803D' }
  if (pct < 75) {
    fitBadge = { label: 'Moderate Agronomic Match', bg: '#FEF3C7', text: '#B45309' }
  } else if (pct < 85) {
    fitBadge = { label: 'Strong Agronomic Match', bg: '#E0F2FE', text: '#0369A1' }
  }

  return (
    <motion.div
      className="card-agro shadow-sm overflow-hidden p-0 mb-4"
      style={{ border: `1.5px solid ${intel.borderCol}`, borderRadius: 20 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Hero Banner with Crop Palette */}
      <div
        className="crop-hero-banner"
        style={{
          background: intel.bgGrad,
          padding: '1.75rem 1.6rem 1.5rem',
          borderBottom: `1px solid ${intel.borderCol}`,
          position: 'relative'
        }}
      >
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3 crop-hero-info">
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                background: '#FFFFFF',
                boxShadow: `0 8px 20px ${themeColor}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: themeColor,
                border: `2px solid ${intel.borderCol}`,
                flexShrink: 0
              }}
            >
              <CropIcon size={38} strokeWidth={2.2} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <span
                  className="badge px-2 py-1 fw-bold"
                  style={{
                    background: fitBadge.bg,
                    color: fitBadge.text,
                    fontSize: '0.74rem',
                    borderRadius: 8
                  }}
                >
                  <ShieldCheck size={12} className="me-1 inline-block" />
                  {fitBadge.label}
                </span>
                <span className="badge bg-white text-muted border px-2 py-1" style={{ fontSize: '0.74rem', borderRadius: 8 }}>
                  {intel.season}
                </span>
              </div>
              <h2 className="mb-0 fw-extrabold" style={{ color: intel.accentText, fontSize: '1.9rem', letterSpacing: '-0.02em' }}>
                {cropName}
                <span className="fw-normal text-muted ms-2" style={{ fontSize: '1.1rem' }}>
                  ({intel.hindi})
                </span>
              </h2>
              <div className="text-muted small fst-italic" style={{ fontSize: '0.82rem' }}>
                {intel.scientific}
              </div>
            </div>
          </div>

          {/* Radial Circular Confidence Gauge */}
          <div className="crop-confidence-gauge d-flex align-items-center gap-3 bg-white p-2 px-3 rounded-4 shadow-sm border" style={{ borderColor: intel.borderCol }}>
            <div style={{ position: 'relative', width: 60, height: 60 }}>
              <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="30" cy="30" r="24" stroke="#F1F5F9" strokeWidth="5.5" fill="none" />
                <circle
                  cx="30"
                  cy="30"
                  r="24"
                  stroke={themeColor}
                  strokeWidth="5.5"
                  fill="none"
                  strokeDasharray="150.8"
                  strokeDashoffset={150.8 - (150.8 * pct) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <span className="fw-bold" style={{ fontSize: '0.86rem', color: intel.accentText, lineHeight: 1 }}>
                  {pct}%
                </span>
              </div>
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: '0.86rem', color: '#1E293B' }}>Model Fit</div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>ML Confidence</div>
            </div>
          </div>
        </div>

        {/* Quick Vitals Row */}
        <div className="row g-2 mt-3 pt-2">
          <div className="col-6 col-md-3">
            <div className="bg-white bg-opacity-80 p-2 rounded-3 border" style={{ borderColor: `${intel.borderCol}88` }}>
              <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                <Calendar size={12} className="text-muted" /> Crop Duration
              </div>
              <div className="fw-bold text-dark mt-0.5" style={{ fontSize: '0.85rem' }}>{intel.duration}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="bg-white bg-opacity-80 p-2 rounded-3 border" style={{ borderColor: `${intel.borderCol}88` }}>
              <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                <Droplets size={12} className="text-primary" /> Water Demand
              </div>
              <div className="fw-bold text-dark mt-0.5" style={{ fontSize: '0.85rem' }}>{intel.waterDemand}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="bg-white bg-opacity-80 p-2 rounded-3 border" style={{ borderColor: `${intel.borderCol}88` }}>
              <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                <Sun size={12} className="text-warning" /> Optimal Temp
              </div>
              <div className="fw-bold text-dark mt-0.5" style={{ fontSize: '0.85rem' }}>{intel.tempOptimal}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="bg-white bg-opacity-80 p-2 rounded-3 border" style={{ borderColor: `${intel.borderCol}88` }}>
              <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                <TrendingUp size={12} className="text-success" /> Market Demand
              </div>
              <div className="fw-bold text-dark mt-0.5" style={{ fontSize: '0.85rem' }}>{intel.marketDemand}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-3 p-md-4">
        {/* 4 Colorful Agronomic Suitability Bento Tiles */}
        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#334155' }}>
          <Sparkles size={16} className="text-success" /> Agronomic Compatibility Matrix
        </h6>

        <div className="row g-3 mb-4">
          {/* Tile 1: Soil Chemistry */}
          <div className="col-12 col-md-6">
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
                border: '1px solid #BBF7D0'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold d-flex align-items-center gap-2" style={{ color: '#166534', fontSize: '0.88rem' }}>
                  <Layers size={16} className="text-success" /> Soil Chemistry Alignment
                </span>
                <span className="badge bg-success bg-opacity-20 text-success border border-success-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
                  Excellent
                </span>
              </div>
              <p className="text-muted small mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                Best suited for <strong>{intel.soilPref}</strong>. Your recorded NPK density & pH align well with root nutrient absorption thresholds.
              </p>
              {soil && (
                <div className="d-flex gap-1 flex-wrap pt-1 border-top border-success-subtle">
                  <span className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>N: {soil.nitrogen} kg/ha</span>
                  <span className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>P: {soil.phosphorus} kg/ha</span>
                  <span className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>K: {soil.potassium} kg/ha</span>
                  <span className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>pH: {soil.ph}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tile 2: Climate & Thermal Sync */}
          <div className="col-12 col-md-6">
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)',
                border: '1px solid #BAE6FD'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold d-flex align-items-center gap-2" style={{ color: '#0369A1', fontSize: '0.88rem' }}>
                  <Sun size={16} className="text-info" /> Climate & Weather Sync
                </span>
                <span className="badge bg-info bg-opacity-20 text-info border border-info-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
                  In Window
                </span>
              </div>
              <p className="text-muted small mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                Current thermal and humidity conditions support vegetative vigor and seed/pod development.
              </p>
              {weather && (
                <div className="d-flex gap-1 flex-wrap pt-1 border-top border-info-subtle">
                  <span className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>Temp: {Math.round(weather.temperature)}°C</span>
                  <span className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>Humidity: {Math.round(weather.humidity)}%</span>
                  <span className="badge bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>Rain: {Math.round(weather.rainfall)} mm</span>
                </div>
              )}
            </div>
          </div>

          {/* Tile 3: Rotation Synergy */}
          <div className="col-12 col-md-6">
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
                border: '1px solid #E9D5FF'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold d-flex align-items-center gap-2" style={{ color: '#6B21A8', fontSize: '0.88rem' }}>
                  <Sprout size={16} className="text-purple" /> Crop Rotation Synergy
                </span>
                <span className="badge bg-purple bg-opacity-10 text-purple border border-purple-subtle fw-semibold" style={{ fontSize: '0.7rem', color: '#6B21A8', borderColor: '#E9D5FF' }}>
                  Balanced
                </span>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                {previousCrop
                  ? `Cultivating ${cropName} following ${previousCrop} breaks common weed/pest cycles and balances micronutrient uptake.`
                  : `Starting fresh or following fallow allows ${cropName} full access to undisturbed rhizosphere microbes.`}
              </p>
            </div>
          </div>

          {/* Tile 4: Market & Financial Potential */}
          <div className="col-12 col-md-6">
            <div
              className="p-3 rounded-3 h-100"
              style={{
                background: 'linear-gradient(135deg, #FEFCE8 0%, #FFFBEB 100%)',
                border: '1px solid #FDE68A'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold d-flex align-items-center gap-2" style={{ color: '#854D0E', fontSize: '0.88rem' }}>
                  <TrendingUp size={16} className="text-warning" /> APMC Market Outlook
                </span>
                <span className="badge bg-warning bg-opacity-20 text-warning border border-warning-subtle fw-semibold" style={{ fontSize: '0.7rem', color: '#854D0E' }}>
                  High Liquidity
                </span>
              </div>
              <p className="text-muted small mb-1" style={{ fontSize: '0.8rem', lineHeight: 1.45 }}>
                Strong procurement demand across regional mandis. Check live prices before harvesting for peak price realization.
              </p>
              <Link to="/market" className="text-decoration-none small fw-bold d-inline-flex align-items-center gap-1 mt-1" style={{ color: '#B45309', fontSize: '0.76rem' }}>
                View Mandi Price Trends <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* AI Rationale Breakdown ("Why This Crop?") */}
        <div className="mb-4">
          <div className="p-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <h6 className="fw-bold mb-2.5 d-flex align-items-center gap-2" style={{ color: '#1E293B', fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} className="text-success" /> Why this crop is recommended for your land:
            </h6>
            <div className="d-flex flex-column gap-2">
              {(recommendation.reasons || []).map((reason, idx) => (
                <div key={idx} className="d-flex align-items-start gap-2.5 bg-white p-2.5 rounded-2 border border-slate-200">
                  <div
                    className="flex-shrink-0 mt-0.5 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 18, height: 18, background: '#DCFCE7', color: '#16A34A', fontSize: '0.7rem', fontWeight: 'bold' }}
                  >
                    ✓
                  </div>
                  <span className="text-dark small" style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alternative Secondary Crops Strip */}
        {intel.alternatives && intel.alternatives.length > 0 && (
          <div className="mb-4 p-3 rounded-3" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.04em', fontSize: '0.74rem' }}>
                🔄 Viable Alternative / Companion Choices
              </span>
              <span className="badge bg-white text-muted border small" style={{ fontSize: '0.68rem' }}>Multi-Crop Strategy</span>
            </div>
            <div className="row g-2">
              {intel.alternatives.map((alt, i) => (
                <div key={i} className="col-12 col-sm-6">
                  <div className="bg-white p-2.5 rounded-2 border d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-bold text-dark small">{alt.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>{alt.tag}</div>
                    </div>
                    <span className="badge bg-light text-dark border fw-bold" style={{ fontSize: '0.74rem' }}>
                      {alt.match}% match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="pt-3 border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            {onChatWithAi && (
              <button
                type="button"
                className="btn btn-agro d-inline-flex align-items-center gap-2 px-3 py-2"
                onClick={() => onChatWithAi(cropName)}
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 4px 14px rgba(5,150,105,0.25)'
                }}
              >
                <MessageSquare size={16} /> Chat with AI about {cropName}
              </button>
            )}
            <Link
              to="/market"
              className="btn btn-outline-secondary d-inline-flex align-items-center gap-1 px-3 py-2 text-dark bg-white"
              style={{ fontSize: '0.85rem', fontWeight: 600 }}
            >
              <TrendingUp size={15} className="text-success" /> Mandi Prices
            </Link>
          </div>
          <span className="text-muted small fst-italic" style={{ fontSize: '0.74rem' }}>
            AI suggestion based on agro-meteorological data.
          </span>
        </div>
      </div>
    </motion.div>
  )
}
