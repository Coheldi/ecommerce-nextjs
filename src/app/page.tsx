import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  // Datos de ejemplo para el MVP
  const featuredProducts = [
    {
      id: 1,
      name: "Yogur Natural Orgánico",
      price: 2.99,
      image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
      category: "Lácteos",
    },
    {
      id: 2,
      name: "Pan Integral Artesano",
      price: 3.50,
      image: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg",
      category: "Panadería",
    },
    {
      id: 3,
      name: "Frutas Frescas Mix",
      price: 5.99,
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
      category: "Frutas",
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-2xl overflow-hidden mb-12">
        <Image
          src="https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg"
          alt="Banner principal de la tienda"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">FoodMarket</h1>
          <p className="text-xl mb-8">Los mejores productos frescos a tu puerta</p>
          <Link href="/catalogo">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Ver Catálogo
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{product.price}€</span>
                  <Button variant="outline">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Categorías Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Lácteos', 'Panadería', 'Frutas y Verduras'].map((category) => (
            <Link 
              href={`/catalogo?categoria=${category}`} 
              key={category}
              className="group relative h-40 rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
