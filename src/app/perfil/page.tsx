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
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-gradient">Mi Perfil</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gestiona tu información personal y direcciones de envío
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información Personal */}
            <Card className="modern-card lg:col-span-2">
              <div className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gradient">Información Personal</h2>
                
                {editMode ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">
                        Nombre
                      </label>
                      <Input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="border-primary/20 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">
                        Contraseña Actual
                      </label>
                      <Input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="border-primary/20 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">
                        Nueva Contraseña
                      </label>
                      <Input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="border-primary/20 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Confirmar Nueva Contraseña
                      </label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="border-primary/20 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button 
                        type="submit"
                        disabled={loading}
                        className="modern-gradient text-white font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setEditMode(false)}
                        className="border-primary/20 hover:bg-primary/10"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Nombre
                      </label>
                      <p className="text-lg font-medium">{user?.nombre}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Email
                      </label>
                      <p className="text-lg font-medium">{user?.email}</p>
                    </div>

                    <div className="pt-4">
                      <Button 
                        onClick={() => setEditMode(true)}
                        className="modern-gradient text-white font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Editar Perfil
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Direcciones */}
            <Card className="modern-card">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gradient">Mis Direcciones</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/direcciones/nueva')}
                    className="border-primary/20 hover:bg-primary/10 transition-colors duration-200"
                  >
                    Añadir Dirección
                  </Button>
                </div>

                <div className="space-y-4">
                  {(user?.direcciones as Direccion[] | undefined)?.map((direccion) => (
                    <div 
                      key={direccion.id}
                      className="p-6 border border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-md bg-gradient-to-r from-accent/5 to-transparent"
                    >
                      <p className="font-medium text-lg mb-2">
                        {direccion.calle}, {direccion.numero}
                        {direccion.piso && `, ${direccion.piso}`}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        {direccion.codigoPostal}, {direccion.ciudad}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {direccion.provincia}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
