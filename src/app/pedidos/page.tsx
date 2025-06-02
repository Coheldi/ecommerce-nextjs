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

export default function PedidosPage() {
  const router = useRouter()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch('/api/pedidos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!res.ok) {
          throw new Error('Error al cargar los pedidos')
        }

        const data = await res.json()
        setPedidos(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error al cargar los pedidos')
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  if (loading) return null // Loading component will be shown by Suspense

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {pedidos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">No tienes pedidos realizados</p>
              <Link href="/catalogo">
                <Button>Ver Catálogo</Button>
              </Link>
            </Card>
          ) : (
            pedidos.map((pedido) => (
              <Card key={pedido.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Pedido #{pedido.id.slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(pedido.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {pedido.estado}
                    </p>
                    <p className="font-bold text-lg">
                      {pedido.total.toFixed(2)}€
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-medium mb-2">Productos:</p>
                  <div className="space-y-2">
                    {pedido.productos.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.cantidad} x {item.producto.nombre}
                        </span>
                        <span className="font-medium">
                          {(item.cantidad * item.precioUnitario).toFixed(2)}€
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <p className="font-medium mb-2">Dirección de envío:</p>
                  <p className="text-sm">
                    {pedido.direccion.calle}, {pedido.direccion.numero}
                    {pedido.direccion.piso && `, ${pedido.direccion.piso}`}
                  </p>
                  <p className="text-sm">
                    {pedido.direccion.codigoPostal}, {pedido.direccion.ciudad}
                  </p>
                  <p className="text-sm">
                    {pedido.direccion.provincia}
                  </p>
                </div>

                <div className="mt-4 text-right">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/pedidos/${pedido.id}`)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
