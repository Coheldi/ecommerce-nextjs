import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/catalog/ProductGrid'

export const metadata: Metadata = {
  title: 'Catálogo | FoodMarket',
  description: 'Explora nuestro catálogo de productos alimenticios frescos y de calidad',
}

async function getProducts() {
  try {
    const products = await prisma.producto.findMany({
      include: {
        familia: true,
        categoria: true,
        tags: true,
      },
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function CatalogPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestro Catálogo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
