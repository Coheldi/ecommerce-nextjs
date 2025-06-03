import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    // Dynamic import of Prisma client
    const { prisma } = await import('@/lib/prisma')
    
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const { calle, numero, piso, codigoPostal, ciudad, provincia } = json

    const direccion = await prisma.direccion.create({
      data: {
        calle,
        numero,
        piso,
        codigoPostal,
        ciudad,
        provincia,
        usuarioId: userId
      }
    })

    return NextResponse.json(direccion)
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Error al crear la dirección' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Dynamic import of Prisma client
    const { prisma } = await import('@/lib/prisma')
    
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const direccionId = searchParams.get('id')

    if (!direccionId) {
      return NextResponse.json(
        { error: 'ID de dirección no proporcionado' },
        { status: 400 }
      )
    }

    // Verificar que la dirección pertenece al usuario
    const direccion = await prisma.direccion.findUnique({
      where: { id: direccionId }
    })

    if (!direccion || direccion.usuarioId !== userId) {
      return NextResponse.json(
        { error: 'Dirección no encontrada' },
        { status: 404 }
      )
    }

    // Verificar si la dirección está siendo usada en algún pedido
    const pedidosConDireccion = await prisma.pedido.count({
      where: { direccionId }
    })

    if (pedidosConDireccion > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una dirección que está siendo usada en pedidos' },
        { status: 400 }
      )
    }

    await prisma.direccion.delete({
      where: { id: direccionId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la dirección' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Dynamic import of Prisma client
    const { prisma } = await import('@/lib/prisma')
    
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const { id, ...data } = json

    if (!id) {
      return NextResponse.json(
        { error: 'ID de dirección no proporcionado' },
        { status: 400 }
      )
    }

    // Verificar que la dirección pertenece al usuario
    const direccion = await prisma.direccion.findUnique({
      where: { id }
    })

    if (!direccion || direccion.usuarioId !== userId) {
      return NextResponse.json(
        { error: 'Dirección no encontrada' },
        { status: 404 }
      )
    }

    const direccionActualizada = await prisma.direccion.update({
      where: { id },
      data
    })

    return NextResponse.json(direccionActualizada)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la dirección' },
      { status: 500 }
    )
  }
}
