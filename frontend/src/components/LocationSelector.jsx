import React, { useState } from 'react'
import { MapPin } from 'lucide-react'

export default function LocationSelector({ value, onSubmit, loading }) {
  const [location, setLocation] = useState(value || '')

  function handleSubmit(e) {
    e.preventDefault()
    if (location.trim()) onSubmit(location.trim())
  }

  return (
    <form className="d-flex gap-2 flex-wrap align-items-center location-selector-form" onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className="position-relative flex-grow-1 location-input-wrap" style={{ minWidth: 160, maxWidth: 320 }}>
        <MapPin size={17} className="position-absolute text-muted" style={{ top: '50%', left: 14, transform: 'translateY(-50%)' }} />
        <input
          className="form-control form-control-lg-touch w-100"
          style={{ paddingLeft: 38 }}
          placeholder="e.g. Jabalpur, Madhya Pradesh"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <button className="btn btn-agro flex-shrink-0 location-submit-btn" type="submit" disabled={loading}>
        {loading ? 'Fetching...' : 'Update Location'}
      </button>
    </form>
  )
}
