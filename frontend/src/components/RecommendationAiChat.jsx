import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  Sprout,
  Droplets,
  Bug,
  TrendingUp,
  Calendar,
  RefreshCw,
  User,
  Check,
  Copy,
  ChevronDown
} from 'lucide-react'
import { recommendationApi } from '../services/api'
import { askAgroAiChat, generateSuggestions } from '../services/geminiService'
import { getCropVisual } from '../utils/visuals'

export const AVAILABLE_CROPS = [
  'Wheat',
  'Rice',
  'Tomato',
  'Potato',
  'Onion',
  'Cotton',
  'Mustard',
  'Soybean',
  'Maize',
  'Chickpea',
  'Sugarcane',
  'Groundnut',
  'Chilli',
  'Turmeric'
]

// Fallback agronomist knowledge base in case backend is offline/restarting
function generateLocalAgronomyReply(cropName, query, soil, weather) {
  const q = (query || '').toLowerCase()

  // Detect crop from query if mentioned
  let crop = cropName || 'Wheat'
  for (const c of AVAILABLE_CROPS) {
    if (q.includes(c.toLowerCase())) {
      crop = c
      break
    }
  }

  const n = soil?.nitrogen
  const p = soil?.phosphorus
  const k = soil?.potassium
  const ph = soil?.ph
  const moisture = soil?.moisture
  const rain = weather?.rainfall

  // 1. Leaf symptoms & Plant Health Diagnostics
  if (q.includes('yellow') || q.includes('curl') || q.includes('spot') || q.includes('wilt') ||
      q.includes('burn') || q.includes('dying') || q.includes('brown') || q.includes('rot') ||
      q.includes('deficien') || q.includes('pila') || q.includes('peela')) {
    if (q.includes('yellow') || q.includes('peela') || q.includes('pila')) {
      return {
        reply: `### 🍃 Leaf Yellowing (Chlorosis) Diagnosis for **${crop}**\n\n` +
          `Yellowing foliage in **${crop}** typically indicates one of three root causes:\n\n` +
          `1. **Nitrogen (N) Deficiency (Most Common):** Older, lower leaves turn pale yellow while top leaves remain green.\n` +
          (n != null && n < 120 ? `* *Your soil test shows low Nitrogen (${n} kg/ha).* **Action:** Apply 2% Urea foliar spray (20g/L water) or top-dress with Neem-coated Urea.\n` : `* **Action:** Top-dress with 25-30 kg/acre Neem-coated Urea or spray 2% Urea for rapid greening.\n`) +
          `2. **Iron (Fe) / Sulphur (S) Deficiency:** New top leaves turn yellow with dark green veins (interveinal chlorosis).\n` +
          `* **Action:** Spray Ferrous Sulphate (0.5% + 0.1% Citric Acid) or apply agricultural sulphur (25 kg/ha).\n` +
          `3. **Root Waterlogging:** Saturated soil suffocates root oxygen uptake, inducing sudden yellowing.\n` +
          (rain != null && rain > 50 ? `* *Rainfall Alert (${Math.round(rain)} mm):* Clear field drainage furrows immediately.\n` : ''),
        suggestions: [
          `What fertilizer dosage is best for ${crop}?`,
          `How to prevent pests in ${crop}?`,
          `What is the irrigation schedule for ${crop}?`
        ]
      }
    }
    if (q.includes('curl')) {
      return {
        reply: `### 🍃 Leaf Curling Diagnosis for **${crop}**\n\n` +
          `Leaf curl in **${crop}** is usually triggered by:\n\n` +
          `1. **Sucking Pests (Thrips, Aphids, Whiteflies):** Feeding on leaf undersides causes puckering and upward/downward cupping.\n` +
          `* **Remedy:** Spray 1500 ppm Neem Oil (3-5 ml/L water) or Acetamiprid / Thiamethoxam (0.5g/L) for severe infestations.\n` +
          `2. **Viral Leaf Curl:** Leaves become stunted, thickened, and brittle.\n` +
          `* **Remedy:** Uproot severely infected plants and install yellow sticky traps (6/acre) to control the whitefly vector.\n`,
        suggestions: [
          `How to control pests organically in ${crop}?`,
          `What fertilizers should I apply for ${crop}?`,
          `What is the irrigation schedule?`
        ]
      }
    }
    return {
      reply: `### 🍃 Plant Disease & Foliar Care for **${crop}**\n\n` +
        `* **Fungal Leaf Spots / Blight:** Spray Mancozeb 75% WP (2.5 g/L) or Azoxystrobin (1 ml/L).\n` +
        `* **Bacterial Wilt:** Drench root zone with Copper Oxychloride (3 g/L) + Streptocycline (1 g/10 L water).\n` +
        `* **Marginal Leaf Scorch / Burnt Tips:** Potassium deficiency or salinity. Spray Potassium Nitrate (13-0-45) at 10g/L.\n`,
      suggestions: [
        `What fertilizer dosage does ${crop} need?`,
        `How to protect ${crop} from diseases?`,
        `Expected yield per acre?`
      ]
    }
  }

  // 2. Cultivation & How to grow guide
  if (q.includes('how to grow') || q.includes('cultivat') || q.includes('kheti') || q.includes('sow') ||
      q.includes('plant') || q.includes('seed') || q.includes('spacing') || q.includes('variet')) {
    let guide = `### 🌱 Cultivation & Agronomy Protocol for **${crop}**\n\n`
    if (crop.toLowerCase().includes('tomato')) {
      guide += `* **Season:** Kharif (June-July), Rabi (Oct-Nov), or Summer (Jan-Feb). Raise nursery for 25 days.\n` +
        `* **Spacing:** 60x45 cm for determinate; 90x45 cm for indeterminate on raised beds.\n` +
        `* **Staking:** Bamboo stake indeterminate varieties for high fruit quality.\n` +
        `* **Key Varieties:** Arka Rakshak (triple disease resistant), Pusa Ruby, Abhinav.\n` +
        `* **Blossom End Rot Prevention:** Foliar spray Calcium Nitrate (1%) at flowering.\n`
    } else if (crop.toLowerCase().includes('wheat')) {
      guide += `* **Season:** Rabi season (Nov 1–15 optimal). Seed rate: 100 kg/ha timely, 125 kg/ha late.\n` +
        `* **Seed Treatment:** Treat with Carboxin + Thiram (2.5 g/kg) or *Trichoderma* (5 g/kg).\n` +
        `* **Spacing:** 20-22.5 cm row spacing at 4-5 cm depth in moist soil.\n` +
        `* **Key Varieties:** PBW 550, HD 2967, HD 3086, DBW 187 (Karan Vandana), Sharbati.\n` +
        `* **Watering:** 5-6 irrigations; CRI stage (21 days) is critical.\n`
    } else if (crop.toLowerCase().includes('potato')) {
      guide += `* **Season:** Oct-Nov when temperatures drop below 30°C. Seed rate: 30-40 q/ha tubers.\n` +
        `* **Spacing:** Ridge planting at 60x20 cm. Earthing up at 30 days prevents greening.\n` +
        `* **Key Varieties:** Kufri Jyoti, Kufri Pukhraj, Kufri Chipsona.\n` +
        `* **Blight Protection:** Preventative Mancozeb spray (2.5 g/L) before canopy closure.\n`
    } else if (crop.toLowerCase().includes('cotton')) {
      guide += `* **Season:** Sown with monsoon onset (May-June) in deep black/loam soil.\n` +
        `* **Spacing:** 90x60 cm for Bt Cotton hybrids.\n` +
        `* **Key Varieties:** RCH-2 Bt, Bollgard II hybrids, Suraj.\n` +
        `* **Pest Monitoring:** Install 5 pheromone traps/acre for pink bollworm.\n`
    } else {
      guide += `* **Soil Prep:** 2-3 deep plowings followed by harrowing to achieve a fine crumbly tilth.\n` +
        `* **Seed Treatment:** Bio-fungicide treatment (*Trichoderma viride* 5g/kg) is essential.\n` +
        `* **Spacing:** Maintain standard row and plant spacing for sunlight and airflow.\n` +
        `* **Nutrition:** Balanced basal NPK dressing supplemented with organic farmyard manure.\n`
    }
    return {
      reply: guide,
      suggestions: [
        `What fertilizers does ${crop} need?`,
        `What are critical watering stages for ${crop}?`,
        `Expected yield and mandi prices?`
      ]
    }
  }

  // 3. Fertilizer & Nutrition
  if (q.includes('fertilizer') || q.includes('npk') || q.includes('urea') || q.includes('dap') ||
      q.includes('potash') || q.includes('mop') || q.includes('nutrient') || q.includes('zinc') || q.includes('khad')) {
    return {
      reply: `### 🌾 Fertilizer & Nutrient Plan for **${crop}**\n\n` +
        `Balanced fertilization maximizes yield and prevents lodging:\n\n` +
        (n != null && n < 120 ? `* ⚠️ **Nitrogen (N):** Low in your soil (${n} kg/ha). Apply 25-30% extra urea in split doses.\n` : `* ✅ **Nitrogen (N):** Adequate soil reserve (${n || 140} kg/ha).\n`) +
        (p != null && p < 35 ? `* ⚠️ **Phosphorus (P):** Low (${p} kg/ha). Apply SSP or DAP as basal dressing.\n` : `* ✅ **Phosphorus (P):** Good availability for root growth.\n`) +
        (k != null && k < 140 ? `* ⚠️ **Potassium (K):** Low (${k} kg/ha). Apply MOP to enhance disease resistance.\n` : `* ✅ **Potassium (K):** Sufficient reserve for grain/fruit filling.\n`) +
        `\n**Application Schedule:**\n` +
        `1. **Basal (At Sowing):** 50% N + 100% P + 100% K\n` +
        `2. **First Top Dressing (3-4 weeks):** 25% N\n` +
        `3. **Second Top Dressing (Panicle / Flowering):** 25% N\n\n` +
        `*Micronutrient Tip: Apply 10 kg/acre Zinc Sulphate (21%) at land prep for higher chlorophyll vigor.*`,
      suggestions: [
        `What is the irrigation schedule for ${crop}?`,
        `How to protect ${crop} from pests?`,
        `When is the best sowing time?`
      ]
    }
  }

  // 4. Water & Irrigation
  if (q.includes('water') || q.includes('irrigat') || q.includes('moisture') || q.includes('rain') || q.includes('pani')) {
    return {
      reply: `### 💧 Irrigation & Water Management for **${crop}**\n\n` +
        (rain != null && rain > 50 ? `🌧️ **Weather Alert:** Forecasted rainfall is **${Math.round(rain)} mm**. Clear drainage furrows immediately.\n\n` : '') +
        (moisture != null ? `* **Current Soil Moisture:** **${Math.round(moisture)}%** (${moisture < 40 ? 'Low - light irrigation advised' : moisture > 75 ? 'Saturated - avoid watering' : 'Optimal range'}).\n\n` : '') +
        `**Critical Irrigation Stages:**\n` +
        `1. **Crown Root / Early Establishment:** (20-25 days after sowing).\n` +
        `2. **Vegetative Peak / Jointing:** (40-45 days after sowing).\n` +
        `3. **Flowering / Anthesis:** Water stress during flowering can reduce seed set by up to 40%.\n` +
        `4. **Grain / Pod / Tuber Filling:** Light irrigation to ensure plump harvest.\n\n` +
        `*Method Tip: Prefer furrow or drip irrigation to save 30-50% water and prevent fungal foliar diseases.*`,
      suggestions: [
        `What fertilizers are needed for ${crop}?`,
        `What are common disease symptoms in ${crop}?`,
        `What is the expected yield per acre?`
      ]
    }
  }

  // 5. Pests & Diseases
  if (q.includes('pest') || q.includes('disease') || q.includes('insect') || q.includes('fungus') ||
      q.includes('spray') || q.includes('keeda') || q.includes('dawa') || q.includes('aphid') || q.includes('blight')) {
    return {
      reply: `### 🛡️ Integrated Pest & Disease Protection for **${crop}**\n\n` +
        `Integrated Pest Management (IPM) prevents 25-30% harvest losses:\n\n` +
        `* **Seed Treatment:** Treat seeds with *Trichoderma viride* (4g/kg) or Carbendazim (2g/kg) before sowing.\n` +
        `* **Sucking Pests (Aphids, Thrips, Whiteflies):** Spray 1500 ppm Neem Oil (3-5 ml/L water) at early signs.\n` +
        `* **Borers & Caterpillars:** Install 4-5 pheromone traps per acre. Spray *Bacillus thuringiensis* (Bt) or Chlorantraniliprole (0.3 ml/L).\n` +
        `* **Fungal Blights / Rusts:** Spray Mancozeb (2.5 g/L) or Copper Oxychloride at lesion onset.\n` +
        `* **Sticky Traps:** Install 5 yellow + 5 blue sticky traps per acre for continuous monitoring.\n`,
      suggestions: [
        `What organic bio-pesticides work for ${crop}?`,
        `What is the ideal sowing spacing for ${crop}?`,
        `Which crop should I rotate next?`
      ]
    }
  }

  // 6. Yield & Market
  if (q.includes('yield') || q.includes('harvest') || q.includes('profit') || q.includes('price') ||
      q.includes('mandi') || q.includes('rate') || q.includes('bhav') || q.includes('quintal')) {
    return {
      reply: `### 📈 Yield Expectations & Market Selling Strategy for **${crop}**\n\n` +
        `* **Maturity Signs:** 80-85% of foliage turns pale golden, and pods/grains feel firm.\n` +
        `* **Harvest Moisture:** Harvest when grain moisture is 14-18% to prevent field shattering.\n` +
        `* **Safe Storage:** Sun dry thoroughly on clean tarpaulins until moisture reaches <12% to prevent mold and storage weevils.\n` +
        `* **Mandi Strategy:** Check current APMC prices under the AgroAI Market tab to compare nearby mandis before selling.\n`,
      suggestions: [
        `Tell me about fertilizer management for ${crop}`,
        `How to protect ${crop} from diseases?`,
        `What is the next best rotation crop?`
      ]
    }
  }

  // 7. Organic compost, Vermicompost & Manures
  if (q.includes('compost') || q.includes('gobar') || q.includes('fym') || q.includes('manure') ||
      q.includes('jeevamrut') || q.includes('vermi') || q.includes('organic') || q.includes('jaivik')) {
    return {
      reply: `### 🌿 Organic Compost & Bio-Manure Preparation Guide\n\n` +
        `1. **Farmyard Manure (FYM):** Apply well-decomposed cow dung (4-5 tonnes/acre) during summer plowing. It dramatically improves soil organic carbon and microbial flora.\n` +
        `2. **Vermicompost:** Apply 2 tonnes/acre as basal dressing. Contains rich plant hormones (auxins, gibberellins) and available micronutrients.\n` +
        `3. **Jeevamrutha Preparation:** In a 200L plastic drum, mix 10 kg fresh cow dung + 10 L cow urine + 2 kg jaggery (gur) + 2 kg pulse flour (besan) + handful fertile bund soil in 200 L water. Stir twice daily in shade for 48 hours. Apply 200 L/acre with irrigation water.\n` +
        `4. **Neem Cake:** Incorporate 100-150 kg/acre neem cake during final plowing to prevent soil-borne nematodes and termites.\n`,
      suggestions: [
        `How to prepare Beejamrutha seed treatment?`,
        `What is the fertilizer schedule for ${crop}?`,
        `How to control pests organically in ${crop}?`
      ]
    }
  }

  // 8. Government agricultural schemes & Kisan credit
  if (q.includes('scheme') || q.includes('subsidy') || q.includes('kcc') || q.includes('credit') ||
      q.includes('yojana') || q.includes('pm-kisan') || q.includes('bima') || q.includes('loan')) {
    return {
      reply: `### 🏛️ Indian Agricultural Welfare Schemes & Support\n\n` +
        `* **PM-KISAN:** ₹6,000 yearly in three ₹2,000 instalments deposited directly into Aadhaar-linked bank accounts.\n` +
        `* **Kisan Credit Card (KCC):** Loans up to ₹3,00,000 at an effective 4% interest rate with prompt repayment incentive.\n` +
        `* **PM Fasal Bima Yojana (PMFBY):** Comprehensive crop insurance against drought, floods, and unseasonal rainfall with nominal farmer premium (1.5% Rabi / 2% Kharif).\n` +
        `* **PMKSY Micro-Irrigation Subsidy:** 45% to 55% subsidy on Drip and Sprinkler equipment provided through your district agriculture department.\n`,
      suggestions: [
        `How to apply for Kisan Credit Card?`,
        `Drip irrigation subsidy eligibility`,
        `Current MSP and Mandi prices`
      ]
    }
  }

  // 9. General Agronomy & Farming Advice
  return {
    reply: `### 🌾 AgroAI Farm Advisory for **${crop}**\n\n` +
      `Namaste Kisan! I have analyzed your farm telemetry and questions:\n\n` +
      `**Recommended Agricultural Best Practices:**\n` +
      `1. **Crop Health:** Maintain balanced fertilization (NPK + Zinc + Sulphur). Avoid excessive Urea which invites fungal blights.\n` +
      `2. **Water Management:** Irrigate during critical growth stages (crown rooting, flowering, grain filling). Drip or furrow methods save up to 40% water.\n` +
      `3. **Pest Monitoring:** Install yellow and blue sticky traps (5-6 per acre) for continuous pest detection.\n` +
      `4. **Soil Telemetry:** Ensure balanced soil organic carbon by incorporating compost or crop residues.\n\n` +
      `*Feel free to ask any specific question about fertilizers, pests, diseases, irrigation, or any other crop!*`,
    suggestions: [
      `How to grow ${crop} step by step?`,
      `Fertilizer dosage for ${crop}`,
      `Why are leaves turning yellow?`,
      `Irrigation schedule for ${crop}`
    ]
  }
}

export default function RecommendationAiChat({
  farmer,
  soil,
  weather,
  recommendation,
  initialCrop = 'Wheat',
  defaultOpen = true
}) {
  const [selectedCrop, setSelectedCrop] = useState(
    recommendation?.crop || initialCrop || 'Wheat'
  )
  const [cropDropdownOpen, setCropDropdownOpen] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello **${farmer?.name || 'Friend'}**! 👋 I am your AgroAI Assistant. I can answer any question you have—from crops, fertilizers, pests, and soil health to weather, calculations, government schemes, science, or general knowledge. How can I help you today?`,
      suggestions: [
        `What fertilizer is best for ${selectedCrop}?`,
        `How to prepare organic compost?`,
        `What are the benefits of drip irrigation?`,
        `How to apply for Kisan Credit Card (KCC)?`
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Sync if recommendation changes
  useEffect(() => {
    if (recommendation?.crop && recommendation.crop !== selectedCrop) {
      setSelectedCrop(recommendation.crop)
      setMessages((prev) => [
        ...prev,
        {
          id: `rec-update-${Date.now()}`,
          sender: 'ai',
          text: `🌾 **Update:** A recommendation for **${recommendation.crop}** (${Math.round(recommendation?.confidence || 0)}% confidence) is ready! Ask me anything about growing, fertilizing, or protecting your **${recommendation.crop}** crop.`,
          suggestions: [
            `What fertilizer should I apply for ${recommendation.crop}?`,
            `What is the watering schedule for ${recommendation.crop}?`,
            `How to protect ${recommendation.crop} from insects?`
          ],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }
  }, [recommendation?.crop]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle switching crops via dropdown
  const handleSelectCrop = (newCrop) => {
    setSelectedCrop(newCrop)
    setCropDropdownOpen(false)
    setMessages((prev) => [
      ...prev,
      {
        id: `crop-switch-${Date.now()}`,
        sender: 'ai',
        text: `🌱 Switched context to **${newCrop}**. How can I help you with cultivation, soil preparation, or pest management for **${newCrop}**?`,
        suggestions: [
          `How to grow ${newCrop} step by step?`,
          `Fertilizer plan for ${newCrop}`,
          `Pest remedies for ${newCrop}`,
          `Expected yield per acre for ${newCrop}`
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    // Auto-detect if user mentioned another crop in their query
    const lower = text.toLowerCase()
    let activeCrop = selectedCrop
    for (const c of AVAILABLE_CROPS) {
      if (lower.includes(c.toLowerCase())) {
        activeCrop = c
        if (activeCrop !== selectedCrop) {
          setSelectedCrop(activeCrop)
        }
        break
      }
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const payload = {
      farmerId: farmer?.id,
      crop: activeCrop,
      message: text,
      nitrogen: soil?.nitrogen,
      phosphorus: soil?.phosphorus,
      potassium: soil?.potassium,
      ph: soil?.ph,
      moisture: soil?.moisture,
      temperature: weather?.temperature,
      humidity: weather?.humidity,
      rainfall: weather?.rainfall,
      location: farmer?.location || ''
    }

    try {
      let replyData = await askAgroAiChat(payload, { farmer, soil, weather })
      if (!replyData || !replyData.reply) {
        replyData = generateLocalAgronomyReply(activeCrop, text, soil, weather)
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyData.reply || replyData.message,
        suggestions: replyData.suggestions || generateSuggestions(activeCrop, text),
        source: replyData.source || 'gemini',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const fallback = generateLocalAgronomyReply(activeCrop, text, soil, weather)
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-fallback-${Date.now()}`,
          sender: 'ai',
          text: fallback.reply,
          suggestions: fallback.suggestions,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Chat reset. I'm ready to answer any questions about growing **${selectedCrop}** or managing your soil nutrients.`,
        suggestions: [
          `How to grow ${selectedCrop} step by step?`,
          `Fertilizer schedule for ${selectedCrop}`,
          `Why are leaves turning yellow?`,
          `Common pests in ${selectedCrop}`
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Format simple markdown into JSX
  const renderFormattedText = (raw) => {
    if (!raw) return null
    const lines = raw.split('\n')
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return <h5 key={idx} className="mt-2 mb-2 font-display fw-bold text-success">{line.replace('### ', '')}</h5>
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="mb-1 fw-bold text-dark">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2)
        return (
          <li key={idx} className="mb-1">
            <span dangerouslySetInnerHTML={{
              __html: content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }} />
          </li>
        )
      }
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '0.4rem' }} />
      }
      return (
        <p key={idx} className="mb-1" dangerouslySetInnerHTML={{
          __html: line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
        }} />
      )
    })
  }

  const visual = getCropVisual(selectedCrop)
  const CropIcon = visual.icon

  return (
    <div className="card-agro shadow-sm p-0 overflow-hidden d-flex flex-column" style={{ minHeight: 540, borderRadius: '1.25rem' }}>
      {/* Header */}
      <div className="p-2.5 p-sm-3 bg-white border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
          <div
            className="d-flex align-items-center justify-content-center text-white flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1b5038, #28704d)' }}
          >
            <Bot size={20} />
          </div>
          <div className="overflow-hidden">
            <div className="d-flex align-items-center gap-1.5 flex-wrap">
              <span className="fw-bold text-truncate" style={{ fontSize: '0.94rem', color: '#1B5038' }}>AgroAI Assistant</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: '0.65rem' }}>
                <span className="d-inline-block rounded-circle bg-success me-1" style={{ width: 5, height: 5 }} /> Online
              </span>
              <span className="badge rounded-pill d-none d-sm-inline-flex" style={{ fontSize: '0.65rem', background: 'linear-gradient(135deg, #E8F0FE, #F3E8FD)', color: '#1A73E8', border: '1px solid #D2E3FC' }}>
                ✨ Gemini AI
              </span>
            </div>
            <div className="text-muted small text-truncate d-none d-sm-block" style={{ fontSize: '0.74rem' }}>
              Ask anything • Crop &amp; Soil Science • Weather • General Knowledge
            </div>
          </div>
        </div>

        {/* Crop Switcher & Reset */}
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <button
              type="button"
              className="btn btn-sm btn-light border rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1.5 shadow-2xs"
              onClick={() => setCropDropdownOpen(!cropDropdownOpen)}
              style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1B5038' }}
              title="Switch Target Crop"
            >
              <CropIcon size={14} style={{ color: visual.color }} />
              <span>{selectedCrop}</span>
              <ChevronDown size={13} className="text-muted" />
            </button>

            {cropDropdownOpen && (
              <div
                className="position-absolute end-0 mt-1 bg-white border rounded-4 shadow-lg p-2"
                style={{ zIndex: 1050, width: 220, maxHeight: 280, overflowY: 'auto' }}
              >
                <div className="px-2 py-1 text-muted small fw-bold" style={{ fontSize: '0.70rem' }}>
                  SELECT CROP TOPIC:
                </div>
                {AVAILABLE_CROPS.map((c) => {
                  const cv = getCropVisual(c)
                  const CIcon = cv.icon
                  const active = c === selectedCrop
                  return (
                    <button
                      key={c}
                      type="button"
                      className={`btn btn-sm w-100 text-start rounded-3 px-2 py-1.5 d-flex align-items-center gap-2 mb-1 ${
                        active ? 'bg-success text-white fw-bold' : 'btn-light'
                      }`}
                      style={{ fontSize: '0.80rem' }}
                      onClick={() => handleSelectCrop(c)}
                    >
                      <CIcon size={14} style={{ color: active ? '#ffffff' : cv.color }} />
                      <span>{c}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 py-1 px-2.5 rounded-pill"
            onClick={handleReset}
            title="Reset conversation"
            style={{ fontSize: '0.78rem' }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        className="ai-chat-feed p-3 flex-grow-1 overflow-y-auto"
        style={{ maxHeight: 440, minHeight: 340, background: '#F8FAF7' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isUser = m.sender === 'user'
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
              >
                {!isUser && (
                  <div
                    className="me-2 d-flex align-items-center justify-content-center flex-shrink-0 text-white"
                    style={{ width: 34, height: 34, borderRadius: 10, background: '#1B5038', marginTop: 2 }}
                  >
                    <Bot size={18} />
                  </div>
                )}

                <div className="ai-chat-bubble-wrap" style={{ maxWidth: '84%' }}>
                  <div
                    className={`p-3 rounded-4 shadow-sm ${
                      isUser
                        ? 'bg-success text-white'
                        : 'bg-white border text-dark'
                    }`}
                    style={{
                      borderBottomRightRadius: isUser ? 4 : '1.15rem',
                      borderBottomLeftRadius: !isUser ? 4 : '1.15rem',
                      fontSize: '0.88rem',
                      lineHeight: 1.6
                    }}
                  >
                    {isUser ? (
                      <div data-no-translate>{m.text}</div>
                    ) : (
                      <div className="ai-markdown-content" data-no-translate>{renderFormattedText(m.text)}</div>
                    )}

                    <div
                      className={`d-flex align-items-center justify-content-between mt-2 pt-1 border-top ${
                        isUser ? 'border-success-subtle text-white-50' : 'border-light-subtle text-muted'
                      }`}
                      style={{ fontSize: '0.70rem' }}
                    >
                      <div className="d-flex align-items-center gap-1.5">
                        <span>{m.time}</span>
                        {!isUser && (
                          <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-1.5 py-0.5" style={{ fontSize: '0.62rem' }}>
                            ✨ Gemini AI
                          </span>
                        )}
                      </div>
                      {!isUser && (
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-muted"
                          onClick={() => copyToClipboard(m.id, m.text)}
                          title="Copy message"
                        >
                          {copiedId === m.id ? (
                            <span className="text-success d-flex align-items-center gap-1"><Check size={12} /> Copied</span>
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Suggestion Chips from AI */}
                  {!isUser && m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {m.suggestions.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          className="btn btn-sm btn-light border py-1 px-2.5 rounded-pill d-inline-flex align-items-center gap-1 text-secondary"
                          style={{ fontSize: '0.75rem', background: '#ffffff', transition: 'all 0.15s' }}
                          onClick={() => handleSend(s)}
                          disabled={loading}
                        >
                          <Sparkles size={11} className="text-warning" />
                          <span>{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div
                    className="ms-2 d-flex align-items-center justify-content-center flex-shrink-0 bg-secondary-subtle text-secondary"
                    style={{ width: 34, height: 34, borderRadius: 10, marginTop: 2 }}
                  >
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="d-flex align-items-center gap-2 text-muted mb-2 ps-1"
            style={{ fontSize: '0.82rem' }}
          >
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0 text-white"
              style={{ width: 30, height: 30, borderRadius: 8, background: '#1B5038' }}
            >
              <Bot size={16} />
            </div>
            <div className="p-2 px-3 bg-white border rounded-pill d-flex align-items-center gap-2 shadow-xs">
              <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '0.6rem', height: '0.6rem' }} />
              <span>AgroAI Agronomist is analyzing telemetry &amp; formulations...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-top">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="d-flex align-items-center gap-2"
        >
          <input
            type="text"
            className="form-control form-control-lg-touch flex-grow-1"
            placeholder="Ask any question... (e.g. crop care, fertilizers, weather, math, general knowledge)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ fontSize: '0.88rem' }}
          />
          <button
            type="submit"
            className="btn btn-agro d-flex align-items-center justify-content-center px-3"
            disabled={loading || !input.trim()}
            style={{ minWidth: 46, height: 44, borderRadius: '0.75rem' }}
            title="Send question"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
