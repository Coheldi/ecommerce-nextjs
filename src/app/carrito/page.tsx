import CartComponent from '@/components/cart/CartComponent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrito de Compras | FoodMarket',
  description: 'Revisa y gestiona los productos en tu carrito de compras',
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <CartComponent />
      </div>
    </div>
  )
}
