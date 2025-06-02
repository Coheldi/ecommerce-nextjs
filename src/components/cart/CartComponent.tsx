'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function CartComponent() {
  const { state, dispatch } = useCart()
  const router = useRouter()

  const updateQuantity = (id: string, cantidad: number) => {
    if (cantidad < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id })
      return
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, cantidad } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Button onClick={() => router.push('/catalogo')}>
          Ir al Catálogo
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {state.items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <Image
                  src={item.imagen}
                  alt={item.nombre}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{item.nombre}</h3>
                <p className="text-gray-600">
                  {item.precio}€ / {item.unidadMedida}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                >
                  -
                </Button>
                <span className="w-12 text-center">{item.cantidad}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                >
                  +
                </Button>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold">
                  {(item.precio * item.cantidad).toFixed(2)}€
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-2xl font-bold">{state.total.toFixed(2)}€</span>
        </div>
        
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: 'CLEAR_CART' })}
          >
            Vaciar Carrito
          </Button>
          <Button
            onClick={() => router.push('/checkout')}
          >
            Proceder al Pago
          </Button>
        </div>
      </div>
    </div>
  )
}
