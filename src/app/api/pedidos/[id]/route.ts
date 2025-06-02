import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const pedido = await prisma.pedido.findFirst({
      where: {
        id: params.id,
        userId: user.id
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

    if (!pedido) {
      return NextResponse.json(
        { error: 'Pedido no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(pedido)
  } catch (error) {
    console.error('Error al obtener pedido:', error)
    return NextResponse.json(
      { error: 'Error al obtener el pedido' },
      { status: 500 }
    )
  }
}
