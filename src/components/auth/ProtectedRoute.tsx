'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/ui/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (!loading && requireAdmin && user?.rol !== 'admin') {
      router.push('/')
      return
    }
  }, [user, loading, requireAdmin, router])

  if (loading) {
    return <Loading />
  }

  if (!user || (requireAdmin && user.rol !== 'admin')) {
    return null
  }

  return <>{children}</>
}
