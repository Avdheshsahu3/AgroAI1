import React from 'react'
import {
  Wheat,
  Sprout,
  Leaf,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudFog,
  CloudSnow,
  CloudLightning
} from 'lucide-react'

// --- BESPOKE BOTANICAL CROP ICONS ---

// 1. Tomato: Plump round body, 5-point star calyx/sepals, and curved stem (Replaces incorrect Carrot)
export function TomatoIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 21c-4.5 0-8-3.2-8-7.5C4 9.4 7.6 7 12 7s8 2.4 8 6.5c0 4.3-3.5 7.5-8 7.5z" />
      <path d="M12 7c-1.2 0-2.4.4-3.2 1.1" />
      <path d="M12 7c1.2 0 2.4.4 3.2 1.1" />
      <path d="M12 7V3c0-.6.4-1 1-1" />
      <path d="M9.5 6.5L6.5 4" />
      <path d="M14.5 6.5L17.5 4" />
      <path d="M11 6.5L9.5 2.5" />
      <path d="M13 6.5L14.5 2.5" />
    </svg>
  )
}

// 2. Potato: Tuber shape with eye dimples (Replaces incorrect Carrot)
export function PotatoIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6.5 7C9.5 4.5 15 4 18 6.5c3.2 2.7 3.8 7.5 2 10.5-2 3.3-6.5 4.5-10.5 4-4.2-.5-7-3.5-6.5-8 .3-2.5 1.5-4.5 3.5-6z" />
      <path d="M9 9.5c.8-.3 1.6-.2 2.2.2" />
      <path d="M14 11c.7-.2 1.4 0 1.9.4" />
      <path d="M8 15c.6-.2 1.3-.1 1.8.3" />
      <path d="M13.5 16.5c.6-.2 1.2 0 1.6.3" />
      <path d="M12 4.5c-.3-1.2.2-2 1.2-2.5" />
    </svg>
  )
}

// 3. Maize (Corn): Ear of corn with husk leaves and kernel grid (Replaces incorrect Wheat)
export function MaizeIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9 4.5C9 3 10.3 2 12 2s3 1 3 2.5v11c0 2.5-1.3 4.5-3 4.5s-3-2-3-4.5v-11z" />
      <path d="M9 16c-3 0-5-2-5-6 0-3 1.5-6 3.5-8" />
      <path d="M15 16c3 0 5-2 5-6 0-3-1.5-6-3.5-8" />
      <path d="M12 20v2" />
      <path d="M9 6.5h6" />
      <path d="M9 9.5h6" />
      <path d="M9 12.5h6" />
      <path d="M12 2v18" />
    </svg>
  )
}

// 4. Cotton: Fluffy cotton boll with calyx bracts (Replaces generic Flower2)
export function CottonIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 5.5a3.5 3.5 0 0 0-3.5 3.5c0 .3.05.6.14.9A3.5 3.5 0 0 0 6 13a3.5 3.5 0 0 0 3.5 3.5c.3 0 .6-.04.9-.12A3.5 3.5 0 0 0 14 17a3.5 3.5 0 0 0 3.5-3.5c0-.4-.08-.8-.22-1.15A3.5 3.5 0 0 0 17 8.5a3.5 3.5 0 0 0-3.5-3.5c-.5 0-1 .12-1.5.34z" />
      <path d="M8 17.5l-2 3" />
      <path d="M16 17.5l2 3" />
      <path d="M12 17v5" />
    </svg>
  )
}

// 5. Sugarcane: Segmented bamboo-like cane stalks with nodes and leaves (Replaces generic Leaf)
export function SugarcaneIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M10 22V2" />
      <path d="M14 22V2" />
      <path d="M8.5 7h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 17h7" />
      <path d="M15 7c3-1 5-4 5-7-2 1-4 3-5 5" />
      <path d="M9 12c-3-1-5-4-5-7 2 1 4 3 5 5" />
      <path d="M15 17c3-1 4.5-3 5-5-2 1-3.5 2-5 3" />
    </svg>
  )
}

// 6. Groundnut (Peanut): Figure-8 peanut pod with waist (Replaces generic Bean)
export function GroundnutIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M9.5 4.5c-2.5 0-4.5 2-4.5 4.5 0 1.8.8 3.2 2 4-.8.8-1.5 2.2-1.5 3.8 0 2.8 2.2 4.8 5 4.8s4.5-1.5 5.5-3.5c1-2 .5-4.2-.5-5.3 1.2-.8 2-2.2 2-3.8 0-2.5-2-4.5-4.5-4.5-1 0-2 .4-2.8 1-.7-.6-1.5-1-2.7-1z" />
      <path d="M9 9c.5.5 1.5.5 2 0" />
      <path d="M8.5 17c1 .5 2 .5 3 0" />
    </svg>
  )
}

// 7. Chickpea (Gram): Beaked chickpea seed (Replaces generic Bean)
export function ChickpeaIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3c-1.5 0-3 1.5-3 3.5 0 1 .5 2 1.2 2.7C8 10.5 7 12.8 7 15.5c0 3.6 2.2 5.5 5 5.5s5-1.9 5-5.5c0-2.7-1-5-3.2-6.3.7-.7 1.2-1.7 1.2-2.7C15 4.5 13.5 3 12 3z" />
      <path d="M12 6.5v14" />
      <path d="M9.5 14c.8.8 1.7 1.2 2.5 1.2" />
    </svg>
  )
}

// 8. Soybean: Legume pod with 3 bulging seeds
export function SoybeanIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 17C6 11 11 5 19 3c-1 3.5-3 7-6 10-3 3-6.5 5-9 4z" />
      <circle cx="8.5" cy="14" r="1.8" />
      <circle cx="12" cy="10.5" r="1.8" />
      <circle cx="15.5" cy="7" r="1.8" />
      <path d="M3 18.5l2-1.5" />
    </svg>
  )
}

// 9. Rice (Paddy): Arching panicle with hanging grains (Replaces generic Sprout)
export function RiceIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 21C7 16 11 10 18 6" />
      <ellipse cx="18" cy="6" rx="2.5" ry="1.4" transform="rotate(-30 18 6)" />
      <ellipse cx="15.5" cy="8.5" rx="2.5" ry="1.4" transform="rotate(-20 15.5 8.5)" />
      <ellipse cx="13" cy="11.5" rx="2.5" ry="1.4" transform="rotate(-15 13 11.5)" />
      <ellipse cx="10.5" cy="14.5" rx="2.5" ry="1.4" transform="rotate(-10 10.5 14.5)" />
      <path d="M6 19c4-1 8-5 10-10" />
    </svg>
  )
}

// 10. Mustard: 4-petal crucifer flower with silique pod
export function MustardIcon({ size = 24, color = 'currentColor', strokeWidth = 2, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <ellipse cx="12" cy="7" rx="2.2" ry="3.2" />
      <ellipse cx="12" cy="15" rx="2.2" ry="3.2" />
      <ellipse cx="8" cy="11" rx="3.2" ry="2.2" />
      <ellipse cx="16" cy="11" rx="3.2" ry="2.2" />
      <circle cx="12" cy="11" r="1.5" fill={color} />
      <path d="M12 17v5" />
      <path d="M12 19l4-3" />
    </svg>
  )
}

// Master Botanical Crop Visual Dictionary with Accurate Icons & Color Accents
export const CROP_ICON_MAP = {
  Rice: { icon: RiceIcon, color: '#15803D' },
  Paddy: { icon: RiceIcon, color: '#15803D' },
  Wheat: { icon: Wheat, color: '#D97706' },
  Maize: { icon: MaizeIcon, color: '#CA8A04' },
  Corn: { icon: MaizeIcon, color: '#CA8A04' },
  Cotton: { icon: CottonIcon, color: '#0284C7' },
  Soybean: { icon: SoybeanIcon, color: '#16A34A' },
  Groundnut: { icon: GroundnutIcon, color: '#B45309' },
  Peanut: { icon: GroundnutIcon, color: '#B45309' },
  Chickpea: { icon: ChickpeaIcon, color: '#D97706' },
  Gram: { icon: ChickpeaIcon, color: '#D97706' },
  Tomato: { icon: TomatoIcon, color: '#DC2626' },
  Potato: { icon: PotatoIcon, color: '#92400E' },
  Sugarcane: { icon: SugarcaneIcon, color: '#15803D' },
  Mustard: { icon: MustardIcon, color: '#EAB308' }
}

export function getCropVisual(cropName) {
  if (!cropName) return { icon: Sprout, color: '#059669' }
  const match = Object.keys(CROP_ICON_MAP).find(
    (k) => k.toLowerCase() === cropName.trim().toLowerCase()
  )
  return match ? CROP_ICON_MAP[match] : { icon: Sprout, color: '#059669' }
}

// Weather condition strings come from WeatherService.describeWeatherCode() on the backend.
export function getWeatherIcon(condition) {
  if (!condition) return Cloud
  const c = condition.toLowerCase()
  if (c.includes('clear')) return Sun
  if (c.includes('partly')) return CloudSun
  if (c.includes('fog')) return CloudFog
  if (c.includes('drizzle')) return CloudDrizzle
  if (c.includes('rain') || c.includes('shower')) return CloudRain
  if (c.includes('snow')) return CloudSnow
  if (c.includes('thunder')) return CloudLightning
  return Cloud
}
