import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Rutas que no requieren autenticación
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/products',
  '/api/categories',
  '/api/families'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rutas públicas
  if (publicRoutes.some(route => pathname.startsWith(route)) && request.method === 'GET') {
    return NextResponse.next()
  }

  // Verificar token de autenticación
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    )
  }

  const token = authHeader.split(' ')[1]

  try {
    const encodedSecret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, encodedSecret)

    // Verificar roles para rutas administrativas
    if (pathname.startsWith('/api/admin') && payload.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      )
    }

    // Añadir información del usuario al request
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId as string)
    requestHeaders.set('x-user-role', payload.rol as string)

    return NextResponse.next({
      headers: requestHeaders,
    })

  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    )
  }
}

// Configurar qué rutas deben ser protegidas
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|favicon.ico|public).*)',
  ]
}
