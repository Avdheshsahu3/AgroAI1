import React, { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts'
import {
  TrendingUp,
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  Sun,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WeatherGraph({ forecast, weather }) {
  const [activeMetric, setActiveMetric] = useState('temp') // 'temp' | 'rain' | 'humidity'

  // Format data for recharts
  const chartData = useMemo(() => {
    if (!forecast || forecast.length === 0) return []
    return forecast.map((day, idx) => ({
      index: idx,
      day: day.day,
      date: day.date,
      condition: day.condition,
      tempMax: Math.round(day.temperatureMax),
      tempMin: Math.round(day.temperatureMin),
      tempAvg: Math.round((day.temperatureMax + day.temperatureMin) / 2),
      rainfall: parseFloat((day.rainfall || 0).toFixed(1)),
      humidity: Math.round(day.humidity || (60 + (idx % 3) * 5)),
      isToday: idx === 0
    }))
  }, [forecast])

  // Summary analytics
  const analytics = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { avgTemp: 0, totalRain: 0, maxTemp: 0, rainyDays: 0, avgHumidity: 0 }
    }
    const totalRain = chartData.reduce((acc, d) => acc + d.rainfall, 0)
    const avgTemp = Math.round(chartData.reduce((acc, d) => acc + d.tempMax, 0) / chartData.length)
    const maxTemp = Math.max(...chartData.map((d) => d.tempMax))
    const rainyDays = chartData.filter((d) => d.rainfall > 0.5).length
    const avgHumidity = Math.round(chartData.reduce((acc, d) => acc + d.humidity, 0) / chartData.length)

    return {
      avgTemp,
      totalRain: totalRain.toFixed(1),
      maxTemp,
      rainyDays,
      avgHumidity
    }
  }, [chartData])

  if (!chartData || chartData.length === 0) return null

  // Custom Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div
          className="p-3 shadow-lg rounded-3 border"
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(12px)',
            borderColor: '#CBD5E1',
            minWidth: 190
          }}
        >
          <div className="d-flex align-items-center justify-content-between mb-1.5 pb-1 border-bottom">
            <span className="fw-bold text-dark small">
              {data.day} {data.isToday && <span className="badge bg-success small ms-1">Today</span>}
            </span>
            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>{data.date}</span>
          </div>

          <div className="text-muted small mb-2 fst-italic" style={{ fontSize: '0.78rem' }}>
            {data.condition}
          </div>

          {activeMetric === 'temp' && (
            <div className="d-flex flex-column gap-1">
              <div className="d-flex justify-content-between align-items-center small">
                <span className="text-muted">High (Max):</span>
                <span className="fw-bold text-danger">{data.tempMax}°C</span>
              </div>
              <div className="d-flex justify-content-between align-items-center small">
                <span className="text-muted">Low (Min):</span>
                <span className="fw-bold text-primary">{data.tempMin}°C</span>
              </div>
              <div className="d-flex justify-content-between align-items-center small pt-1 border-top">
                <span className="text-muted">Thermal Swing:</span>
                <span className="fw-bold text-dark">{data.tempMax - data.tempMin}°C</span>
              </div>
            </div>
          )}

          {activeMetric === 'rain' && (
            <div className="d-flex flex-column gap-1">
              <div className="d-flex justify-content-between align-items-center small">
                <span className="text-muted">Predicted Rain:</span>
                <span className="fw-bold text-info" style={{ color: '#0284C7' }}>{data.rainfall} mm</span>
              </div>
              <div className="text-muted small pt-1 border-top" style={{ fontSize: '0.72rem' }}>
                {data.rainfall === 0
                  ? '☀️ Dry day • Ideal for spraying'
                  : data.rainfall > 10
                  ? '🌧️ Heavy downpour • Postpone irrigation'
                  : '🌦️ Light precipitation • High humidity'}
              </div>
            </div>
          )}

          {activeMetric === 'humidity' && (
            <div className="d-flex flex-column gap-1">
              <div className="d-flex justify-content-between align-items-center small">
                <span className="text-muted">Relative Humidity:</span>
                <span className="fw-bold text-teal" style={{ color: '#0D9488' }}>{data.humidity}%</span>
              </div>
              <div className="text-muted small pt-1 border-top" style={{ fontSize: '0.72rem' }}>
                {data.humidity > 70
                  ? '⚠️ High humidity • Spore alert'
                  : data.humidity < 40
                  ? '☀️ Low humidity • Fast evaporation'
                  : '✓ Balanced agronomic range'}
              </div>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div
      className="card-agro shadow-sm p-4 mb-4"
      style={{
        borderRadius: 22,
        border: '1.5px solid #E2E8F0',
        background: '#FFFFFF'
      }}
    >
      {/* Top Header & Chart Mode Switcher */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div
              className="d-flex align-items-center justify-content-center text-white"
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                boxShadow: '0 4px 10px rgba(2,132,199,0.25)'
              }}
            >
              <TrendingUp size={18} />
            </div>
            <h5 className="mb-0 fw-bold" style={{ color: '#0F172A', fontSize: '1.15rem' }}>
              7-Day Micro-Climate Trend Graph
            </h5>
            <span className="badge bg-light text-primary border border-primary-subtle fw-semibold" style={{ fontSize: '0.7rem' }}>
              Multi-Metric Analysis
            </span>
          </div>
          <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
            Forecast trajectory of diurnal temperature variations, rainfall precipitation volume, and foliar moisture levels.
          </p>
        </div>

        {/* Segmented Metric Switcher Pills */}
        <div
          className="p-1 rounded-pill d-inline-flex bg-light border"
          style={{ borderColor: '#E2E8F0' }}
        >
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
              activeMetric === 'temp'
                ? 'bg-white text-danger shadow-xs border'
                : 'text-muted border-0'
            }`}
            style={{ fontSize: '0.8rem' }}
            onClick={() => setActiveMetric('temp')}
          >
            <Thermometer size={14} className={activeMetric === 'temp' ? 'text-danger' : 'text-muted'} />
            Temperature (°C)
          </button>

          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
              activeMetric === 'rain'
                ? 'bg-white text-primary shadow-xs border'
                : 'text-muted border-0'
            }`}
            style={{ fontSize: '0.8rem' }}
            onClick={() => setActiveMetric('rain')}
          >
            <CloudRain size={14} className={activeMetric === 'rain' ? 'text-primary' : 'text-muted'} />
            Rainfall (mm)
          </button>

          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
              activeMetric === 'humidity'
                ? 'bg-white text-success shadow-xs border'
                : 'text-muted border-0'
            }`}
            style={{ fontSize: '0.8rem' }}
            onClick={() => setActiveMetric('humidity')}
          >
            <Droplets size={14} className={activeMetric === 'humidity' ? 'text-success' : 'text-muted'} />
            Humidity (%)
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Benchmark Tiles */}
      <div className="row g-2 mb-4">
        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 border"
            style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', borderColor: '#FDE68A' }}
          >
            <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
              <Sun size={12} className="text-warning" /> Peak Heat Max
            </div>
            <div className="fw-extrabold text-dark mt-0.5" style={{ fontSize: '1.25rem' }}>
              {analytics.maxTemp}°C
            </div>
            <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Avg: {analytics.avgTemp}°C</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 border"
            style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', borderColor: '#BAE6FD' }}
          >
            <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
              <CloudRain size={12} className="text-primary" /> Total 7-Day Rain
            </div>
            <div className="fw-extrabold text-dark mt-0.5" style={{ fontSize: '1.25rem' }}>
              {analytics.totalRain} mm
            </div>
            <div className="text-muted small" style={{ fontSize: '0.7rem' }}>{analytics.rainyDays} rainy days forecast</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 border"
            style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', borderColor: '#A7F3D0' }}
          >
            <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
              <Droplets size={12} className="text-success" /> Avg Relative Humidity
            </div>
            <div className="fw-extrabold text-dark mt-0.5" style={{ fontSize: '1.25rem' }}>
              {analytics.avgHumidity}%
            </div>
            <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Foliar hydration balance</div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div
            className="p-2.5 rounded-3 border"
            style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)', borderColor: '#DDD6FE' }}
          >
            <div className="text-muted small d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
              <Wind size={12} style={{ color: '#7C3AED' }} /> Wind Speed
            </div>
            <div className="fw-extrabold text-dark mt-0.5" style={{ fontSize: '1.25rem' }}>
              {Math.round(weather?.windSpeed || 11)} km/h
            </div>
            <div className="text-muted small" style={{ fontSize: '0.7rem' }}>
              {weather?.windSpeed > 15 ? '⚠️ Drift Caution' : '✓ Safe for spraying'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Chart Area */}
      <div style={{ width: '100%', height: 320 }} className="weather-chart-wrap position-relative">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempMaxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tempMinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis
                stroke="#94A3B8"
                tickLine={false}
                domain={['dataMin - 3', 'dataMax + 3']}
                unit="°"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="tempMax"
                name="Max Temp"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempMaxGrad)"
                activeDot={{ r: 6, fill: '#EF4444', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="tempMin"
                name="Min Temp"
                stroke="#0284C7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempMinGrad)"
                activeDot={{ r: 5, fill: '#0284C7', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : activeMetric === 'rain' ? (
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis
                stroke="#94A3B8"
                tickLine={false}
                domain={[0, 'dataMax + 5']}
                unit=" mm"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={10} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Heavy Rain (10mm)', fill: '#EF4444', fontSize: 11 }} />
              <Bar dataKey="rainfall" name="Rainfall (mm)" fill="url(#rainGrad)" radius={[8, 8, 0, 0]} barSize={34}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rainfall > 10 ? '#0369A1' : entry.rainfall > 3 ? '#0284C7' : '#7DD3FC'}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis
                stroke="#94A3B8"
                tickLine={false}
                domain={[20, 100]}
                unit="%"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Fungal Risk (>75%)', fill: '#EF4444', fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#059669"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#humidityGrad)"
                activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Agronomic Takeaways */}
      <div className="pt-3 mt-2 border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          {activeMetric === 'temp' && (
            <>
              <div className="d-flex align-items-center gap-1.5 small text-dark fw-semibold">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                <span>Daytime High (°C)</span>
              </div>
              <div className="d-flex align-items-center gap-1.5 small text-dark fw-semibold">
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284C7', display: 'inline-block' }} />
                <span>Nighttime Low (°C)</span>
              </div>
            </>
          )}
          {activeMetric === 'rain' && (
            <div className="d-flex align-items-center gap-1.5 small text-muted">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#0284C7', display: 'inline-block' }} />
              <span>Bars reflect predicted 24-hr precipitation accumulation (mm)</span>
            </div>
          )}
          {activeMetric === 'humidity' && (
            <div className="d-flex align-items-center gap-1.5 small text-muted">
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
              <span>Relative humidity percentage throughout the canopy layer</span>
            </div>
          )}
        </div>

        <span className="text-muted small fst-italic" style={{ fontSize: '0.74rem' }}>
          Updated with Open-Meteo satellite atmospheric telemetry.
        </span>
      </div>
    </div>
  )
}
