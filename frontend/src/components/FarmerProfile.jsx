import React from 'react'
import { UserRound, Mail, Phone, MapPin, Ruler } from 'lucide-react'

const ROWS = [
  { key: 'name', label: 'Name', icon: UserRound },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'mobile', label: 'Mobile', icon: Phone },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'farmArea', label: 'Farm Area', icon: Ruler, suffix: ' acres' }
]

export default function FarmerProfile({ farmer }) {
  if (!farmer) return null
  return (
    <div className="card-agro">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="crop-icon-badge" style={{ background: '#2E7D3222', color: '#2E7D32' }}>
          <UserRound size={26} />
        </div>
        <div>
          <h5 className="mb-0">{farmer.name}</h5>
          <span className="text-muted small">Farmer Profile</span>
        </div>
      </div>
      {ROWS.map(({ key, label, icon: Icon, suffix }) => (
        <div className="d-flex align-items-center gap-3 py-2 border-top" key={key}>
          <Icon size={17} className="text-muted" />
          <div className="flex-grow-1">
            <div className="text-muted small">{label}</div>
            <div>{farmer[key] ? `${farmer[key]}${suffix || ''}` : '-'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
