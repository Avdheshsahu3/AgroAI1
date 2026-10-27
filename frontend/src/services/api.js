import axios from 'axios'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL
const localApiUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i
const BASE_URL = import.meta.env.PROD
  ? configuredBaseUrl && !localApiUrl.test(configuredBaseUrl)
    ? configuredBaseUrl
    : 'https://agroai1.onrender.com/api'
  : configuredBaseUrl || 'http://localhost:8080/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 35000
})

// Normalizes backend ApiError { status, error, message, details } into a plain message string.
function unwrap(promise) {
  return promise
    .then((res) => res.data)
    .catch((err) => {
      const data = err.response && err.response.data
      const message = (data && (data.message || (data.details && data.details.join(', ')))) || err.message || 'Something went wrong'
      throw new Error(message)
    })
}

export const authApi = {
  register: (payload) => unwrap(client.post('/auth/register', payload)),
  login: (payload) => unwrap(client.post('/auth/login', payload))
}

export const farmerApi = {
  get: (farmerId) => unwrap(client.get(`/farmers/${farmerId}`))
}

export const soilApi = {
  save: (farmerId, payload) => unwrap(client.post(`/soil/${farmerId}`, payload)),
  latest: (farmerId) => unwrap(client.get(`/soil/${farmerId}`)),
  history: (farmerId) => unwrap(client.get(`/soil/${farmerId}/history`)),
  delete: (farmerId, id) => unwrap(client.delete(`/soil/${farmerId}/${id}`)),
  deleteAll: (farmerId) => unwrap(client.delete(`/soil/${farmerId}`))
}

export const weatherApi = {
  get: (location, farmerId) => unwrap(client.get('/weather', { params: { location, farmerId } }))
}

export const marketApi = {
  get: (location) => unwrap(client.get('/market', { params: { location } }))
}

export const mandiLiveApi = {
  getPrices: async ({ state = 'Madhya Pradesh', commodity = 'Onion' } = {}) => {
    const params = new URLSearchParams()
    if (state && state !== 'All') params.append('state', state)
    if (commodity && commodity !== 'All') params.append('commodity', commodity)

    if (!params.has('state') && !params.has('commodity')) {
      params.append('state', 'Madhya Pradesh')
    }

    const url = `https://mandi-api.onrender.com/v1/prices?${params.toString()}`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    })
    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`)
    }
    return res.json()
  }
}

export const govMarketApi = {
  fetchGovMandiPrices: async ({ apiKey, state, district, commodity, limit = 50, offset = 0 } = {}) => {
    const params = new URLSearchParams()
    if (apiKey) params.append('api-key', apiKey)
    params.append('format', 'json')
    params.append('limit', limit)
    params.append('offset', offset)
    if (state) params.append('filters[state]', state)
    if (district) params.append('filters[district]', district)
    if (commodity) params.append('filters[commodity]', commodity)

    const queryStr = params.toString()

    // 1. Try backend proxy
    try {
      const res = await client.get(`/market/ogd-prices?${queryStr}`)
      if (res.data && res.data.records) {
        return { data: res.data, source: 'backend_proxy' }
      }
    } catch {
      // Backend proxy might not be ready or network down
    }

    // 2. Try Vite dev proxy
    try {
      const res = await fetch(`/api-datagov/resource/9ef84268-d588-465a-a308-a864a43d0070?${queryStr}`)
      if (res.ok) {
        const json = await res.json()
        if (json && json.records) {
          return { data: json, source: 'vite_proxy' }
        }
      }
    } catch {
      // Vite proxy failed
    }

    // 3. Try direct fetch
    try {
      const res = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${queryStr}`)
      if (res.ok) {
        const json = await res.json()
        if (json && json.records) {
          return { data: json, source: 'direct_api' }
        }
      }
    } catch {
      // Direct CORS or network error
    }

    return null
  }
}

export const recommendationApi = {
  recommend: (payload) => unwrap(client.post('/recommendation', payload)),
  chat: (payload) => unwrap(client.post('/recommendation/chat', payload))
}

export const diseaseApi = {
  detect: (farmerId, file) => {
    const form = new FormData()
    form.append('image', file)
    return unwrap(
      client.post('/disease/detect', form, {
        params: { farmerId },
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    )
  }
}

export const dashboardApi = {
  get: (farmerId, location) => unwrap(client.get(`/dashboard/${farmerId}`, { params: { location } }))
}

export default client
