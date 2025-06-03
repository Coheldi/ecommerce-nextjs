import { Metadata } from 'next'
import ProductGrid from '@/components/catalog/ProductGrid'

export const metadata: Metadata = {
  title: 'Catálogo | FoodMarket',
  description: 'Explora nuestro catálogo de productos alimenticios frescos y de calidad',
}

async function getProducts() {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = process.env.NODE_ENV === 'production' ? process.env.VERCEL_URL : 'localhost:3001'
    const res = await fetch(`${protocol}://${host}/api/products`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }
    const products = await res.json()
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    // Return sample data as fallback
    return [
      {
        id: '1',
        nombre: 'Yogur Natural Orgánico',
        descripcion: 'Yogur natural elaborado con leche orgánica de alta calidad',
        precio: 2.99,
        imagenes: ['https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg'],
        unidadMedida: 'unidad',
        sku: 'YOG001',
        stock: 50,
        familia: { nombre: 'Lácteos' },
        categoria: { nombre: 'Yogures' },
        tags: [{ nombre: 'Orgánico' }, { nombre: 'Natural' }]
      },
      {
        id: '2',
        nombre: 'Pan Integral Artesano',
        descripcion: 'Pan integral elaborado de forma artesanal con harinas de calidad',
        precio: 3.50,
        imagenes: ['https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg'],
        unidadMedida: 'unidad',
        sku: 'PAN001',
        stock: 25,
        familia: { nombre: 'Panadería' },
        categoria: { nombre: 'Panes' },
        tags: [{ nombre: 'Integral' }, { nombre: 'Artesano' }]
      },
      {
        id: '3',
        nombre: 'Manzanas Ecológicas',
        descripcion: 'Manzanas frescas de cultivo ecológico, dulces y crujientes',
        precio: 4.20,
        imagenes: ['https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'],
        unidadMedida: 'kg',
        sku: 'FRU001',
        stock: 100,
        familia: { nombre: 'Frutas' },
        categoria: { nombre: 'Frutas Frescas' },
        tags: [{ nombre: 'Ecológico' }, { nombre: 'Fresco' }]
      }
    ]
  }
}

export default async function CatalogPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestro Catálogo</h1>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay productos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  )
}
