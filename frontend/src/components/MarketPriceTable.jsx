import React, { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Store,
  Search,
  Filter,
  X,
  Sparkles,
  LayoutList,
  LayoutGrid,
  Info,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCropVisual } from '../utils/visuals'

const CROP_STYLES = {
  Cotton: { color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', tag: 'Cash Crop', demand: 'High Demand 🔥', advice: 'Mandi demand is robust. Favorable window for selling.' },
  Groundnut: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', tag: 'Oilseed', demand: 'Stable ⚖️', advice: 'Prices are holding steady with regular mill arrivals.' },
  Mustard: { color: '#EAB308', bg: '#FEF9C3', border: '#FDE047', tag: 'Oilseed', demand: 'Strong Trend 🚀', advice: 'Bullish oilseed market; premium rates for high-oil cultivars.' },
  Chickpea: { color: '#F59E0B', bg: '#FFFBEB', border: '#FCD34D', tag: 'Pulse', demand: 'High Demand 🔥', advice: 'Festive demand driving steady procurement at key mandis.' },
  Soybean: { color: '#84CC16', bg: '#F7FEE7', border: '#D9F99D', tag: 'Pulse', demand: 'Active Trading 📈', advice: 'Export demand supporting crush margins and price floors.' },
  Wheat: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', tag: 'Cereal', demand: 'Peak Season 🌾', advice: 'MSP procurement and steady flour mill bids supporting rates.' },
  Rice: { color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', tag: 'Cereal', demand: 'High Volume 💧', advice: 'Paddy arrivals steady. Quality grade commands premium.' },
  Maize: { color: '#F97316', bg: '#FFF7ED', border: '#FFEDD5', tag: 'Cereal', demand: 'Stable ⚖️', advice: 'Poultry and starch industry demand maintaining steady rates.' },
  Tomato: { color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', tag: 'Vegetable', demand: 'Volatile ⚡', advice: 'Perishable commodity; monitor daily mandi supply fluctuations.' },
  Potato: { color: '#A16207', bg: '#FEF3C7', border: '#FDE68A', tag: 'Tuber', demand: 'Steady 📦', advice: 'Cold storage stock flow determines near-term spot rates.' },
  Sugarcane: { color: '#06B6D4', bg: '#ECFEFF', border: '#A5F3FC', tag: 'Cash Crop', demand: 'Contract Rate 📑', advice: 'Sugar mill crushing season rates governed by statutory SAP/FRP.' }
}

function getCropInfo(cropName) {
  return CROP_STYLES[cropName] || {
    color: '#3B82F6',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    tag: 'Agricultural Crop',
    demand: 'Active Market',
    advice: 'Standard market liquidity across regional APMC trading centers.'
  }
}

export default function MarketPriceTable({ prices }) {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all') // 'all' | 'gainers' | 'losers' | 'Cereal' | 'Pulse' | 'Oilseed' | 'Cash Crop'
  const [viewMode, setViewMode] = useState('list') // 'list' | 'cards'
  const [selectedCrop, setSelectedCrop] = useState(null)

  if (!prices || prices.length === 0) return null

  // Filter and process
  const filteredPrices = useMemo(() => {
    return prices.filter((p) => {
      const matchesSearch = p.crop.toLowerCase().includes(search.trim().toLowerCase())
      if (!matchesSearch) return false

      const info = getCropInfo(p.crop)
      if (filterCategory === 'all') return true
      if (filterCategory === 'gainers') return (p.changePercent ?? 0) > 0
      if (filterCategory === 'losers') return (p.changePercent ?? 0) < 0
      if (filterCategory === 'cereals') return info.tag === 'Cereal'
      if (filterCategory === 'pulses') return info.tag.includes('Pulse')
      if (filterCategory === 'cash') return info.tag.includes('Cash') || info.tag.includes('Oilseed')
      return true
    })
  }, [prices, search, filterCategory])

  return (
    <div className="card-agro shadow-sm p-4" style={{ borderRadius: '1.25rem' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: 'linear-gradient(135deg, #1b5038, #28704d)',
              boxShadow: '0 4px 12px rgba(27,80,56,0.25)'
            }}
          >
            <Store size={20} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="mb-0 fw-bold">Live Market Rates</h5>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.68rem' }}>
                <span className="d-inline-block rounded-circle bg-success me-1" style={{ width: 5, height: 5 }} /> Live APMC
              </span>
            </div>
            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Showing {filteredPrices.length} of {prices.length} commodities
            </div>
          </div>
        </div>

        {/* View Switcher & Search */}
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group p-1 bg-light rounded-pill border" role="group">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-1 ${viewMode === 'list' ? 'bg-white shadow-sm fw-bold text-success' : 'text-muted border-0'}`}
              onClick={() => setViewMode('list')}
              title="Table List View"
            >
              <LayoutList size={15} />
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-1 ${viewMode === 'cards' ? 'bg-white shadow-sm fw-bold text-success' : 'text-muted border-0'}`}
              onClick={() => setViewMode('cards')}
              title="Card Grid View"
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <div className="position-relative" style={{ minWidth: 140, maxWidth: 170 }}>
            <input
              type="text"
              className="form-control form-control-sm rounded-pill ps-4 pe-3 bg-light border-light-subtle"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '0.78rem' }}
            />
            <Search
              size={12}
              className="text-muted position-absolute"
              style={{ left: 10, top: '50%', transform: 'translateY(-50%)' }}
            />
            {search && (
              <button
                type="button"
                className="btn btn-link btn-sm p-0 position-absolute text-muted"
                style={{ right: 8, top: '50%', transform: 'translateY(-50%)' }}
                onClick={() => setSearch('')}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Colorful Category Filter Pills */}
      <div className="d-flex flex-wrap gap-1 mb-3 pb-2 border-bottom">
        {[
          { id: 'all', label: 'All', count: prices.length },
          { id: 'gainers', label: '🟢 Up (+)', count: prices.filter((p) => (p.changePercent ?? 0) > 0).length },
          { id: 'losers', label: '🔴 Down (-)', count: prices.filter((p) => (p.changePercent ?? 0) < 0).length },
          { id: 'cereals', label: '🌾 Cereals' },
          { id: 'pulses', label: '🫘 Pulses' },
          { id: 'cash', label: '🌸 Cash/Oilseeds' }
        ].map((tab) => {
          const isActive = filterCategory === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm rounded-pill py-1 px-2 d-inline-flex align-items-center gap-1 ${
                isActive
                  ? 'btn-success text-white shadow-xs fw-semibold'
                  : 'btn-light border-0 text-secondary'
              }`}
              style={{ fontSize: '0.72rem', transition: 'all 0.15s ease' }}
              onClick={() => setFilterCategory(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`badge rounded-pill ${
                    isActive ? 'bg-white text-success' : 'bg-secondary-subtle text-secondary'
                  }`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Main List / Cards View */}
      {viewMode === 'list' ? (
        <div className="table-responsive" style={{ maxHeight: 380 }}>
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className="text-muted text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                <th className="border-0 pb-2">Commodity</th>
                <th className="border-0 pb-2">Current Mandi Rate</th>
                <th className="border-0 pb-2 text-end">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.map((p) => {
                const { icon: Icon, color } = getCropVisual(p.crop)
                const info = getCropInfo(p.crop)
                const isUp = (p.changePercent ?? 0) >= 0
                const isSelected = selectedCrop?.crop === p.crop

                return (
                  <tr
                    key={p.crop}
                    onClick={() => setSelectedCrop(isSelected ? null : p)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? `${info.bg}` : 'transparent',
                      transition: 'background 0.18s ease'
                    }}
                  >
                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: info.bg,
                            color: info.color,
                            border: `1px solid ${info.border}`
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '0.88rem' }}>
                            {p.crop}
                            {isSelected && <CheckCircle2 size={13} className="text-success" />}
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <span className="badge rounded-pill bg-light border text-muted" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                              {info.tag}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-2">
                      <div className="fw-bolder" style={{ fontSize: '0.96rem', color: info.color }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
                        per {p.unit}
                      </div>
                    </td>

                    <td className="py-2 text-end">
                      <span
                        className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${
                          isUp ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'
                        }`}
                        style={{ fontSize: '0.74rem', padding: '0.35rem 0.6rem', fontWeight: 600 }}
                      >
                        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isUp ? '+' : ''}{p.changePercent}%
                      </span>
                    </td>
                  </tr>
                )
              })}

              {filteredPrices.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted small">
                    No commodities match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Bento Card View */
        <div className="row g-2 overflow-y-auto" style={{ maxHeight: 380 }}>
          {filteredPrices.map((p) => {
            const { icon: Icon } = getCropVisual(p.crop)
            const info = getCropInfo(p.crop)
            const isUp = (p.changePercent ?? 0) >= 0
            const isSelected = selectedCrop?.crop === p.crop

            return (
              <div key={p.crop} className="col-12 col-sm-6">
                <div
                  className="p-3 rounded-3 border h-100 shadow-xs"
                  onClick={() => setSelectedCrop(isSelected ? null : p)}
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? info.bg : '#FFFFFF',
                    borderColor: isSelected ? info.color : '#EEF2F6',
                    borderLeft: `4px solid ${info.color}`,
                    transition: 'all 0.18s ease'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2"
                        style={{ width: 30, height: 30, background: info.bg, color: info.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.88rem' }}>{p.crop}</div>
                        <div className="text-muted small" style={{ fontSize: '0.68rem' }}>{info.tag}</div>
                      </div>
                    </div>

                    <span
                      className={`badge rounded-pill d-inline-flex align-items-center gap-1 ${
                        isUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {isUp ? '+' : ''}{p.changePercent}%
                    </span>
                  </div>

                  <div className="d-flex align-items-baseline justify-content-between">
                    <span className="fw-bolder" style={{ fontSize: '1.15rem', color: info.color }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>/{p.unit}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Selected Crop Market Advisory Drawer / Card */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-top overflow-hidden"
          >
            {(() => {
              const info = getCropInfo(selectedCrop.crop)
              const { icon: CropIcon } = getCropVisual(selectedCrop.crop)
              return (
                <div
                  className="p-3 rounded-3 border"
                  style={{
                    background: `linear-gradient(135deg, ${info.bg}, #FFFFFF)`,
                    borderColor: info.border
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-2"
                        style={{ width: 28, height: 28, background: info.color, color: '#FFF' }}
                      >
                        <CropIcon size={16} />
                      </div>
                      <div className="fw-bold" style={{ fontSize: '0.9rem', color: info.color }}>
                        {selectedCrop.crop} Market Intelligence
                      </div>
                      <span className="badge rounded-pill bg-white text-dark border small" style={{ fontSize: '0.7rem' }}>
                        {info.demand}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 text-muted"
                      onClick={() => setSelectedCrop(null)}
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <p className="text-secondary small mb-2" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                    💡 <strong>Trading Advisory:</strong> {info.advice}
                  </p>

                  <div className="d-flex align-items-center justify-content-between text-muted small" style={{ fontSize: '0.72rem' }}>
                    <span>Current Rate: <strong className="text-dark">₹{selectedCrop.price.toLocaleString('en-IN')}/{selectedCrop.unit}</strong></span>
                    <span>24h Shift: <strong className={selectedCrop.changePercent >= 0 ? 'text-success' : 'text-danger'}>{selectedCrop.changePercent >= 0 ? '+' : ''}{selectedCrop.changePercent}%</strong></span>
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Note */}
      <div className="d-flex align-items-center justify-content-between pt-3 mt-2 border-top text-muted small" style={{ fontSize: '0.74rem' }}>
        <span className="d-flex align-items-center gap-1">
          <Sparkles size={13} className="text-success" /> Click any crop for trading advisory
        </span>
        <span className="badge bg-light text-secondary border">APMC Mandi Source</span>
      </div>
    </div>
  )
}
