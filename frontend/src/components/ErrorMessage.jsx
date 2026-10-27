import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center gap-3" role="alert">
      <span className="d-flex align-items-center gap-2"><AlertTriangle size={18} /> {message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>Retry</button>
      )}
    </div>
  )
}
