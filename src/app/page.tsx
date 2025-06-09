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
    },
    {
      id: 4,
      name: "Queso Artesano",
      price: 8.99,
      image: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg",
      category: "Lácteos",
    },
    {
      id: 5,
      name: "Miel de Flores",
      price: 6.50,
      image: "https://images.pexels.com/photos/33307/honey-yellow-sweet-food.jpg",
      category: "Endulzantes",
    },
    {
      id: 6,
      name: "Aceite de Oliva Extra",
      price: 12.99,
      image: "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg",
      category: "Aceites",
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="relative h-[600px] rounded-3xl overflow-hidden mb-16 shadow-2xl">
          <Image
            src="https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg"
            alt="Banner principal de la tienda"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col items-start justify-center text-white px-12">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              <span className="block">FoodMarket</span>
              <span className="block text-4xl font-normal text-white/90">Productos frescos</span>
            </h1>
            <p className="text-xl mb-8 max-w-md leading-relaxed">
              Descubre los mejores productos alimenticios frescos y de calidad, 
              directamente a tu puerta
            </p>
            <Link href="/catalogo">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Productos Destacados</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selección especial de nuestros mejores productos, cuidadosamente elegidos para ti
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="modern-card overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="glass-effect px-3 py-1 text-sm font-medium rounded-full text-primary">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{product.price}€</span>
                    <Button variant="outline" className="hover:bg-primary hover:text-white transition-colors duration-200">
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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Categorías Principales</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestras categorías más populares y encuentra exactamente lo que necesitas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Lácteos', image: 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg' },
              { name: 'Panadería', image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg' },
              { name: 'Frutas y Verduras', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg' }
            ].map((category) => (
              <Link 
                href={`/catalogo?categoria=${category.name}`} 
                key={category.name}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div className="text-center">
                    <h3 className="text-white text-3xl font-bold mb-2">{category.name}</h3>
                    <div className="glass-effect px-4 py-2 rounded-full">
                      <span className="text-primary font-medium">Explorar →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
