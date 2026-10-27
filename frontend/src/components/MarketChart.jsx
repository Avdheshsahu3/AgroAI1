import React, { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Award,
  Sparkles,
  Layers,
  LayoutGrid
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCropVisual } from '../utils/visuals'

// Curated colorful gradients and palettes for every crop
const CROP_PALETTES = {
  Cotton: { from: '#6366F1', to: '#4338CA', badgeBg: '#EEF2FF', text: '#3730A3', light: '#818CF8' },
  Groundnut: { from: '#D97706', to: '#92400E', badgeBg: '#FEF3C7', text: '#78350F', light: '#FBBF24' },
  Mustard: { from: '#EAB308', to: '#CA8A04', badgeBg: '#FEF9C3', text: '#854D0E', light: '#FDE047' },
  Chickpea: { from: '#F59E0B', to: '#B45309', badgeBg: '#FFFBEB', text: '#78350F', light: '#FCD34D' },
  Soybean: { from: '#84CC16', to: '#4D7C0F', badgeBg: '#F7FEE7', text: '#365314', light: '#A3E635' },
  Wheat: { from: '#F59E0B', to: '#D97706', badgeBg: '#FEF3C7', text: '#92400E', light: '#FCD34D' },
  Rice: { from: '#10B981', to: '#047857', badgeBg: '#ECFDF5', text: '#064E3B', light: '#34D399' },
  Maize: { from: '#F97316', to: '#C2410C', badgeBg: '#FFF7ED', text: '#7C2D12', light: '#FB923C' },
  Tomato: { from: '#EF4444', to: '#B91C1C', badgeBg: '#FEF2F2', text: '#7F1D1D', light: '#F87171' },
  Potato: { from: '#A16207', to: '#713F12', badgeBg: '#FEF3C7', text: '#451A03', light: '#CA8A04' },
  Sugarcane: { from: '#06B6D4', to: '#0E7490', badgeBg: '#ECFEFF', text: '#155E75', light: '#22D3EE' }
}

function getPalette(crop) {
  return CROP_PALETTES[crop] || {
    from: '#3B82F6',
    to: '#1D4ED8',
    badgeBg: '#EFF6FF',
    text: '#1E3A8A',
    light: '#60A5FA'
  }
}

// Custom interactive Tooltip
function CustomTooltip({ active, payload, averagePrice }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0].payload
  const { icon: CropIcon } = getCropVisual(item.name)
  const palette = getPalette(item.name)
  const isUp = item.change >= 0
  const diffFromAvg = averagePrice > 0 ? Math.round(((item.price - averagePrice) / averagePrice) * 100) : 0

  return (
    <div
      className="p-3 bg-white border rounded-3 shadow-lg"
      style={{
        minWidth: 200,
        borderColor: palette.light,
        boxShadow: `0 12px 28px -6px ${palette.from}33`
      }}
    >
      <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center rounded-2"
          style={{ width: 28, height: 28, background: palette.badgeBg, color: palette.from }}
        >
          <CropIcon size={16} />
        </div>
        <div>
          <div className="fw-bold" style={{ fontSize: '0.92rem' }}>{item.name}</div>
          <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Mandi Benchmark</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Current Rate</div>
        <div className="fw-bolder" style={{ fontSize: '1.35rem', color: palette.from, letterSpacing: '-0.02em' }}>
          ₹{item.price.toLocaleString('en-IN')}
          <span className="text-muted fw-normal ms-1" style={{ fontSize: '0.75rem' }}>/quintal</span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-1">
        <span
          className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${
            isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
          }`}
          style={{ fontSize: '0.74rem' }}
        >
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? '+' : ''}{item.change}%
        </span>
        <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
          {diffFromAvg >= 0 ? `+${diffFromAvg}% vs avg` : `${diffFromAvg}% vs avg`}
        </span>
      </div>
    </div>
  )
}

export default function MarketChart({ prices }) {
  const [sortBy, setSortBy] = useState('price-desc') // 'price-desc' | 'price-asc' | 'gainers' | 'name'
  const [viewMode, setViewMode] = useState('chart') // 'chart' | 'cards'
  const [hoveredCrop, setHoveredCrop] = useState(null)

  if (!prices || prices.length === 0) return null

  // Process data and metrics
  const { chartData, maxPrice, highestCrop, lowestCrop, averagePrice, topGainer } = useMemo(() => {
    let list = prices.map((p) => ({
      name: p.crop,
      price: p.price,
      change: p.changePercent ?? 0,
      unit: p.unit || 'quintal'
    }))

    // Sort according to selection
    if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'gainers') {
      list.sort((a, b) => b.change - a.change)
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    const pricesArr = prices.map((p) => p.price)
    const max = Math.max(...pricesArr)
    const min = Math.min(...pricesArr)
    const avg = Math.round(pricesArr.reduce((a, b) => a + b, 0) / pricesArr.length)

    const high = prices.find((p) => p.price === max)
    const low = prices.find((p) => p.price === min)
    const gainer = [...prices].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0))[0]

    return {
      chartData: list,
      maxPrice: max,
      highestCrop: high,
      lowestCrop: low,
      averagePrice: avg,
      topGainer: gainer
    }
  }, [prices, sortBy])

  return (
    <div className="card-agro shadow-sm p-4" style={{ borderRadius: '1.25rem' }}>
      {/* Title & View Toggle Controls */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #28704d, #66bb6a)'
              }}
            >
              <BarChart3 size={18} />
            </div>
            <h5 className="mb-0 fw-bold">Price Comparison</h5>
            <span
              className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill"
              style={{ fontSize: '0.7rem' }}
            >
              <Sparkles size={11} className="me-1" /> Mandi Benchmark
            </span>
          </div>
          <p className="text-muted small mb-0 mt-1" style={{ fontSize: '0.8rem' }}>
            Compare current commodity rates per quintal with dynamic crop trends
          </p>
        </div>

        {/* View Mode & Sort Toggle */}
        <div className="d-flex align-items-center gap-2">
          {/* View Mode Switcher */}
          <div className="btn-group p-1 bg-light rounded-pill border" role="group">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-1 ${
                viewMode === 'chart' ? 'bg-white shadow-sm fw-bold text-success' : 'text-muted border-0'
              }`}
              onClick={() => setViewMode('chart')}
              title="Bar Chart View"
            >
              <BarChart3 size={15} />
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-1 ${
                viewMode === 'cards' ? 'bg-white shadow-sm fw-bold text-success' : 'text-muted border-0'
              }`}
              onClick={() => setViewMode('cards')}
              title="Grid Cards View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            className="form-select form-select-sm rounded-pill border-light-subtle bg-light text-secondary fw-semibold"
            style={{ fontSize: '0.78rem', width: 'auto', cursor: 'pointer' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="price-desc">Highest Price ⬇</option>
            <option value="price-asc">Lowest Price ⬆</option>
            <option value="gainers">Top Gainers 📈</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Colorful Mini KPI Stat Badges */}
      <div className="row g-2 mb-3">
        {highestCrop && (
          <div className="col-6 col-md-3">
            <div
              className="p-2 px-3 rounded-3 border"
              style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}
            >
              <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                <Award size={12} className="text-warning" /> Top Value Crop
              </div>
              <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.88rem' }}>
                {highestCrop.crop}
              </div>
              <div className="fw-extrabold text-warning-emphasis" style={{ fontSize: '0.98rem' }}>
                ₹{highestCrop.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {topGainer && (
          <div className="col-6 col-md-3">
            <div
              className="p-2 px-3 rounded-3 border"
              style={{ background: '#ECFDF5', borderColor: '#A7F3D0' }}
            >
              <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                <TrendingUp size={12} className="text-success" /> Top Gainer
              </div>
              <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.88rem' }}>
                {topGainer.crop}
              </div>
              <div className="fw-bold text-success" style={{ fontSize: '0.98rem' }}>
                +{topGainer.changePercent}%
              </div>
            </div>
          </div>
        )}

        <div className="col-6 col-md-3">
          <div
            className="p-2 px-3 rounded-3 border"
            style={{ background: '#F0F9FF', borderColor: '#BAE6FD' }}
          >
            <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
              <Layers size={12} className="text-info" /> Mandi Average
            </div>
            <div className="fw-bold text-dark" style={{ fontSize: '0.88rem' }}>
              Benchmark
            </div>
            <div className="fw-bold text-primary" style={{ fontSize: '0.98rem' }}>
              ₹{averagePrice.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {lowestCrop && (
          <div className="col-6 col-md-3">
            <div
              className="p-2 px-3 rounded-3 border"
              style={{ background: '#F8FAFC', borderColor: '#E2E8F0' }}
            >
              <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                <ArrowUpDown size={12} className="text-secondary" /> Budget Commodity
              </div>
              <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.88rem' }}>
                {lowestCrop.crop}
              </div>
              <div className="fw-bold text-secondary" style={{ fontSize: '0.98rem' }}>
                ₹{lowestCrop.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      {viewMode === 'chart' ? (
        <div>
          <div style={{ width: '100%', height: 320 }} className="market-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 15, right: 10, left: -10, bottom: 45 }}
                onMouseMove={(state) => {
                  if (state && state.activePayload && state.activePayload.length) {
                    setHoveredCrop(state.activePayload[0].payload.name)
                  }
                }}
                onMouseLeave={() => setHoveredCrop(null)}
              >
                {/* SVG Linear Gradients for each crop */}
                <defs>
                  {chartData.map((d) => {
                    const p = getPalette(d.name)
                    return (
                      <linearGradient
                        key={`grad-${d.name}`}
                        id={`bar-grad-${d.name}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={p.from} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={p.to} stopOpacity={0.8} />
                      </linearGradient>
                    )
                  })}
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2EC" />
                <XAxis
                  dataKey="name"
                  angle={-32}
                  textAnchor="end"
                  interval={0}
                  height={55}
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  stroke="#94A3B8"
                />
                <YAxis
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  stroke="#94A3B8"
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(235, 245, 237, 0.45)', radius: 6 }}
                  content={<CustomTooltip averagePrice={averagePrice} />}
                />
                <Bar
                  dataKey="price"
                  radius={[8, 8, 2, 2]}
                  animationDuration={650}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry) => {
                    const isHovered = hoveredCrop === entry.name
                    return (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={`url(#bar-grad-${entry.name})`}
                        opacity={hoveredCrop === null || isHovered ? 1 : 0.65}
                        style={{
                          filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))' : 'none',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s, filter 0.2s'
                        }}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Color Pill Tags Bar */}
          <div className="d-flex flex-wrap gap-1 mt-2 pt-2 border-top">
            {chartData.map((d) => {
              const p = getPalette(d.name)
              const isHovered = hoveredCrop === d.name
              return (
                <button
                  key={d.name}
                  type="button"
                  className="btn btn-sm d-inline-flex align-items-center gap-1 border-0 py-1 px-2 rounded-pill transition-all"
                  style={{
                    fontSize: '0.72rem',
                    background: isHovered ? p.from : p.badgeBg,
                    color: isHovered ? '#FFFFFF' : p.text,
                    fontWeight: 600,
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={() => setHoveredCrop(d.name)}
                  onMouseLeave={() => setHoveredCrop(null)}
                >
                  <span
                    className="d-inline-block rounded-circle"
                    style={{
                      width: 7,
                      height: 7,
                      background: isHovered ? '#FFFFFF' : p.from
                    }}
                  />
                  <span>{d.name}</span>
                  <span style={{ opacity: 0.85 }}>₹{d.price}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* Visual Cards Grid Mode */
        <div className="row g-2 overflow-y-auto" style={{ maxHeight: 380 }}>
          {chartData.map((item, idx) => {
            const { icon: CropIcon } = getCropVisual(item.name)
            const palette = getPalette(item.name)
            const percentOfMax = Math.round((item.price / maxPrice) * 100)
            const isUp = item.change >= 0

            return (
              <motion.div
                key={item.name}
                className="col-12 col-sm-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <div
                  className="p-3 bg-white border rounded-3 h-100 shadow-sm transition-all"
                  style={{
                    borderLeft: `4px solid ${palette.from}`,
                    borderColor: '#EDF2EC'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2"
                        style={{
                          width: 32,
                          height: 32,
                          background: palette.badgeBg,
                          color: palette.from
                        }}
                      >
                        <CropIcon size={18} />
                      </div>
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{item.name}</div>
                        <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Rank #{idx + 1}</div>
                      </div>
                    </div>

                    <span
                      className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${
                        isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                      }`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {isUp ? '+' : ''}{item.change}%
                    </span>
                  </div>

                  <div className="d-flex align-items-baseline justify-content-between mb-1">
                    <span className="fw-bolder" style={{ fontSize: '1.25rem', color: palette.from }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      per {item.unit}
                    </span>
                  </div>

                  {/* Relative Price Ratio Bar */}
                  <div className="progress mt-2" style={{ height: 6, background: '#F1F5F9' }}>
                    <div
                      className="progress-bar rounded-pill"
                      role="progressbar"
                      style={{
                        width: `${percentOfMax}%`,
                        background: `linear-gradient(90deg, ${palette.light}, ${palette.from})`
                      }}
                      aria-valuenow={percentOfMax}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
