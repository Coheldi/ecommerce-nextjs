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
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              FoodMarket
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalogo" className="text-gray-700 hover:text-gray-900">
              Catálogo
            </Link>
            <Link href="/categorias" className="text-gray-700 hover:text-gray-900">
              Categorías
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/carrito">
              <Button variant="outline" className="relative">
                Carrito
                {state.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {state.items.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {user.nombre}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link href="/perfil">
                    <DropdownMenuItem className="cursor-pointer">
                      Mi Perfil
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/pedidos">
                    <DropdownMenuItem className="cursor-pointer">
                      Mis Pedidos
                    </DropdownMenuItem>
                  </Link>
                  {user.rol === 'admin' && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer">
                        Panel de Admin
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={logout}
                  >
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button>
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
