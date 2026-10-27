import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Building2,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Calendar,
  MapPin,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Calculator,
  Info,
  CheckCircle2,
  ArrowUpDown,
  Zap,
  Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { mandiLiveApi } from '../services/api'
import { getCropVisual } from '../utils/visuals'

// Category classifier for commodities
function classifyCommodity(name = '') {
  const n = name.toLowerCase()
  if (n.includes('wheat') || n.includes('paddy') || n.includes('rice') || n.includes('maize') || n.includes('barley') || n.includes('jowar') || n.includes('bajra') || n.includes('ragi')) {
    return { category: 'Cereal', badgeColor: '#D97706', bg: '#FEF3C7' }
  }
  if (n.includes('gram') || n.includes('chana') || n.includes('chickpea') || n.includes('soyabean') || n.includes('soybean') || n.includes('moong') || n.includes('urd') || n.includes('urad') || n.includes('tur') || n.includes('arhar') || n.includes('lentil') || n.includes('alasande')) {
    return { category: 'Pulse', badgeColor: '#059669', bg: '#ECFDF5' }
  }
  if (n.includes('mustard') || n.includes('groundnut') || n.includes('peanut') || n.includes('sesame') || n.includes('sunflower') || n.includes('castor') || n.includes('oil')) {
    return { category: 'Oilseed', badgeColor: '#CA8A04', bg: '#FEF9C3' }
  }
  if (n.includes('onion') || n.includes('tomato') || n.includes('potato') || n.includes('cabbage') || n.includes('cauliflower') || n.includes('brinjal') || n.includes('chilly') || n.includes('chilli') || n.includes('garlic') || n.includes('ginger') || n.includes('methi')) {
    return { category: 'Vegetable', badgeColor: '#DC2626', bg: '#FEE2E2' }
  }
  if (n.includes('cotton') || n.includes('sugarcane') || n.includes('jute') || n.includes('tobacco')) {
    return { category: 'Cash Crop', badgeColor: '#2563EB', bg: '#EFF6FF' }
  }
  if (n.includes('turmeric') || n.includes('coriander') || n.includes('cumin') || n.includes('cardamom') || n.includes('pepper') || n.includes('spices') || n.includes('arecanut')) {
    return { category: 'Spice', badgeColor: '#7C3AED', bg: '#F5F3FF' }
  }
  if (n.includes('apple') || n.includes('banana') || n.includes('mango') || n.includes('orange') || n.includes('amla') || n.includes('lemon')) {
    return { category: 'Fruit', badgeColor: '#EA580C', bg: '#FFEDD5' }
  }
  return { category: 'Agri Produce', badgeColor: '#4B5563', bg: '#F3F4F6' }
}

const SUPPORTED_STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Punjab',
  'Madhya Pradesh',
  'Karnataka'
]

const POPULAR_COMMODITIES = [
  'Onion',
  'Wheat',
  'Tomato',
  'Potato',
  'Maize',
  'Bengal Gram(Gram)(Whole)',
  'Turmeric',
  'Chilly Capsicum',
  'Apple'
]

export default function GovMandiPriceTable({ userLocation = '' }) {
  // State for query matching: curl -X GET "https://mandi-api.onrender.com/v1/prices?state=Maharashtra&commodity=Onion"
  const [selectedState, setSelectedState] = useState('Maharashtra')
  const [selectedCommodity, setSelectedCommodity] = useState('Onion')

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastFetched, setLastFetched] = useState(null)

  // Filters & Sorting within the loaded dataset
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('modal_desc')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Selected Mandi for Calculator / Inspection
  const [activeRecord, setActiveRecord] = useState(null)
  const [calcQuantity, setCalcQuantity] = useState(10) // 10 quintals default

  // Fetch prices using the live mandi-api endpoint
  const loadPrices = useCallback(async (state, commodity) => {
    setLoading(true)
    setError('')
    try {
      const res = await mandiLiveApi.getPrices({
        state: state === 'All' ? '' : state,
        commodity: commodity === 'All' ? '' : commodity
      })

      if (res && res.success && Array.isArray(res.data)) {
        setRecords(res.data)
        setLastFetched(new Date().toLocaleTimeString())
      } else {
        setRecords([])
        setError('No mandi records returned for the specified filters.')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch from mandi-api.onrender.com')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch on mount with default state=Maharashtra&commodity=Onion
  useEffect(() => {
    loadPrices(selectedState, selectedCommodity)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle filter changes
  const handleApplyQuery = (state, commodity) => {
    setSelectedState(state)
    setSelectedCommodity(commodity)
    loadPrices(state, commodity)
    setCurrentPage(1)
  }

  // Filtered & Sorted Records
  const processedRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Keyword Search
        if (search.trim()) {
          const q = search.trim().toLowerCase()
          const inCommodity = (rec.commodity || '').toLowerCase().includes(q)
          const inMarket = (rec.market || '').toLowerCase().includes(q)
          const inDistrict = (rec.district || '').toLowerCase().includes(q)
          const inState = (rec.state || '').toLowerCase().includes(q)
          const inVariety = (rec.variety || '').toLowerCase().includes(q)
          const inGrade = (rec.grade || '').toLowerCase().includes(q)
          if (!inCommodity && !inMarket && !inDistrict && !inState && !inVariety && !inGrade) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        const modalA = Number(a.modal_price) || 0
        const modalB = Number(b.modal_price) || 0
        if (sortBy === 'modal_desc') return modalB - modalA
        if (sortBy === 'modal_asc') return modalA - modalB
        if (sortBy === 'commodity_asc') return (a.commodity || '').localeCompare(b.commodity || '')
        if (sortBy === 'market_asc') return (a.market || '').localeCompare(b.market || '')
        if (sortBy === 'arrival_desc') return (b.arrival_date || '').localeCompare(a.arrival_date || '')
        return 0
      })
  }, [records, search, sortBy])

  // Summary Metrics
  const metrics = useMemo(() => {
    if (processedRecords.length === 0) {
      return { totalMandis: 0, avgPrice: 0, minRate: 0, maxRate: 0 }
    }
    const uniqueMandis = new Set(processedRecords.map((r) => `${r.district}-${r.market}`)).size
    const totalPrice = processedRecords.reduce((acc, r) => acc + (Number(r.modal_price) || 0), 0)
    const avg = Math.round(totalPrice / processedRecords.length)

    let min = Number(processedRecords[0].modal_price) || 0
    let max = Number(processedRecords[0].modal_price) || 0
    for (const r of processedRecords) {
      const p = Number(r.modal_price) || 0
      if (p < min) min = p
      if (p > max) max = p
    }

    return {
      totalMandis: uniqueMandis,
      avgPrice: avg,
      minRate: min,
      maxRate: max
    }
  }, [processedRecords])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedRecords.length / pageSize))
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedRecords.slice(start, start + pageSize)
  }, [processedRecords, currentPage, pageSize])

  // Reset page when search or page size changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, pageSize])

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'State', 'District', 'Market (Mandi)', 'Commodity', 'Variety', 'Grade', 'Arrival Date', 'Min Price (INR/q)', 'Max Price (INR/q)', 'Modal Price (INR/q)']
    const rows = processedRecords.map((r) => [
      r.id,
      `"${r.state}"`,
      `"${r.district}"`,
      `"${r.market?.trim()}"`,
      `"${r.commodity}"`,
      `"${r.variety}"`,
      `"${r.grade}"`,
      `"${r.arrival_date}"`,
      r.min_price,
      r.max_price,
      r.modal_price
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Mandi_Prices_${selectedState}_${selectedCommodity}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Active query API string for display
  const activeEndpointUrl = `https://mandi-api.onrender.com/v1/prices?state=${selectedState}&commodity=${selectedCommodity}`

  return (
    <div
      className="card-agro shadow-sm p-0 mb-5 overflow-hidden"
      style={{
        borderRadius: '1.25rem',
        border: '1px solid #D5E2D1',
        background: '#FFFFFF'
      }}
    >
      {/* Header Accent Bar */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #1B5038, #28704D, #66A981)' }} />

      <div className="p-3 p-md-4">
        {/* Header with Live Status & Controls */}
        <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1b5038, #28704d)',
                boxShadow: '0 6px 16px rgba(27,80,56,0.22)',
                flexShrink: 0
              }}
            >
              <Building2 size={24} />
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                <h4 className="mb-0 fw-bold" style={{ color: '#1B5038' }}>
                  Live APMC Mandi Daily Prices
                </h4>
                <span
                  className="badge px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    border: '1px solid #86EFAC',
                    fontSize: '0.74rem',
                    fontWeight: 600
                  }}
                >
                  <span
                    className="d-inline-block rounded-circle"
                    style={{
                      width: 7,
                      height: 7,
                      backgroundColor: '#16A34A',
                      animation: 'pulse 1.8s infinite'
                    }}
                  />
                  Live API Connected
                </span>

                <a
                  href={activeEndpointUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge text-decoration-none px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.70rem',
                    fontWeight: 500
                  }}
                  title="Test live API endpoint directly"
                >
                  <Globe size={11} />
                  <span>mandi-api.onrender.com</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.82rem' }}>
                <span>Real-time Agmarknet mandi spot prices • Last synced: <strong>{lastFetched || 'Just now'}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Tools: Refresh & Export CSV */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-sm btn-light border d-flex align-items-center gap-1 rounded-pill px-3 py-1 text-secondary"
              onClick={() => loadPrices(selectedState, selectedCommodity)}
              disabled={loading}
              style={{ fontSize: '0.82rem', fontWeight: 600 }}
              title="Re-query API"
            >
              <RefreshCw size={13} className={loading ? 'spin text-success' : ''} />
              <span>{loading ? 'Fetching...' : 'Refresh API'}</span>
            </button>

            <button
              type="button"
              className="btn btn-sm btn-agro rounded-pill px-3 py-1 d-flex align-items-center gap-1"
              onClick={handleExportCSV}
              disabled={processedRecords.length === 0}
              style={{ fontSize: '0.82rem', fontWeight: 600 }}
              title="Export filtered records to CSV"
            >
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* API Endpoint & Quick Query Pills */}
        <div
          className="p-3 my-3 rounded-4"
          style={{
            backgroundColor: '#F8FAF7',
            border: '1px solid #E6ECE3'
          }}
        >
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
            <div className="d-flex align-items-center gap-1.5 flex-wrap" style={{ minWidth: 0, maxWidth: '100%' }}>
              <span className="badge bg-dark rounded-pill px-2 py-1" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                ACTIVE ENDPOINT
              </span>
              <code className="text-dark small px-2 py-0.5 rounded bg-white border" style={{ fontSize: '0.75rem', wordBreak: 'break-all', maxWidth: '100%' }}>
                GET /v1/prices?state={selectedState}&amp;commodity={selectedCommodity}
              </code>
            </div>

            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Showing {processedRecords.length} records from mandi-api.onrender.com
            </div>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="d-flex align-items-center gap-1 overflow-x-auto flex-nowrap flex-sm-wrap mt-2 pt-1 border-top pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            <span className="text-muted small fw-semibold me-1 flex-shrink-0" style={{ fontSize: '0.75rem' }}>
              Quick Presets:
            </span>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-0 ${selectedState === 'Maharashtra' && selectedCommodity === 'Onion' ? 'btn-success fw-bold' : 'btn-light border text-muted'}`}
              style={{ fontSize: '0.74rem' }}
              onClick={() => handleApplyQuery('Maharashtra', 'Onion')}
            >
              🧅 Maharashtra • Onion (Default)
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-0 ${selectedState === 'Maharashtra' && selectedCommodity === 'Wheat' ? 'btn-success fw-bold' : 'btn-light border text-muted'}`}
              style={{ fontSize: '0.74rem' }}
              onClick={() => handleApplyQuery('Maharashtra', 'Wheat')}
            >
              🌾 Maharashtra • Wheat
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-0 ${selectedState === 'Maharashtra' && selectedCommodity === 'Tomato' ? 'btn-success fw-bold' : 'btn-light border text-muted'}`}
              style={{ fontSize: '0.74rem' }}
              onClick={() => handleApplyQuery('Maharashtra', 'Tomato')}
            >
              🍅 Maharashtra • Tomato
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-0 ${selectedState === 'Punjab' && selectedCommodity === 'Wheat' ? 'btn-success fw-bold' : 'btn-light border text-muted'}`}
              style={{ fontSize: '0.74rem' }}
              onClick={() => handleApplyQuery('Punjab', 'Wheat')}
            >
              🌾 Punjab • Wheat
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-0 ${selectedState === 'Uttar Pradesh' && selectedCommodity === 'Potato' ? 'btn-success fw-bold' : 'btn-light border text-muted'}`}
              style={{ fontSize: '0.74rem' }}
              onClick={() => handleApplyQuery('Uttar Pradesh', 'Potato')}
            >
              🥔 UP • Potato
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-2 py-0 ${selectedState === 'Karnataka' && selectedCommodity === 'Turmeric' ? 'btn-success fw-bold' : 'btn-light border text-muted'}`}
              style={{ fontSize: '0.74rem' }}
              onClick={() => handleApplyQuery('Karnataka', 'Turmeric')}
            >
              🌿 Karnataka • Turmeric
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Tiles */}
        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3">
            <div className="mandi-stat-tile p-3 rounded-4" style={{ backgroundColor: '#F8FAF7', border: '1px solid #E6ECE3' }}>
              <div className="text-muted small fw-semibold">Reporting Mandis</div>
              <div className="h4 fw-bold mb-0 text-dark" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {metrics.totalMandis}
              </div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                In {selectedState} APMC markets
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="mandi-stat-tile p-3 rounded-4" style={{ backgroundColor: '#F8FAF7', border: '1px solid #E6ECE3' }}>
              <div className="text-muted small fw-semibold">Average Modal Rate</div>
              <div className="h4 fw-bold mb-0 text-success" style={{ fontFamily: 'Manrope, sans-serif' }}>
                ₹{metrics.avgPrice.toLocaleString('en-IN')}
                <span className="text-muted fw-normal" style={{ fontSize: '0.72rem' }}>
                  /q
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                For {selectedCommodity}
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="mandi-stat-tile p-3 rounded-4" style={{ backgroundColor: '#F8FAF7', border: '1px solid #E6ECE3' }}>
              <div className="text-muted small fw-semibold">Lowest Mandi Quote</div>
              <div className="h4 fw-bold mb-0 text-secondary" style={{ fontFamily: 'Manrope, sans-serif' }}>
                ₹{metrics.minRate.toLocaleString('en-IN')}
                <span className="text-muted fw-normal" style={{ fontSize: '0.72rem' }}>
                  /q
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                Floor rate recorded
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="mandi-stat-tile p-3 rounded-4" style={{ backgroundColor: '#F8FAF7', border: '1px solid #E6ECE3' }}>
              <div className="text-muted small fw-semibold">Peak Mandi Quote</div>
              <div className="h4 fw-bold mb-0 text-primary" style={{ fontFamily: 'Manrope, sans-serif' }}>
                ₹{metrics.maxRate.toLocaleString('en-IN')}
                <span className="text-muted fw-normal" style={{ fontSize: '0.72rem' }}>
                  /q
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                Top rate recorded
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: State selector, Commodity selector, Search, Sorting */}
        <div className="mandi-filter-bar p-3 mb-3 rounded-4" style={{ backgroundColor: '#F8FAF7', border: '1px solid #E6ECE3' }}>
          <div className="row g-2 align-items-center">
            {/* State Dropdown */}
            <div className="col-6 col-md-3">
              <label className="form-label text-muted small fw-bold mb-1" style={{ fontSize: '0.72rem' }}>
                Mandi State
              </label>
              <div className="d-flex align-items-center gap-1">
                <MapPin size={14} className="text-muted flex-shrink-0" />
                <select
                  className="form-select form-select-sm rounded-pill bg-white border-light-subtle"
                  value={selectedState}
                  onChange={(e) => handleApplyQuery(e.target.value, selectedCommodity)}
                  style={{ fontSize: '0.82rem' }}
                >
                  {SUPPORTED_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Commodity Dropdown */}
            <div className="col-6 col-md-3">
              <label className="form-label text-muted small fw-bold mb-1" style={{ fontSize: '0.72rem' }}>
                Commodity
              </label>
              <div className="d-flex align-items-center gap-1">
                <Filter size={14} className="text-muted flex-shrink-0" />
                <select
                  className="form-select form-select-sm rounded-pill bg-white border-light-subtle"
                  value={selectedCommodity}
                  onChange={(e) => handleApplyQuery(selectedState, e.target.value)}
                  style={{ fontSize: '0.82rem' }}
                >
                  {POPULAR_COMMODITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search within returned results */}
            <div className="col-12 col-md-3">
              <label className="form-label text-muted small fw-bold mb-1" style={{ fontSize: '0.72rem' }}>
                Search Mandi / District
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-sm rounded-pill ps-4 pe-3 bg-white border-light-subtle"
                  placeholder="Filter market, district, variety..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ fontSize: '0.82rem' }}
                />
                <Search
                  size={13}
                  className="text-muted position-absolute"
                  style={{ left: 12, top: '50%', transform: 'translateY(-50%)' }}
                />
                {search && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 position-absolute text-muted"
                    style={{ right: 10, top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => setSearch('')}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Sort Order */}
            <div className="col-12 col-md-3">
              <label className="form-label text-muted small fw-bold mb-1" style={{ fontSize: '0.72rem' }}>
                Sort By
              </label>
              <div className="d-flex align-items-center gap-1">
                <ArrowUpDown size={14} className="text-muted flex-shrink-0" />
                <select
                  className="form-select form-select-sm rounded-pill bg-white border-light-subtle"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ fontSize: '0.82rem' }}
                >
                  <option value="modal_desc">Modal Price (Highest First)</option>
                  <option value="modal_asc">Modal Price (Lowest First)</option>
                  <option value="market_asc">Market Name (A-Z)</option>
                  <option value="arrival_desc">Arrival Date (Newest)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification if any */}
        {error && (
          <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-3" style={{ fontSize: '0.82rem' }}>
            <Info size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* The Live Mandi Rates Table */}
        <div className="table-responsive rounded-4 border" style={{ borderColor: '#E8EFE5' }}>
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.86rem' }}>
            <thead style={{ backgroundColor: '#F4F7F2' }}>
              <tr>
                <th scope="col" className="ps-3 py-3 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.74rem' }}>
                  Commodity
                </th>
                <th scope="col" className="py-3 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.74rem' }}>
                  Variety &amp; Grade
                </th>
                <th scope="col" className="py-3 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.74rem' }}>
                  Market (APMC Mandi)
                </th>
                <th scope="col" className="py-3 text-secondary text-uppercase fw-bold" style={{ fontSize: '0.74rem' }}>
                  District &amp; State
                </th>
                <th scope="col" className="py-3 text-secondary text-uppercase fw-bold text-center" style={{ fontSize: '0.74rem' }}>
                  Arrival Date
                </th>
                <th scope="col" className="py-3 text-secondary text-uppercase fw-bold text-end" style={{ fontSize: '0.74rem' }}>
                  Min (₹/q)
                </th>
                <th scope="col" className="py-3 text-secondary text-uppercase fw-bold text-end" style={{ fontSize: '0.74rem' }}>
                  Max (₹/q)
                </th>
                <th scope="col" className="py-3 text-secondary text-uppercase fw-bold text-end" style={{ fontSize: '0.74rem' }}>
                  Modal Price (₹/q)
                </th>
                <th scope="col" className="pe-3 py-3 text-secondary text-uppercase fw-bold text-center" style={{ fontSize: '0.74rem' }}>
                  Price Spread
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <div className="d-flex align-items-center justify-content-center gap-2 text-success">
                      <RefreshCw size={18} className="spin" />
                      <span className="fw-semibold">Fetching live rates from mandi-api.onrender.com...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                      <Search size={32} className="text-secondary opacity-50" />
                      <div className="fw-semibold">No mandi records found</div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 mt-1"
                        onClick={() => {
                          setSearch('')
                          handleApplyQuery('Maharashtra', 'Onion')
                        }}
                      >
                        Reset to Maharashtra Onion
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item, idx) => {
                  const cat = classifyCommodity(item.commodity)
                  const visual = getCropVisual(item.commodity)
                  const IconComp = visual.icon
                  const minP = Number(item.min_price) || 0
                  const maxP = Number(item.max_price) || 0
                  const modalP = Number(item.modal_price) || 0
                  const spread = maxP - minP

                  return (
                    <tr
                      key={`${item.id || idx}-${item.market}`}
                      onClick={() => setActiveRecord(item)}
                      style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                      title="Click to view detailed price spread & profit calculator"
                    >
                      {/* Commodity */}
                      <td className="ps-3 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-3 p-1"
                            style={{
                              backgroundColor: cat.bg,
                              color: visual.color || cat.badgeColor,
                              width: 34,
                              height: 34,
                              flexShrink: 0
                            }}
                          >
                            <IconComp size={18} />
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{item.commodity}</div>
                            <span
                              className="badge px-1 py-0 rounded"
                              style={{
                                backgroundColor: cat.bg,
                                color: cat.badgeColor,
                                fontSize: '0.66rem',
                                fontWeight: 600
                              }}
                            >
                              {cat.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Variety & Grade */}
                      <td className="py-3">
                        <div className="d-flex flex-column" style={{ fontSize: '0.82rem' }}>
                          <span className="text-dark fw-semibold">{item.variety || 'Other'}</span>
                          <span className="text-muted small" style={{ fontSize: '0.70rem' }}>
                            Grade: {item.grade || 'Local'}
                          </span>
                        </div>
                      </td>

                      {/* Market / APMC Mandi */}
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-1 fw-bold text-dark" style={{ fontSize: '0.84rem' }}>
                          <Building2 size={13} className="text-success flex-shrink-0" />
                          <span>{item.market?.trim()}</span>
                        </div>
                      </td>

                      {/* District & State */}
                      <td className="py-3">
                        <div className="d-flex flex-column" style={{ fontSize: '0.82rem' }}>
                          <span className="text-dark fw-medium">{item.district}</span>
                          <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                            {item.state}
                          </span>
                        </div>
                      </td>

                      {/* Arrival Date */}
                      <td className="py-3 text-center">
                        <span className="text-muted d-inline-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                          <Calendar size={12} className="text-secondary" />
                          <span>{item.arrival_date}</span>
                        </span>
                      </td>

                      {/* Min Price */}
                      <td className="py-3 text-end text-muted fw-semibold">
                        ₹{minP.toLocaleString('en-IN')}
                      </td>

                      {/* Max Price */}
                      <td className="py-3 text-end text-muted fw-semibold">
                        ₹{maxP.toLocaleString('en-IN')}
                      </td>

                      {/* Modal Price */}
                      <td className="py-3 text-end">
                        <span
                          className="px-2 py-1 rounded-pill fw-bold"
                          style={{
                            backgroundColor: '#EBF7EE',
                            color: '#1B5038',
                            fontSize: '0.90rem',
                            display: 'inline-block'
                          }}
                        >
                          ₹{modalP.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Price Spread */}
                      <td className="pe-3 py-3 text-center">
                        <div className="d-inline-flex flex-column align-items-center" style={{ minWidth: 75 }}>
                          <span
                            className="badge rounded-pill px-2 py-0"
                            style={{
                              backgroundColor: spread > 1000 ? '#FEF2F2' : '#F1F5F9',
                              color: spread > 1000 ? '#DC2626' : '#475569',
                              fontSize: '0.70rem',
                              fontWeight: 600
                            }}
                          >
                            Δ ₹{spread.toLocaleString('en-IN')}
                          </span>
                          <div
                            className="w-100 rounded-pill mt-1"
                            style={{
                              height: 3,
                              backgroundColor: '#E2E8F0',
                              overflow: 'hidden'
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.min(100, Math.max(15, (spread / (modalP || 1)) * 100))}%`,
                                backgroundColor: spread > 1000 ? '#F87171' : '#10B981',
                                borderRadius: 999
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count footer */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 pt-2">
          <div className="text-muted small" style={{ fontSize: '0.80rem' }}>
            Showing{' '}
            <strong>
              {processedRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * pageSize, processedRecords.length)}
            </strong>{' '}
            of <strong>{processedRecords.length}</strong> live mandi entries
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-1 me-2">
              <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
                Rows per page:
              </span>
              <select
                className="form-select form-select-sm rounded-pill"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{ width: 70, fontSize: '0.78rem' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-start-pill px-2"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="btn btn-sm btn-outline-secondary disabled px-3 text-dark fw-bold" style={{ fontSize: '0.78rem' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary rounded-end-pill px-2"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Farmer Quintal Profit / Revenue Estimator */}
      <AnimatePresence>
        {activeRecord && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 1060
            }}
            onClick={() => setActiveRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white rounded-4 shadow-lg p-4"
              style={{ maxWidth: 520, width: '100%', border: '1px solid #D5E2D1' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 text-white" style={{ backgroundColor: '#1B5038' }}>
                    <Calculator size={20} />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">{activeRecord.commodity} Rate Analysis</h5>
                    <span className="text-muted small">
                      {activeRecord.market?.trim()}, {activeRecord.district}, {activeRecord.state}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-light btn-sm rounded-circle p-1"
                  onClick={() => setActiveRecord(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="row g-2 mb-3 text-center">
                <div className="col-4">
                  <div className="p-2 rounded-3 bg-light border">
                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Min Price</div>
                    <div className="fw-bold text-dark">₹{Number(activeRecord.min_price).toLocaleString('en-IN')}/q</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3 border" style={{ backgroundColor: '#EBF7EE', borderColor: '#86EFAC' }}>
                    <div className="text-success small fw-semibold" style={{ fontSize: '0.72rem' }}>Modal Rate</div>
                    <div className="fw-bold text-success fs-5">₹{Number(activeRecord.modal_price).toLocaleString('en-IN')}/q</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-2 rounded-3 bg-light border">
                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>Max Price</div>
                    <div className="fw-bold text-dark">₹{Number(activeRecord.max_price).toLocaleString('en-IN')}/q</div>
                  </div>
                </div>
              </div>

              {/* Quintal Revenue Calculator */}
              <div className="p-3 rounded-4 mb-3" style={{ backgroundColor: '#F8FAF7', border: '1px solid #E6ECE3' }}>
                <label className="form-label fw-bold mb-1 d-flex align-items-center justify-content-between" style={{ fontSize: '0.84rem' }}>
                  <span>Estimate Revenue at Mandi Modal Rate:</span>
                  <span className="text-success fw-bold">{calcQuantity} Quintals ({(calcQuantity * 100).toLocaleString('en-IN')} kg)</span>
                </label>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="100"
                    step="1"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                  />
                </div>
                <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-white border">
                  <span className="text-muted small">Estimated Gross Payout:</span>
                  <span className="h4 fw-bold text-success mb-0" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    ₹{(calcQuantity * (Number(activeRecord.modal_price) || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-agro rounded-pill px-4"
                  onClick={() => setActiveRecord(null)}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
