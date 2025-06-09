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
        descripcion: 'Yogur natural elaborado con leche orgánica de alta calidad, rico en probióticos naturales',
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
        descripcion: 'Pan integral elaborado de forma artesanal con harinas de calidad superior y semillas',
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
        descripcion: 'Manzanas frescas de cultivo ecológico, dulces y crujientes, perfectas para toda la familia',
        precio: 4.20,
        imagenes: ['https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'],
        unidadMedida: 'kg',
        sku: 'FRU001',
        stock: 100,
        familia: { nombre: 'Frutas' },
        categoria: { nombre: 'Frutas Frescas' },
        tags: [{ nombre: 'Ecológico' }, { nombre: 'Fresco' }]
      },
      {
        id: '4',
        nombre: 'Queso Manchego Curado',
        descripcion: 'Queso manchego artesanal curado en cuevas naturales durante 12 meses',
        precio: 15.99,
        imagenes: ['https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg'],
        unidadMedida: 'kg',
        sku: 'QUE001',
        stock: 15,
        familia: { nombre: 'Lácteos' },
        categoria: { nombre: 'Quesos' },
        tags: [{ nombre: 'Artesano' }, { nombre: 'Curado' }]
      },
      {
        id: '5',
        nombre: 'Miel de Flores Silvestres',
        descripcion: 'Miel pura de flores silvestres, recolectada de colmenas en entornos naturales',
        precio: 8.50,
        imagenes: ['https://images.pexels.com/photos/33307/honey-yellow-sweet-food.jpg'],
        unidadMedida: 'jar',
        sku: 'MIE001',
        stock: 30,
        familia: { nombre: 'Endulzantes' },
        categoria: { nombre: 'Mieles' },
        tags: [{ nombre: 'Natural' }, { nombre: 'Silvestre' }]
      },
      {
        id: '6',
        nombre: 'Aceite de Oliva Virgen Extra',
        descripcion: 'Aceite de oliva virgen extra de primera presión en frío, con denominación de origen',
        precio: 12.99,
        imagenes: ['https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg'],
        unidadMedida: 'botella',
        sku: 'ACE001',
        stock: 40,
        familia: { nombre: 'Aceites' },
        categoria: { nombre: 'Aceites' },
        tags: [{ nombre: 'Virgen Extra' }, { nombre: 'Primera Presión' }]
      }
    ]
  }
}

export default async function CatalogPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gradient">Nuestro Catálogo</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre nuestra amplia selección de productos frescos y de calidad, 
            cuidadosamente seleccionados para ofrecerte lo mejor
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="modern-card max-w-md mx-auto p-8">
              <p className="text-muted-foreground text-lg">No hay productos disponibles en este momento.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductGrid products={products} />
          </div>
        )}
      </div>
    </div>
  )
}
