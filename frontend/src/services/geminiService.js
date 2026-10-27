import { recommendationApi } from './api'

// Gemini API Key configured in AgroAI
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

// High-speed candidate models supporting generateContent
const GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest'
]

/**
 * Builds an empathetic and comprehensive agronomist prompt for Google Gemini
 */
function buildGeminiPrompt(userQuery, { crop, farmer, soil, weather } = {}) {
  let contextBlock = ''
  if (crop && crop !== 'General Crop') contextBlock += `- Crop Context: ${crop}\n`
  if (farmer?.location) contextBlock += `- Location: ${farmer.location}\n`
  if (soil?.nitrogen != null) contextBlock += `- Soil N-P-K: ${soil.nitrogen} : ${soil.phosphorus || '--'} : ${soil.potassium || '--'} kg/ha\n`
  if (soil?.ph != null) contextBlock += `- Soil pH: ${soil.ph}\n`
  if (weather?.temperature != null) contextBlock += `- Temperature: ${Math.round(weather.temperature)}°C\n`

  return `You are AgroAI, a highly capable, knowledgeable, and helpful universal AI assistant.

Instructions:
1. Answer the user's question directly, accurately, and comprehensively on ANY topic. You are a full normal AI assistant that answers all questions (including general knowledge, daily life, science, technology, calculations, writing, languages, health, as well as agricultural, weather, and farming questions).
2. If the user asks about crops, agriculture, fertilizers, pests, or farming, provide expert practical agricultural solutions with actionable steps and dosages.
3. Always format your responses clearly using structured Markdown: bold key terms (**word**), bullet points, and subheadings (###) where appropriate.
4. Understand and reply fluently in whichever language the user writes in (English, Hindi, Hinglish, etc.). Maintain a polite, friendly, and helpful tone.
${contextBlock ? `\nOptional Farm Context (use only if relevant to the user's question):\n${contextBlock}` : ''}
User's Question: "${userQuery}"`
}

/**
 * Direct client-side call to Google Gemini API
 */
export async function directGeminiGenerate(userQuery, context = {}) {
  const prompt = buildGeminiPrompt(userQuery, context)

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      })

      if (!res.ok) continue

      const data = await res.json()
      const candidate = data.candidates?.[0]
      const text = candidate?.content?.parts?.[0]?.text
      if (text && text.trim().length > 0) {
        return text.trim()
      }
    } catch {
      // Try next candidate model
    }
  }
  return null
}

/**
 * Generate intelligent follow-up suggestions based on crop and topic
 */
export function generateSuggestions(crop, query = '') {
  const q = (query || '').toLowerCase()
  const c = crop || 'Wheat'

  if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('khad')) {
    return [
      `What are the split dosages for ${c}?`,
      `How to apply Zinc and micronutrients in ${c}?`,
      `Organic alternatives to chemical DAP`,
      `Irrigation timing after fertilizer application`
    ]
  }
  if (q.includes('pest') || q.includes('spray') || q.includes('keeda') || q.includes('insect')) {
    return [
      `What is the Neem oil dosage per liter?`,
      `How to install pheromone traps in ${c}?`,
      `Fungicide spray for leaf blight in ${c}`,
      `Organic bio-pesticides for sucking pests`
    ]
  }
  if (q.includes('water') || q.includes('irrigat') || q.includes('pani') || q.includes('drip')) {
    return [
      `Critical watering stages for ${c}`,
      `How much water does drip irrigation save?`,
      `Managing waterlogging during heavy rain`,
      `Fertigation schedule through drip pipes`
    ]
  }
  if (q.includes('compost') || q.includes('gobar') || q.includes('organic') || q.includes('jaivik')) {
    return [
      `How to prepare Jeevamrutha at home?`,
      `Vermicompost dosage per acre for ${c}`,
      `Beejamrutha seed treatment process`,
      `Phosphate Rich Organic Manure (PROM) benefits`
    ]
  }
  if (q.includes('scheme') || q.includes('kcc') || q.includes('pm-kisan') || q.includes('subsidy')) {
    return [
      `How to apply for Kisan Credit Card (KCC)?`,
      `Subsidies for drip and sprinkler irrigation`,
      `PM Fasal Bima Yojana claim process`,
      `Solar pump subsidy under PM-KUSUM`
    ]
  }

  return [
    `How to grow ${c} step by step?`,
    `Fertilizer & NPK schedule for ${c}`,
    `How to prevent pests in ${c}?`,
    `Critical watering stages for ${c}`
  ]
}

/**
 * Primary AI Chat method:
 * 1. Tries backend /api/recommendation/chat
 * 2. If backend fails or times out, directly calls Google Gemini API
 * 3. Returns { reply, suggestions, source }
 */
export async function askAgroAiChat(payload, context = {}) {
  // 1. First attempt: Spring Boot Backend
  try {
    const backendRes = await recommendationApi.chat(payload)
    if (backendRes && (backendRes.reply || backendRes.message)) {
      return {
        reply: backendRes.reply || backendRes.message,
        suggestions: backendRes.suggestions || generateSuggestions(payload.crop, payload.message),
        source: 'backend_gemini'
      }
    }
  } catch (err) {
    console.warn('Backend chat API failed, trying direct Gemini AI fallback...', err.message)
  }

  // 2. Second attempt: Direct Gemini AI API call
  try {
    const geminiText = await directGeminiGenerate(payload.message, {
      crop: payload.crop,
      farmer: context.farmer,
      soil: context.soil,
      weather: context.weather
    })

    if (geminiText) {
      return {
        reply: geminiText,
        suggestions: generateSuggestions(payload.crop, payload.message),
        source: 'direct_gemini'
      }
    }
  } catch (err) {
    console.warn('Direct Gemini API call failed:', err.message)
  }

  // 3. Third attempt: Enhanced local agronomy rule engine
  return null
}
