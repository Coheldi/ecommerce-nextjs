export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">FoodMarket</h3>
            <p className="text-gray-600 text-sm">
              Tu mercado de alimentación online. Productos frescos y de calidad directos a tu hogar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/catalogo" className="text-gray-600 hover:text-gray-900 text-sm">
                  Catálogo
                </a>
              </li>
              <li>
                <a href="/categorias" className="text-gray-600 hover:text-gray-900 text-sm">
                  Categorías
                </a>
              </li>
              <li>
                <a href="/ofertas" className="text-gray-600 hover:text-gray-900 text-sm">
                  Ofertas
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Atención al Cliente</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contacto" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contacto
                </a>
              </li>
              <li>
                <a href="/envios" className="text-gray-600 hover:text-gray-900 text-sm">
                  Envíos
                </a>
              </li>
              <li>
                <a href="/devoluciones" className="text-gray-600 hover:text-gray-900 text-sm">
                  Devoluciones
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-gray-900 text-sm">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacidad" className="text-gray-600 hover:text-gray-900 text-sm">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="/terminos" className="text-gray-600 hover:text-gray-900 text-sm">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-gray-600 hover:text-gray-900 text-sm">
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} FoodMarket. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
