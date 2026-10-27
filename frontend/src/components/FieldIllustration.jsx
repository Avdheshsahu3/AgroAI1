import React from 'react'

export default function FieldIllustration({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of a farm field with sprouting crops under the sun"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9F7EA" />
          <stop offset="100%" stopColor="#CBEACD" />
        </linearGradient>
        <linearGradient id="fieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7FBF6E" />
          <stop offset="100%" stopColor="#4E9A4A" />
        </linearGradient>
        <linearGradient id="fieldGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67AE5B" />
          <stop offset="100%" stopColor="#3D8A3C" />
        </linearGradient>
      </defs>

      <rect width="480" height="360" rx="28" fill="url(#skyGrad)" />

      <circle cx="380" cy="80" r="42" fill="#FFE29A" />
      <circle cx="380" cy="80" r="58" fill="#FFE29A" opacity="0.35" />

      <path d="M60 230 C 140 200, 200 210, 480 200 L 480 360 L 0 360 Z" fill="url(#fieldGrad)" />
      <path d="M0 260 C 90 235, 260 250, 480 235 L 480 360 L 0 360 Z" fill="url(#fieldGrad2)" />

      <g stroke="#2E7D32" strokeWidth="4" strokeLinecap="round">
        <path d="M90 240 L 90 210" />
        <path d="M120 246 L 120 214" />
        <path d="M150 240 L 150 208" />
        <path d="M185 248 L 185 216" />
        <path d="M220 242 L 220 210" />
        <path d="M255 250 L 255 218" />
        <path d="M290 244 L 290 212" />
        <path d="M325 250 L 325 218" />
        <path d="M360 246 L 360 214" />
        <path d="M395 252 L 395 220" />
      </g>
      <g fill="#8BC34A">
        <ellipse cx="90" cy="206" rx="9" ry="6" />
        <ellipse cx="120" cy="210" rx="9" ry="6" />
        <ellipse cx="150" cy="204" rx="9" ry="6" />
        <ellipse cx="185" cy="212" rx="9" ry="6" />
        <ellipse cx="220" cy="206" rx="9" ry="6" />
        <ellipse cx="255" cy="214" rx="9" ry="6" />
        <ellipse cx="290" cy="208" rx="9" ry="6" />
        <ellipse cx="325" cy="214" rx="9" ry="6" />
        <ellipse cx="360" cy="210" rx="9" ry="6" />
        <ellipse cx="395" cy="216" rx="9" ry="6" />
      </g>

      <path d="M0 300 C 80 280, 180 310, 300 292 C 380 280, 440 300, 480 288 L 480 360 L 0 360 Z" fill="#2E7D32" opacity="0.9" />

      <g transform="translate(58 258)">
        <circle r="16" fill="#FFFFFF" opacity="0.9" />
        <path d="M-6 4 L0 -8 L6 4 Z" fill="#2E7D32" />
      </g>
      <g transform="translate(410 270)">
        <circle r="20" fill="#FFFFFF" opacity="0.85" />
        <path d="M-7 5 L0 -10 L7 5 Z" fill="#1b5e20" />
      </g>
    </svg>
  )
}
