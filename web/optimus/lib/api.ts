import axios from 'axios'

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('token') || ''
}

function getUserId() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('user_id') || ''
}

export const api = axios.create({
  baseURL: '',
  headers: {
    'Cache-Control': 'no-store',
  },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['New-API-User'] = getUserId()
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
