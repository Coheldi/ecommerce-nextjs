import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    // Dynamic import of Prisma client
    const { prisma } = await import('@/lib/prisma')
    
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { direccionId, items } = await req.json()

    if (!direccionId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    // Verificar que la dirección pertenece al usuario
    const direccion = await prisma.direccion.findFirst({
      where: {
        id: direccionId,
        userId: user.id
      }
    })

    if (!direccion) {
      return NextResponse.json(
        { error: 'Dirección no encontrada' },
        { status: 404 }
      )
    }

    // Obtener los productos y calcular el total
    const productos = await prisma.producto.findMany({
      where: {
        id: {
          in: items.map(item => item.id)
        }
      }
    })

    if (productos.length !== items.length) {
      return NextResponse.json(
        { error: 'Algunos productos no existen' },
        { status: 400 }
      )
    }

    interface OrderItem {
      id: string
      cantidad: number
    }

    interface Producto {
      id: string
      precio: number
    }

    const total = items.reduce((sum, item: OrderItem) => {
      const producto = productos.find((p: Producto) => p.id === item.id)
      return sum + (producto?.precio || 0) * item.cantidad
    }, 0)

    // Crear el pedido
    const pedido = await prisma.pedido.create({
      data: {
        userId: user.id,
        direccionId,
        estado: 'PENDIENTE',
        total,
        productos: {
          create: items.map((item: OrderItem) => {
            const producto = productos.find((p: Producto) => p.id === item.id)!
            return {
              productoId: item.id,
              cantidad: item.cantidad,
              precioUnitario: producto.precio
            }
          })
        }
      },
      include: {
        productos: {
          include: {
            producto: true
          }
        },
        direccion: true
      }
    })

    // Actualizar el stock de los productos
    await Promise.all(
      items.map(item =>
        prisma.producto.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.cantidad
            }
          }
        })
      )
    )

    return NextResponse.json(pedido)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear el pedido' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    // Dynamic import of Prisma client
    const { prisma } = await import('@/lib/prisma')
    
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const pedidos = await prisma.pedido.findMany({
      where: {
        userId: user.id
      },
      include: {
        productos: {
          include: {
            producto: true
          }
        },
        direccion: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(pedidos)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Error al obtener los pedidos' },
      { status: 500 }
    )
  }
}
