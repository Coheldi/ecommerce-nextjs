'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedDireccion, setSelectedDireccion] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDireccion) {
      setError('Por favor, selecciona una dirección de envío')
      return
    }

    setError('')
    setLoading(true)

    try {
      const pedido = {
        direccionId: selectedDireccion,
        items: state.items.map(item => ({
          id: item.id,
          cantidad: item.cantidad
        }))
      }

      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pedido)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido')
      }

      // Limpiar el carrito
      dispatch({ type: 'CLEAR_CART' })

      // Redirigir a la página de confirmación
      router.push(`/pedidos/${data.id}`)

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-12">
            <Card className="modern-card max-w-md mx-auto">
              <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gradient">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-6">
                  Añade algunos productos antes de proceder al checkout
                </p>
                <Button 
                  onClick={() => router.push('/catalogo')}
                  className="modern-gradient text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Volver al Catálogo
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-gradient">Checkout</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Completa tu pedido seleccionando una dirección de envío
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dirección de envío */}
            <div className="lg:col-span-2">
              <Card className="modern-card">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gradient">Dirección de Envío</h2>
                    <Link href="/direcciones/nueva">
                      <Button 
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/10 transition-colors duration-200"
                      >
                        Añadir Nueva
                      </Button>
                    </Link>
                  </div>

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6">
                      {error}
                    </div>
                  )}

                  {user?.direcciones && user.direcciones.length > 0 ? (
                    <form onSubmit={handleSubmit}>
                      <RadioGroup
                        value={selectedDireccion}
                        onValueChange={setSelectedDireccion}
                        className="space-y-4 mb-6"
                      >
                        {user.direcciones.map((direccion) => (
                          <div key={direccion.id} className="flex items-start space-x-3 p-4 border border-primary/20 rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-md bg-gradient-to-r from-accent/5 to-transparent">
                            <RadioGroupItem value={direccion.id} id={direccion.id} />
                            <Label htmlFor={direccion.id} className="leading-relaxed cursor-pointer">
                              <div className="font-medium text-lg mb-1">
                                {direccion.calle}, {direccion.numero}
                                {direccion.piso && `, ${direccion.piso}`}
                              </div>
                              <div className="text-sm text-muted-foreground mb-1">
                                {direccion.codigoPostal}, {direccion.ciudad}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {direccion.provincia}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>

                      <Button
                        type="submit"
                        className="w-full modern-gradient text-white font-semibold py-3 hover:shadow-lg transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? 'Procesando...' : 'Realizar Pedido'}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-6 text-lg">
                        No tienes direcciones guardadas
                      </p>
                      <Link href="/direcciones/nueva">
                        <Button className="modern-gradient text-white font-semibold hover:shadow-lg transition-all duration-300">
                          Añadir Dirección
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Resumen del pedido */}
            <div>
              <Card className="modern-card">
                <div className="p-8">
                  <h2 className="text-3xl font-bold mb-6 text-gradient">Resumen del Pedido</h2>
                  <div className="space-y-6">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start p-4 border border-primary/10 rounded-xl bg-gradient-to-r from-accent/5 to-transparent">
                        <div>
                          <p className="font-semibold text-lg">{item.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.cantidad} x {item.precio}€/{item.unidadMedida}
                          </p>
                        </div>
                        <p className="font-bold text-primary text-lg">
                          {(item.precio * item.cantidad).toFixed(2)}€
                        </p>
                      </div>
                    ))}

                    <div className="border-t border-primary/20 pt-6 mt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold">Total</span>
                        <span className="text-3xl font-bold text-primary">{state.total.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
