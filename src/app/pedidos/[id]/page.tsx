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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Pedido #{pedido.id.slice(-8)}
          </h1>
          <Link href="/pedidos">
            <Button variant="outline">Volver a Mis Pedidos</Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Estado y Resumen */}
          <div className="md:col-span-2">
            <Card className="p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm text-gray-600">
                    Fecha: {new Date(pedido.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estado: <span className="font-semibold">{pedido.estado}</span>
                  </p>
                </div>
                <p className="font-bold text-2xl">
                  {pedido.total.toFixed(2)}€
                </p>
              </div>

              <div className="space-y-4">
                {pedido.productos.map((item) => (
                  <div key={item.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-medium">{item.producto.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {item.cantidad} x {item.precioUnitario.toFixed(2)}€/{item.producto.unidadMedida}
                        </p>
                      </div>
                      <p className="font-medium">
                        {(item.cantidad * item.precioUnitario).toFixed(2)}€
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.producto.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Dirección de Envío */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
              <div className="space-y-2">
                <p>
                  {pedido.direccion.calle}, {pedido.direccion.numero}
                  {pedido.direccion.piso && `, ${pedido.direccion.piso}`}
                </p>
                <p>
                  {pedido.direccion.codigoPostal}, {pedido.direccion.ciudad}
                </p>
                <p>
                  {pedido.direccion.provincia}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
