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
      <div className="container mx-auto px-4 py-12">
          <Card className="modern-card max-w-3xl mx-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 text-gradient">Nueva Dirección</h1>
                <p className="text-lg text-muted-foreground">
                  Añade una nueva dirección de envío a tu perfil
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Calle
                    </label>
                    <Input
                      name="calle"
                      value={formData.calle}
                      onChange={handleChange}
                      required
                      className="border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Número
                    </label>
                    <Input
                      name="numero"
                      value={formData.numero}
                      onChange={handleChange}
                      required
                      className="border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Piso (opcional)
                    </label>
                    <Input
                      name="piso"
                      value={formData.piso}
                      onChange={handleChange}
                      placeholder="Ej: 2º B"
                      className="border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Código Postal
                    </label>
                    <Input
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{5}"
                      title="El código postal debe tener 5 dígitos"
                      className="border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Ciudad
                    </label>
                    <Input
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                      className="border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      Provincia
                    </label>
                    <Input
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      required
                      className="border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="modern-gradient text-white font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {loading ? 'Guardando...' : 'Guardar Dirección'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
