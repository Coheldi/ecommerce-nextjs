'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

export default function NuevaDireccionPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    calle: '',
    numero: '',
    piso: '',
    codigoPostal: '',
    ciudad: '',
    provincia: ''
  })

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

    try {
      const res = await fetch('/api/user/direcciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar la dirección')
      }

      await refreshUser()
      router.push('/perfil')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar la dirección')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Nueva Dirección</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Calle
                </label>
                <Input
                  name="calle"
                  value={formData.calle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Número
                </label>
                <Input
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Piso (opcional)
                </label>
                <Input
                  name="piso"
                  value={formData.piso}
                  onChange={handleChange}
                  placeholder="Ej: 2º B"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Código Postal
                </label>
                <Input
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{5}"
                  title="El código postal debe tener 5 dígitos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Ciudad
                </label>
                <Input
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Provincia
                </label>
                <Input
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Dirección'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
