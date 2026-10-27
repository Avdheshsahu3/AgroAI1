import React from 'react'
import { motion } from 'framer-motion'
import { Sprout } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        style={{ color: '#2E7D32' }}
      >
        <Sprout size={34} />
      </motion.div>
      <p className="mt-3 text-muted">{label}</p>
    </div>
  )
}
