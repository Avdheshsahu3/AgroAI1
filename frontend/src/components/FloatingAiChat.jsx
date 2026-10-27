import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Sparkles, MessageSquare, Maximize2, Minimize2 } from 'lucide-react'
import RecommendationAiChat from './RecommendationAiChat'
import { soilApi, weatherApi } from '../services/api'

export default function FloatingAiChat({ farmer }) {
  const [isOpen, setIsOpen] = useState(false)
  const [soil, setSoil] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!farmer?.id) return
    let active = true
    Promise.all([
      soilApi.latest(farmer.id).catch(() => null),
      farmer.location ? weatherApi.get(farmer.location, farmer.id).catch(() => null) : null
    ]).then(([soilData, weatherData]) => {
      if (active) {
        setSoil(soilData)
        setWeather(weatherData)
      }
    })
    return () => {
      active = false
    }
  }, [farmer])

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        type="button"
        aria-label="Open AI Agronomist Chat"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="floating-chat-btn position-fixed d-flex align-items-center justify-content-center shadow-lg border-0"
        style={{
          bottom: 24,
          right: 24,
          width: 58,
          height: 58,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          color: '#ffffff',
          zIndex: 1060,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={26} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="position-relative"
            >
              <Bot size={28} />
              <span
                className="position-absolute rounded-circle bg-warning border border-2 border-white"
                style={{ top: -2, right: -2, width: 10, height: 10 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pop-up Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="floating-chat-window position-fixed shadow-2xl overflow-hidden d-flex flex-column"
            style={{
              bottom: 92,
              right: 24,
              width: 'min(440px, calc(100vw - 32px))',
              maxHeight: 'min(640px, calc(100vh - 120px))',
              zIndex: 1059,
              borderRadius: 24,
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.22)'
            }}
          >
            {/* Top Bar */}
            <div
              className="px-3.5 py-2.5 d-flex align-items-center justify-content-between text-white"
              style={{ background: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)' }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 bg-white text-success"
                  style={{ width: 30, height: 30 }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.88rem', lineHeight: 1.2 }}>
                    AgroAI Agronomist
                  </div>
                  <div className="d-flex align-items-center gap-1.5" style={{ fontSize: '0.68rem', color: '#A7F3D0' }}>
                    <Sparkles size={10} />
                    <span>Gemini AI Connected</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link text-white p-1 text-decoration-none opacity-75 hover:opacity-100"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="overflow-y-auto flex-grow-1" style={{ background: '#F8FAF7' }}>
              <RecommendationAiChat
                farmer={farmer}
                soil={soil}
                weather={weather}
                initialCrop="Wheat"
                defaultOpen={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
