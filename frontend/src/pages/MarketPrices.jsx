import React, { useState, useEffect, useCallback } from 'react'
import { marketApi } from '../services/api'
import LocationSelector from '../components/LocationSelector'
import MarketPriceTable from '../components/MarketPriceTable'
import MarketChart from '../components/MarketChart'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { LineChart, MapPin, Store } from 'lucide-react'
import GovMandiPriceTable from '../components/GovMandiPriceTable'

export default function MarketPrices({ farmer }) {
  const [location, setLocation] = useState(farmer?.location || '')
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (loc) => {
    setLoading(true)
    setError('')
    try {
      const data = await marketApi.get(loc)
      setPrices(data)
      setLocation(loc)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (location) load(location)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container py-4" style={{ maxWidth: 1280 }}>
      {/* Header with Location Banner */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h3 className="mb-0 fw-bold d-flex align-items-center gap-2">
              <Store size={26} className="text-success" /> Market Prices & Mandi Trends
            </h3>
          </div>
          <div className="text-muted d-flex align-items-center gap-2" style={{ fontSize: '0.88rem' }}>
            <MapPin size={15} className="text-secondary" />
            <span>Mandi Region: <strong>{location || 'General Market'}</strong></span>
          </div>
        </div>

        <div style={{ minWidth: 260, maxWidth: 360 }}>
          <LocationSelector value={location} loading={loading} onSubmit={load} />
        </div>
      </div>

      <ErrorMessage message={error} onRetry={() => location && load(location)} />

      {loading && <LoadingSpinner label="Fetching live mandi prices..." />}

      {!loading && prices.length > 0 && (
        <div className="row g-4 align-items-start mb-4">
          <div className="col-12 col-lg-5 order-2 order-lg-1">
            <MarketPriceTable prices={prices} />
          </div>
          <div className="col-12 col-lg-7 order-1 order-lg-2">
            <MarketChart prices={prices} />
          </div>
        </div>
      )}

      {/* Official Government Mandi Rates from data.gov.in (Resource ID: 9ef84268-d588-465a-a308-a864a43d0070) */}
      <div className="mt-3">
        <GovMandiPriceTable userLocation={location} />
      </div>
    </div>
  )
}
