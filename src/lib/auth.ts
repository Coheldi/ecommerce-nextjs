export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  direcciones?: {
    id: string;
    calle: string;
    numero: string;
    piso: string | null;
    codigoPostal: string;
    ciudad: string;
    provincia: string;
  }[];
}

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token)
  }
}

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}

export const isAuthenticated = () => {
  return !!getAuthToken()
}

export const getCurrentUser = async (): Promise<User | null> => {
  const token = getAuthToken()
  if (!token) return null

  try {
    const res = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      removeAuthToken()
      return null
    }

    const user = await res.json()
    return user
  } catch (error) {
    console.error('Error fetching current user:', error)
    removeAuthToken()
    return null
  }
}

export const logout = () => {
  removeAuthToken()
  window.location.href = '/login'
}

export const getAuthUser = async (req: Request): Promise<User | null> => {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return null
  }

  try {
    // Here you would typically verify the JWT token
    // For now, we'll just decode it and trust it
    const [_header, payload, _signature] = token.split('.')
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())
    
    return decodedPayload.user
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export const handleApiError = (error: any) => {
  if (error.status === 401) {
    removeAuthToken()
    window.location.href = '/login'
  }
  return error
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  
  if (!token) {
    throw new Error('No authentication token found')
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    if (response.status === 401) {
      removeAuthToken()
      window.location.href = '/login'
      throw new Error('Session expired')
    }

    return response
  } catch (error) {
    throw handleApiError(error)
  }
}
