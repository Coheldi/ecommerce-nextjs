# E-commerce Next.js

Aplicación de comercio electrónico construida con Next.js, Tailwind CSS y Prisma.

## Características

- 🛍️ Catálogo de productos
- 🛒 Carrito de compras
- 👤 Gestión de usuarios
- 📦 Sistema de pedidos
- 📍 Gestión de direcciones
- 🔒 Autenticación y autorización
- 💅 Diseño responsive con Tailwind CSS
- 🎨 Componentes UI con shadcn/ui

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- shadcn/ui

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/coheldi/ecommerce-nextjs.git
cd ecommerce-nextjs
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Ejecutar migraciones de la base de datos:
```bash
npx prisma migrate dev
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── app/                # Rutas y páginas
├── components/         # Componentes reutilizables
├── contexts/          # Contextos de React
├── lib/              # Utilidades y configuraciones
└── types/            # Tipos de TypeScript
```

## Licencia

MIT
