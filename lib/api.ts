const CACHE_PREFIX = 'airport_cache_'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
}

function getCacheKey(endpoint: string): string {
  return `${CACHE_PREFIX}${endpoint}`
}

function getFromCache<T>(endpoint: string): T | null {
  try {
    const cached = localStorage.getItem(getCacheKey(endpoint))
    if (!cached) return null

    const entry: CacheEntry<T> = JSON.parse(cached)
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(getCacheKey(endpoint))
      return null
    }

    return entry.data
  } catch {
    return null
  }
}

function setCache<T>(endpoint: string, data: T): void {
  try {
    localStorage.setItem(
      getCacheKey(endpoint),
      JSON.stringify({ data, timestamp: Date.now() } as CacheEntry<T>)
    )
  } catch {
    // Silently fail if cache storage fails
  }
}

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Check cache for GET requests
  if (!options || options.method === 'GET') {
    const cached = getFromCache<T>(endpoint)
    if (cached) {
      return cached
    }
  }

  const response = await fetch(`http://localhost:3000${endpoint}`, options)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  const data = await response.json()

  // Cache GET responses
  if (!options || options.method === 'GET') {
    setCache(endpoint, data)
  }

  return data
}

export function clearCache(endpoint?: string): void {
  if (endpoint) {
    localStorage.removeItem(getCacheKey(endpoint))
  } else {
    // Clear all cache entries
    const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX))
    keys.forEach(key => localStorage.removeItem(key))
  }
}
