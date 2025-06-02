'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface Direccion {
  id: string
  calle: string
  numero: string
  piso: string | null
  codigoPostal: string
  ciudad: string
  provincia: string
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const router = useRouter()

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nombre: user.nombre
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          ...(formData.newPassword && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al actualizar el perfil')
      }

      await refreshUser()
      setEditMode(false)
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información Personal */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Información Personal</h2>
            
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nombre
                  </label>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contraseña Actual
                  </label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nueva Contraseña
                  </label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Nombre
                  </label>
                  <p className="mt-1">{user?.nombre}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="mt-1">{user?.email}</p>
                </div>

                <Button onClick={() => setEditMode(true)}>
                  Editar Perfil
                </Button>
              </div>
            )}
          </Card>

          {/* Direcciones */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Mis Direcciones</h2>
              <Button variant="outline" onClick={() => router.push('/direcciones/nueva')}>
                Añadir Dirección
              </Button>
            </div>

            <div className="space-y-4">
              {(user?.direcciones as Direccion[] | undefined)?.map((direccion) => (
                <div 
                  key={direccion.id}
                  className="p-4 border rounded-lg hover:border-gray-400 transition-colors"
                >
                  <p>
                    {direccion.calle}, {direccion.numero}
                    {direccion.piso && `, ${direccion.piso}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {direccion.codigoPostal}, {direccion.ciudad}
                  </p>
                  <p className="text-sm text-gray-600">
                    {direccion.provincia}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
