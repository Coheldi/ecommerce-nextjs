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
  '/api/families',
  '/',
  '/login',
  '/registro',
  '/catalogo'
]

// Rutas de assets y recursos estáticos
const staticRoutes = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/assets'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rutas públicas y estáticas
  if (
    publicRoutes.some(route => pathname.startsWith(route)) ||
    staticRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.') // Permitir archivos con extensión (assets)
  ) {
    return NextResponse.next()
  }

  // Si la ruta es de API, verificar autenticación
  if (pathname.startsWith('/api')) {
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

  // Para rutas de páginas que requieren autenticación, redirigir al login
  return NextResponse.redirect(new URL('/login', request.url))
}

// Configurar qué rutas deben ser protegidas
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|favicon.ico|public).*)',
  ]
}
