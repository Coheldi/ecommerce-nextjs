'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

interface PedidoProducto {
  id: string
  cantidad: number
  precioUnitario: number
  producto: {
    id: string
    nombre: string
    unidadMedida: string
    descripcion: string
  }
}

interface Direccion {
  calle: string
  numero: string
  piso: string | null
  codigoPostal: string
  ciudad: string
  provincia: string
}

interface Pedido {
  id: string
  estado: string
  total: number
  createdAt: string
  productos: PedidoProducto[]
  direccion: Direccion
}

export default function PedidoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await fetch(`/api/pedidos/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!res.ok) {
          throw new Error('Error al cargar el pedido')
        }

        const data = await res.json()
        setPedido(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar el pedido')
      } finally {
        setLoading(false)
      }
    }

    fetchPedido()
  }, [params.id])

  if (loading) return null // Loading component will be shown by Suspense

  if (!pedido) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pedido no encontrado</h2>
          <Link href="/pedidos">
            <Button>Volver a Mis Pedidos</Button>
          </Link>
        </Card>
      </div>
    )
  }

    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  Pedido #{pedido.id.slice(-8)}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Detalles de tu pedido
                </p>
              </div>
              <Link href="/pedidos">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                  Volver a Mis Pedidos
                </Button>
              </Link>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Estado y Resumen */}
              <div className="lg:col-span-2">
                <Card className="modern-card mb-8">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Fecha: <span className="font-medium">{new Date(pedido.createdAt).toLocaleDateString()}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Estado: <span className="font-semibold text-primary text-base">{pedido.estado}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total</p>
                        <p className="font-bold text-3xl text-primary">
                          {pedido.total.toFixed(2)}€
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gradient mb-4">Productos del Pedido</h3>
                      {pedido.productos.map((item) => (
                        <div key={item.id} className="border-b border-primary/10 last:border-0 pb-6 last:pb-0">
                          <div className="flex justify-between mb-3">
                            <div>
                              <p className="font-semibold text-lg">{item.producto.nombre}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.cantidad} x {item.precioUnitario.toFixed(2)}€/{item.producto.unidadMedida}
                              </p>
                            </div>
                            <p className="font-bold text-primary text-lg">
                              {(item.cantidad * item.precioUnitario).toFixed(2)}€
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.producto.descripcion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Dirección de Envío */}
              <div>
                <Card className="modern-card">
                  <div className="p-8">
                    <h2 className="text-2xl font-semibold text-gradient mb-6">Dirección de Envío</h2>
                    <div className="space-y-3">
                      <p className="font-medium text-lg">
                        {pedido.direccion.calle}, {pedido.direccion.numero}
                        {pedido.direccion.piso && `, ${pedido.direccion.piso}`}
                      </p>
                      <p className="text-muted-foreground">
                        {pedido.direccion.codigoPostal}, {pedido.direccion.ciudad}
                      </p>
                      <p className="text-muted-foreground">
                        {pedido.direccion.provincia}
                      </p>
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
