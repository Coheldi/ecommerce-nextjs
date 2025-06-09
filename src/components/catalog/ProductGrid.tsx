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
        <Card key={product.id} className="modern-card overflow-hidden group">
          <div className="relative h-56 overflow-hidden">
            <Image
              src={product.imagenes[0]}
              alt={product.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="glass-effect px-3 py-1.5 text-sm font-medium rounded-full text-primary">
                {product.categoria.nombre}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-primary text-white px-3 py-1.5 text-sm font-bold rounded-full shadow-lg">
                {product.precio}€
              </span>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {product.nombre}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
              {product.descripcion}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.nombre}
                  className="px-2 py-1 bg-accent/20 text-primary text-xs rounded-full font-medium border border-primary/20"
                >
                  {tag.nombre}
                </span>
              ))}
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {product.precio}€
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    / {product.unidadMedida}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground font-medium px-3 py-1 bg-muted rounded-full">
                  {product.familia.nombre}
                </span>
              </div>
              <Button 
                className="w-full modern-gradient text-white font-semibold hover:shadow-lg transition-all duration-300"
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
