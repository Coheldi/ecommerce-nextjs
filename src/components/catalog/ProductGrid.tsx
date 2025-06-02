'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"

interface Product {
  id: string
  nombre: string
  descripcion: string
  imagenes: string[]
  precio: number
  unidadMedida: string
  familia: { nombre: string }
  categoria: { nombre: string }
  tags: { nombre: string }[]
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { dispatch } = useCart()

  const addToCart = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        imagen: product.imagenes[0],
        unidadMedida: product.unidadMedida
      }
    })
  }

  return (
    <>
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden flex flex-col">
          <div className="relative h-48">
            <Image
              src={product.imagenes[0]}
              alt={product.nombre}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg mb-2">{product.nombre}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.descripcion}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.tags.map((tag) => (
                <span
                  key={tag.nombre}
                  className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                >
                  {tag.nombre}
                </span>
              ))}
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">
                  {product.precio}€ / {product.unidadMedida}
                </span>
                <span className="text-sm text-gray-600">
                  {product.categoria.nombre}
                </span>
              </div>
              <Button 
                className="w-full"
                onClick={() => addToCart(product)}
              >
                Añadir al Carrito
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
