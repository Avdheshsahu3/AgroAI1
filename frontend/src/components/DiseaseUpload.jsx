import React, { useState, useRef, useEffect } from 'react'
import {
  ScanEye,
  ImagePlus,
  Camera,
  X,
  Sparkles,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DiseaseUpload({
  onDetect,
  loading,
  selectedFile,
  setSelectedFile,
  externalPreview,
  setExternalPreview
}) {
  const [file, setFile] = useState(selectedFile || null)
  const [preview, setPreview] = useState(externalPreview || null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  // Sync external changes (e.g. from 1-click specimen samples)
  useEffect(() => {
    if (selectedFile !== undefined) setFile(selectedFile)
    if (externalPreview !== undefined) setPreview(externalPreview)
  }, [selectedFile, externalPreview])

  function handleFile(f) {
    if (!f) return
    setFile(f)
    if (setSelectedFile) setSelectedFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    if (setExternalPreview) setExternalPreview(url)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  function handleClear() {
    setFile(null)
    setPreview(null)
    if (setSelectedFile) setSelectedFile(null)
    if (setExternalPreview) setExternalPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  return (
    <div
      className="card-agro p-4 mb-4 shadow-sm"
      style={{
        borderRadius: 20,
        border: '1.5px solid #E2E8F0',
        background: '#FFFFFF',
        position: 'relative'
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h5 className="fw-bold mb-0.5 d-flex align-items-center gap-2" style={{ color: '#0F172A', fontSize: '1.1rem' }}>
            <ScanEye size={20} className="text-success" /> Leaf Diagnostic Scanner
          </h5>
          <p className="text-muted small mb-0" style={{ fontSize: '0.82rem' }}>
            Upload or photograph a leaf specimen showing visible symptoms or lesions.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-sm btn-light border px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
            style={{ fontSize: '0.78rem', borderRadius: 10 }}
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={14} className="text-primary" /> Camera Snap
          </button>
          <button
            type="button"
            className="btn btn-sm btn-light border px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
            style={{ fontSize: '0.78rem', borderRadius: 10 }}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus size={14} className="text-success" /> Upload Image
          </button>
        </div>
      </div>

      {/* Hidden standard & camera file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="d-none"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="d-none"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Viewfinder Dropzone Container */}
      <div
        className={`upload-dropzone p-4 text-center position-relative overflow-hidden transition-all ${
          dragActive ? 'drag-active' : ''
        }`}
        style={{
          border: preview ? '1.5px solid #10B981' : dragActive ? '2px dashed #059669' : '2px dashed #CBD5E1',
          borderRadius: 16,
          background: preview ? '#0F172A' : dragActive ? '#ECFDF5' : '#F8FAFC',
          minHeight: 230,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: preview ? 'default' : 'pointer'
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => !preview && fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="position-relative w-100 d-flex flex-column align-items-center justify-content-center py-2">
            {/* HUD Viewfinder AR Reticles */}
            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
              {/* Corner Reticles */}
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  width: 24,
                  height: 24,
                  borderTop: '3px solid #10B981',
                  borderLeft: '3px solid #10B981',
                  zIndex: 3
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  borderTop: '3px solid #10B981',
                  borderRight: '3px solid #10B981',
                  zIndex: 3
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -8,
                  left: -8,
                  width: 24,
                  height: 24,
                  borderBottom: '3px solid #10B981',
                  borderLeft: '3px solid #10B981',
                  zIndex: 3
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  width: 24,
                  height: 24,
                  borderBottom: '3px solid #10B981',
                  borderRight: '3px solid #10B981',
                  zIndex: 3
                }}
              />

              {/* Laser Scan Beam Animation when Loading */}
              {loading && (
                <motion.div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'linear-gradient(90deg, transparent, #34D399, #10B981, transparent)',
                    boxShadow: '0 0 15px #10B981, 0 0 25px #34D399',
                    zIndex: 4
                  }}
                  animate={{ top: ['0%', '98%', '0%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <img
                src={preview}
                alt="Leaf Specimen"
                style={{
                  maxHeight: 250,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: 12,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                  display: 'block'
                }}
              />
            </div>

            {/* Clear Image Button */}
            <button
              type="button"
              className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2 rounded-circle p-1.5 d-flex align-items-center justify-content-center"
              style={{
                width: 28,
                height: 28,
                background: 'rgba(0,0,0,0.65)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                zIndex: 5
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              title="Remove Specimen"
            >
              <X size={15} />
            </button>

            {/* File info pill */}
            <div className="mt-2.5 d-flex align-items-center gap-2">
              <span className="badge bg-dark bg-opacity-75 text-light border border-secondary px-2.5 py-1 small">
                {file?.name || 'Leaf_Specimen.png'}
              </span>
              {file?.size && (
                <span className="badge bg-dark bg-opacity-75 text-muted border border-secondary px-2 py-1 small">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 px-3 d-flex flex-column align-items-center gap-2.5">
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(5,150,105,0.14)'
              }}
            >
              <ImagePlus size={30} strokeWidth={1.8} />
            </div>
            <div>
              <div className="fw-bold mb-0.5" style={{ color: '#1E293B', fontSize: '0.98rem' }}>
                Drag & drop your leaf image here, or browse files
              </div>
              <div className="text-muted small" style={{ fontSize: '0.8rem' }}>
                Supports JPEG, PNG, WEBP (Max 10 MB). Clear close-up of leaf lesions recommended.
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center flex-wrap gap-1.5 mt-1">
              <span className="badge bg-light text-muted border px-2.5 py-1 small">🍃 Leaf Spot</span>
              <span className="badge bg-light text-muted border px-2.5 py-1 small">🍂 Blight</span>
              <span className="badge bg-light text-muted border px-2.5 py-1 small">🌾 Powdery Mildew</span>
              <span className="badge bg-light text-muted border px-2.5 py-1 small">✨ Healthy</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <button
        className="btn btn-agro w-100 py-3 mt-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
        style={{
          borderRadius: 14,
          fontSize: '1rem',
          background: !file || loading ? '#94A3B8' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          border: 'none',
          boxShadow: !file || loading ? 'none' : '0 6px 18px rgba(5,150,105,0.28)'
        }}
        disabled={!file || loading}
        onClick={() => onDetect(file)}
      >
        {loading ? (
          <>
            <RefreshCw size={18} className="spinner-border spinner-border-sm" />
            <span>Scanning Specimen with CNN Computer Vision...</span>
          </>
        ) : (
          <>
            <ScanEye size={18} />
            <span>Run AI Diagnostic Scan</span>
          </>
        )}
      </button>
    </div>
  )
}
