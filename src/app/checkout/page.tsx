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
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
            <Button onClick={() => router.push('/catalogo')}>
              Volver al Catálogo
            </Button>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dirección de envío */}
          <div>
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Dirección de Envío</h2>
                <Link href="/direcciones/nueva">
                  <Button variant="outline">Añadir Nueva</Button>
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  {error}
                </div>
              )}

              {user?.direcciones && user.direcciones.length > 0 ? (
                <form onSubmit={handleSubmit}>
                  <RadioGroup
                    value={selectedDireccion}
                    onValueChange={setSelectedDireccion}
                    className="space-y-4"
                  >
                    {user.direcciones.map((direccion) => (
                      <div key={direccion.id} className="flex items-start space-x-3">
                        <RadioGroupItem value={direccion.id} id={direccion.id} />
                        <Label htmlFor={direccion.id} className="leading-relaxed">
                          <div>
                            {direccion.calle}, {direccion.numero}
                            {direccion.piso && `, ${direccion.piso}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {direccion.codigoPostal}, {direccion.ciudad}
                          </div>
                          <div className="text-sm text-gray-600">
                            {direccion.provincia}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Realizar Pedido'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    No tienes direcciones guardadas
                  </p>
                  <Link href="/direcciones/nueva">
                    <Button>Añadir Dirección</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {item.cantidad} x {item.precio}€/{item.unidadMedida}
                      </p>
                    </div>
                    <p className="font-medium">
                      {(item.precio * item.cantidad).toFixed(2)}€
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>{state.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
