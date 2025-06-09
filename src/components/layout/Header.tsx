'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { state } = useCart()
  const { user, logout } = useAuth()
  
  return (
    <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gradient">
              FoodMarket
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalogo" className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200">
              Catálogo
            </Link>
            <Link href="/categorias" className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200">
              Categorías
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/carrito">
              <Button variant="outline" className="relative modern-gradient text-white border-none hover:shadow-lg transition-all duration-300">
                Carrito
                {state.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {state.items.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 transition-colors duration-200">
                    {user.nombre}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-effect">
                  <Link href="/perfil">
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                      Mi Perfil
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/pedidos">
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                      Mis Pedidos
                    </DropdownMenuItem>
                  </Link>
                  {user.rol === 'admin' && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                        Panel de Admin
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive hover:bg-destructive/10"
                    onClick={logout}
                  >
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="modern-gradient text-white font-semibold hover:shadow-lg transition-all duration-300">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
